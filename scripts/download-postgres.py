"""Install only the PostgreSQL runtime from the official EDB Windows archive.

HTTP ranges avoid downloading pgAdmin, headers, and unrelated executables.
All extracted entries are checked against their ZIP CRC and destination path.
"""
import concurrent.futures
import io
from pathlib import Path
import struct
import subprocess
import zipfile
import zlib

URL = "https://get.enterprisedb.com/postgresql/postgresql-18.6-5-windows-x64-binaries.zip"
DESTINATION = Path(__file__).resolve().parents[1] / ".local"
EXECUTABLES = {"postgres.exe", "pg_ctl.exe", "initdb.exe", "psql.exe", "createdb.exe", "pg_isready.exe"}


def fetch_range(start, end):
    partial = DESTINATION / "postgresql.zip"
    if partial.exists() and partial.stat().st_size > end:
        with partial.open("rb") as source:
            source.seek(start)
            return source.read(end - start + 1)
    for attempt in range(3):
        try:
            response = subprocess.run(["curl.exe", "--silent", "--show-error", "--fail", "--location", "--max-time", "120", "--range", f"{start}-{end}", URL], capture_output=True, check=True)
            data = response.stdout
            if len(data) != end - start + 1:
                raise RuntimeError("Incomplete PostgreSQL range download")
            return data
        except Exception:
            if attempt == 2:
                raise


class RemoteArchive(io.RawIOBase):
    def __init__(self, size):
        self.size, self.position = size, 0

    def seek(self, offset, whence=0):
        self.position = offset if whence == 0 else self.position + offset if whence == 1 else self.size + offset
        return self.position

    def tell(self):
        return self.position

    def seekable(self):
        return True

    def read(self, size=-1):
        size = min(size if size >= 0 else self.size, self.size - self.position)
        if size <= 0:
            return b""
        result = fetch_range(self.position, self.position + size - 1)
        self.position += len(result)
        return result


def selected(info):
    name = info.filename
    return not info.is_dir() and (
        name.startswith(("pgsql/share/", "pgsql/lib/"))
        or name.startswith("pgsql/bin/") and (name.endswith(".dll") or Path(name).name in EXECUTABLES)
    )


def extract(info, archive_size, block=None, block_start=0):
    target = (DESTINATION / info.filename).resolve()
    if not target.is_relative_to(DESTINATION.resolve()):
        raise RuntimeError("Unsafe ZIP path")
    if target.exists() and target.stat().st_size == info.file_size:
        if zlib.crc32(target.read_bytes()) == info.CRC:
            return
    # Local ZIP extra fields may differ from the central-directory extra fields.
    end = min(archive_size - 1, info.header_offset + 30 + len(info.filename.encode()) + len(info.extra) + info.compress_size + 1024)
    data = block[info.header_offset - block_start:end - block_start + 1] if block is not None else fetch_range(info.header_offset, end)
    if data[:4] != b"PK\x03\x04":
        raise RuntimeError("Invalid ZIP local header")
    name_length, extra_length = struct.unpack_from("<HH", data, 26)
    start = 30 + name_length + extra_length
    if len(data) < start + info.compress_size:
        data = fetch_range(info.header_offset, info.header_offset + start + info.compress_size - 1)
    compressed = data[start:start + info.compress_size]
    if info.compress_type == zipfile.ZIP_DEFLATED:
        content = zlib.decompress(compressed, -15)
    elif info.compress_type == zipfile.ZIP_STORED:
        content = compressed
    else:
        raise RuntimeError("Unsupported ZIP compression")
    if len(content) != info.file_size or zlib.crc32(content) != info.CRC:
        raise RuntimeError(f"ZIP integrity check failed: {info.filename}")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(content)


def main():
    response = subprocess.run(["curl.exe", "--silent", "--show-error", "--fail", "--head", "--max-time", "60", URL], capture_output=True, text=True, check=True)
    size = next(int(line.split(":", 1)[1]) for line in response.stdout.splitlines() if line.lower().startswith("content-length:"))
    with zipfile.ZipFile(RemoteArchive(size)) as archive:
        entries = [info for info in archive.infolist() if selected(info)]
    print(f"Downloading PostgreSQL runtime: {len(entries)} files, {sum(info.compress_size for info in entries) / 1048576:.1f} MB compressed", flush=True)
    # Nearby files share one range request, avoiding thousands of tiny downloads.
    groups = []
    for info in sorted(entries, key=lambda item: item.header_offset):
        end = min(size - 1, info.header_offset + 30 + len(info.filename.encode()) + len(info.extra) + info.compress_size + 1024)
        if groups and info.header_offset - groups[-1][1] < 65536 and end - groups[-1][0] < 4 * 1048576:
            groups[-1][1] = max(groups[-1][1], end)
            groups[-1][2].append(info)
        else:
            groups.append([info.header_offset, end, [info]])

    def download_group(group):
        start, end, members = group
        cache = DESTINATION / "postgres-downloads" / f"{start}-{end}.part"
        if cache.exists() and cache.stat().st_size == end - start + 1:
            data = cache.read_bytes()
        else:
            data = fetch_range(start, end)
            cache.parent.mkdir(parents=True, exist_ok=True)
            cache.write_bytes(data)
        for info in members:
            extract(info, size, data, start)

    print(f"Fetching {len(groups)} runtime archive ranges", flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        list(pool.map(download_group, groups))
    (DESTINATION / "postgres-runtime.ready").write_text(URL, encoding="utf-8")
    print("PostgreSQL runtime installed in .local/pgsql", flush=True)


if __name__ == "__main__":
    main()

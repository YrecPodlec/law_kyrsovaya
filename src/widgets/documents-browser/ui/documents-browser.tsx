"use client";

import { useState } from "react";
import { DocumentRow, filterDocuments, folderIdsWithin, type CaseDocument, type CaseFolder } from "@/entities/case-document";
import { CollectionEmpty, CollectionLayout, CollectionMenu, CollectionResults, CollectionToolbar } from "@/shared/ui/collection";
import { Panel } from "@/shared/ui/panel";
import styles from "./documents-browser.module.scss";

export function DocumentsBrowser({ documents, folders }: { documents: CaseDocument[]; folders: CaseFolder[] }) {
  const [folder, setFolder] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("date");
  const filtered = filterDocuments(documents, folders, folder, query, sort);
  const selectedFolder = folders.find(item => item.id === folder);
  const options = [{ id: "all", label: "Все документы", count: documents.length }, ...folders.map(item => ({ id: item.id, label: item.name, nested: Boolean(item.parentId), count: documents.filter(document => folderIdsWithin(folders, item.id).has(document.folderId)).length }))];
  const folderLabel = (id: string) => { const current = folders.find(item => item.id === id); const parent = folders.find(item => item.id === current?.parentId); return [parent?.name, current?.name].filter(Boolean).join(" / "); };

  return <Panel labelledBy="documents-title"><header className={styles.header}><div><h2 id="documents-title">Документы дела</h2><p>Выберите папку или найдите документ по названию. Нажмите на документ для предпросмотра.</p></div></header>
    <CollectionLayout menu={<CollectionMenu title="Папки дела" options={options} selected={folder} onSelect={setFolder} />}>
      <CollectionToolbar query={query} onQuery={setQuery} sort={sort} onSort={setSort} searchLabel={selectedFolder ? `Поиск в папке «${selectedFolder.name}»` : "Поиск по всем документам дела"} />
      <CollectionResults>{selectedFolder ? folderLabel(selectedFolder.id) : "Все документы"} · Найдено: {filtered.length} из {documents.length}</CollectionResults>
      {filtered.length ? filtered.map(document => <DocumentRow key={document.id} document={document} folder={folderLabel(document.folderId)} />) : <CollectionEmpty message="Документы не найдены" onReset={() => { setQuery(""); setFolder("all"); }} />}
    </CollectionLayout>
  </Panel>;
}

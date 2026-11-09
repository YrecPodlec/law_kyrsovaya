import { ChevronDown, FileText } from "lucide-react";
import { formatDate } from "@/shared/lib/date";
import type { CaseDocument } from "../model/documents";
import styles from "./document-row.module.scss";

export function DocumentRow({ document, folder }: { document: CaseDocument; folder: string }) {
  return <details className={styles.document}>
    <summary><FileText className={styles.icon} size={23} aria-hidden="true" /><span className={styles.name}><strong>{document.name}</strong><small>{folder} · {document.format} · {document.size}</small></span><span className={styles.date}><time dateTime={document.updatedAt}>{formatDate(document.updatedAt)}</time></span><ChevronDown className={styles.chevron} size={16} aria-hidden="true" /></summary>
    <div className={styles.preview}><span className={styles.label}>Текстовый предпросмотр · учебный пример</span><h3>{document.name}</h3><p>{document.content}</p></div>
  </details>;
}

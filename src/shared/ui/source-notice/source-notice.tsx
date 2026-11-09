import { Info } from "lucide-react";
import styles from "./source-notice.module.scss";

export function SourceNotice({ source, caseNumber }: { source: "documents" | "mail"; caseNumber: string }) {
  return <div className={styles.notice}><Info size={17} aria-hidden="true" /><p><strong>{source === "documents" ? "Файловый архив пока не подключён" : "Почта пока не подключена"}.</strong> Показаны учебные примеры для {caseNumber}. {source === "documents" ? "Предпросмотр содержит демонстрационный текст." : "Отправка и синхронизация писем пока недоступны."}</p></div>;
}

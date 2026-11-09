import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { casePaths } from "@/shared/config/routes";
import styles from "./workspace-header.module.scss";

export function WorkspaceHeader({ caseNumber, section }: { caseNumber?: string; section?: string }) {
  return <header className={styles.header}>
    <nav className={styles.breadcrumb} aria-label="Хлебные крошки">
      <span>Рабочее пространство</span><ChevronRight size={13} aria-hidden="true" />
      {caseNumber ? <><Link href="/cases">Дела</Link><ChevronRight size={13} aria-hidden="true" />{section === "Обзор" ? <span aria-current="page">{caseNumber}</span> : <><Link href={casePaths(caseNumber).overview}>{caseNumber}</Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">{section}</span></>}</> : <span aria-current="page">Дела</span>}
    </nav>
    <div className={styles.account}><span className={styles.avatar} aria-hidden="true">Д</span><div><strong>Демонстрационная среда</strong><span>Учебные данные</span></div></div>
  </header>;
}

import Link from "next/link";
import { FileText, LayoutDashboard, Mail } from "lucide-react";
import { CaseHeading, type LegalCase } from "@/entities/legal-case";
import { casePaths } from "@/shared/config/routes";
import styles from "./case-navigation.module.scss";

export type CaseSection = "overview" | "documents" | "mail";

export function CaseNavigation({ legalCase, section, documentCount, threadCount }: { legalCase: LegalCase; section: CaseSection; documentCount: number; threadCount: number }) {
  const paths = casePaths(legalCase.number);
  const items = [ { id: "overview", label: "Обзор", icon: LayoutDashboard }, { id: "documents", label: "Документы", icon: FileText, count: documentCount }, { id: "mail", label: "Почта", icon: Mail, count: threadCount } ] as const;
  return <div className={styles.context}><CaseHeading legalCase={legalCase} /><p className={styles.client}>{legalCase.client} · {legalCase.category}</p><nav className={styles.navigation} aria-label="Разделы дела">{items.map(item => <Link key={item.id} href={paths[item.id]} aria-current={section === item.id ? "page" : undefined}><item.icon size={16} aria-hidden="true" />{item.label}{"count" in item && <span>{item.count}</span>}</Link>)}</nav></div>;
}

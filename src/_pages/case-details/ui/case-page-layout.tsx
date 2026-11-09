import type { ReactNode } from "react";
import { CircleHelp } from "lucide-react";
import type { LegalCase } from "@/entities/legal-case";
import { getCaseDocuments } from "@/entities/case-document";
import { getCaseThreads } from "@/entities/email-thread";
import { WorkspaceShell } from "@/widgets/workspace-shell";
import { CaseNavigation, type CaseSection } from "@/widgets/case-navigation";
import { formatDate } from "@/shared/lib/date";
import styles from "./case-details-page.module.scss";

export function CasePageLayout({ legalCase, section, children }: { legalCase: LegalCase; section: CaseSection; children: ReactNode }) {
  const labels = { overview: "Обзор", documents: "Документы", mail: "Почта" };
  return <WorkspaceShell caseNumber={legalCase.number} section={labels[section]}>
    <CaseNavigation legalCase={legalCase} section={section} documentCount={getCaseDocuments(legalCase.number).length} threadCount={getCaseThreads(legalCase.number).length} />
    {children}
    <footer className={styles.footer}><span><CircleHelp size={13} aria-hidden="true" />Локальные учебные данные</span><span>Состояние на <time dateTime={legalCase.asOf}>{formatDate(legalCase.asOf)}</time></span></footer>
  </WorkspaceShell>;
}

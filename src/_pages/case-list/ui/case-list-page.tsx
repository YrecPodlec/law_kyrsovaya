import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { demoCases, getCaseTimeline } from "@/entities/legal-case";
import { WorkspaceShell } from "@/widgets/workspace-shell";
import { Panel } from "@/shared/ui/panel";
import { Badge } from "@/shared/ui/badge";
import { casePaths } from "@/shared/config/routes";
import { formatDate } from "@/shared/lib/date";
import styles from "./case-list-page.module.scss";

export function CaseListPage() {
  return <WorkspaceShell>
    <div className={styles.heading}><div><h1>Дела</h1><p>Выберите дело, чтобы открыть его сроки, документы и переписку.</p></div><Badge>Дел: {demoCases.length}</Badge></div>
    <div className={styles.list}>{demoCases.map(legalCase => {
      const { nextDeadline } = getCaseTimeline(legalCase);
      return <Panel key={legalCase.number} className={styles.caseCard}><div className={styles.meta}><span><BriefcaseBusiness size={16} aria-hidden="true" />{legalCase.number}</span><Badge tone="blue" dot>{legalCase.status}</Badge></div><h2><Link href={casePaths(legalCase.number).overview}>{legalCase.title}<ArrowUpRight size={20} aria-hidden="true" /></Link></h2><p className={styles.client}>{legalCase.client} · {legalCase.category}</p><div className={styles.facts}><div><span>Ответственный юрист</span><strong>{legalCase.lawyer}</strong></div><div><span>Ближайший срок</span><strong>{nextDeadline ? formatDate(nextDeadline.date) : "Нет предстоящих сроков"}</strong></div></div></Panel>;
    })}</div>
    <p className={styles.note}>Учебная база · локальные демонстрационные данные</p>
  </WorkspaceShell>;
}

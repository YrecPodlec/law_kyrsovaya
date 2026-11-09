import { CaseFacts, getCaseTimeline, type LegalCase } from "@/entities/legal-case";
import { Panel } from "@/shared/ui/panel";
import { DeadlinePreview } from "./deadline-preview";
import styles from "./case-overview.module.scss";

export function CaseOverview({ legalCase }: { legalCase: LegalCase }) {
  const { nextDeadline } = getCaseTimeline(legalCase);
  return <Panel id="case-overview" labelledBy="overview-title" className={styles.card}>
    <div className={styles.content}><h2 id="overview-title">О деле</h2><p className={styles.description}>{legalCase.description}</p><CaseFacts legalCase={legalCase} /></div>
    <DeadlinePreview event={nextDeadline} asOf={legalCase.asOf} />
  </Panel>;
}

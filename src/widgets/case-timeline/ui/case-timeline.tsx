import { ArrowDown, History } from "lucide-react";
import { getCaseTimeline, TimelineEvent, type LegalCase } from "@/entities/legal-case";
import { Panel } from "@/shared/ui/panel";
import { Badge } from "@/shared/ui/badge";
import styles from "./case-timeline.module.scss";

export function CaseTimeline({ legalCase }: { legalCase: LegalCase }) {
  const { events, nextDeadline } = getCaseTimeline(legalCase);
  return <Panel id="case-timeline" labelledBy="timeline-title" className={styles.card}>
    <div className={styles.header}><div className={styles.title}><span className={styles.icon}><History size={18} aria-hidden="true" /></span><div><h2 id="timeline-title">Таймлайн дела</h2><p>Ключевые события и процессуальные сроки</p></div></div><Badge>{events.length} события</Badge></div>
    <ol className={styles.timeline}>{events.map(event => <TimelineEvent key={event.id} event={event} isNext={event.id === nextDeadline?.id} />)}</ol>
    <div className={styles.footer}><ArrowDown size={12} aria-hidden="true" />От ранних событий к поздним</div>
  </Panel>;
}

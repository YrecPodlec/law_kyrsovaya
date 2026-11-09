import { CalendarDays, Check, FileClock } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { formatDate } from "@/shared/lib/date";
import type { CaseEvent } from "../../model/types";
import styles from "./timeline-event.module.scss";

export function TimelineEvent({ event, isNext }: { event: CaseEvent; isNext: boolean }) {
  const Icon = event.kind === "opened" ? Check : event.kind === "deadline" ? FileClock : CalendarDays;
  return <li className={`${styles.event} ${isNext ? styles.next : ""} ${event.kind === "opened" ? styles.completed : ""}`}>
    <span className={styles.marker} aria-hidden="true"><Icon size={15} /></span>
    <div className={styles.content}>
      <div className={styles.meta}><time dateTime={event.date}>{formatDate(event.date)}</time>{isNext && <Badge tone="amber">Ближайший срок</Badge>}</div>
      <h3>{event.title}</h3><p>{event.description}</p>
      {event.kind === "opened" && <span className={styles.completedLabel}>Завершено</span>}
    </div>
  </li>;
}

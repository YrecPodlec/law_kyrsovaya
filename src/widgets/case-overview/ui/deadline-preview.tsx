import { Clock3 } from "lucide-react";
import type { CaseEvent } from "@/entities/legal-case";
import { daysUntil, formatDate } from "@/shared/lib/date";
import styles from "./deadline-preview.module.scss";

export function DeadlinePreview({ event, asOf }: { event?: CaseEvent; asOf: string }) {
  if (!event) return null;
  const days = daysUntil(event.date, asOf);
  const daysLabel = new Intl.PluralRules("ru").select(days);
  const unit = daysLabel === "one" ? "день" : daysLabel === "few" ? "дня" : "дней";
  return <aside className={styles.deadline} aria-label="Ближайший срок по делу">
    <span className={styles.label}><Clock3 size={15} aria-hidden="true" />Ближайший срок</span>
    <strong className={styles.count}>{days}<small>{unit} до срока</small></strong>
    <h2>{event.title}</h2><time dateTime={event.date}>{formatDate(event.date)}</time>
  </aside>;
}

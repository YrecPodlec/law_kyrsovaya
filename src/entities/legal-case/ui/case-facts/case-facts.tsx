import { Building2, CalendarDays, Scale, UserRound } from "lucide-react";
import { formatDate } from "@/shared/lib/date";
import type { LegalCase } from "../../model/types";
import styles from "./case-facts.module.scss";

export function CaseFacts({ legalCase }: { legalCase: LegalCase }) {
  const facts = [
    { label: "Клиент", value: legalCase.client, icon: Building2 },
    { label: "Ответственный юрист", value: legalCase.lawyer, icon: UserRound },
    { label: "Категория", value: legalCase.category, icon: Scale },
    { label: "Дата открытия", value: formatDate(legalCase.openedAt), icon: CalendarDays },
  ];
  return <dl className={styles.facts}>{facts.map(({ label, value, icon: Icon }) =>
    <div key={label} className={styles.fact}><dt><Icon size={14} aria-hidden="true" />{label}</dt><dd>{value}</dd></div>
  )}</dl>;
}

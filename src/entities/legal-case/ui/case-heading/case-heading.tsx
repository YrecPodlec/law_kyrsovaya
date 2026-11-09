import { BriefcaseBusiness } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import type { LegalCase } from "../../model/types";
import styles from "./case-heading.module.scss";

export function CaseHeading({ legalCase }: { legalCase: LegalCase }) {
  return <div className={styles.heading}>
    <div className={styles.meta}><span className={styles.number}><BriefcaseBusiness size={14} aria-hidden="true" />{legalCase.number}</span><Badge tone="blue" dot>{legalCase.status}</Badge></div>
    <h1 id="case-title">{legalCase.title}</h1>
  </div>;
}

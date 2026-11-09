import { CaseOverview } from "@/widgets/case-overview";
import { CaseTimeline } from "@/widgets/case-timeline";
import type { LegalCase } from "@/entities/legal-case";
import { CasePageLayout } from "./case-page-layout";
import styles from "./case-details-page.module.scss";

export function CaseDetailsPage({ legalCase }: { legalCase: LegalCase }) {
  return <CasePageLayout legalCase={legalCase} section="overview">
    <CaseOverview legalCase={legalCase} />
    <div className={styles.timeline}><CaseTimeline legalCase={legalCase} /></div>
  </CasePageLayout>;
}

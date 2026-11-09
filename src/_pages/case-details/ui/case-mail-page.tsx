import type { LegalCase } from "@/entities/legal-case";
import { getCaseThreads } from "@/entities/email-thread";
import { CasePageLayout } from "./case-page-layout";
import { MailBrowser } from "@/widgets/mail-browser";
import { SourceNotice } from "@/shared/ui/source-notice";

export function CaseMailPage({ legalCase }: { legalCase: LegalCase }) {
  return <CasePageLayout legalCase={legalCase} section="mail"><SourceNotice source="mail" caseNumber={legalCase.number} /><MailBrowser key={legalCase.number} threads={getCaseThreads(legalCase.number)} /></CasePageLayout>;
}

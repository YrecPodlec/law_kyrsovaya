import type { LegalCase } from "@/entities/legal-case";
import { getCaseDocuments, getCaseFolders } from "@/entities/case-document";
import { CasePageLayout } from "./case-page-layout";
import { DocumentsBrowser } from "@/widgets/documents-browser";
import { SourceNotice } from "@/shared/ui/source-notice";

export function CaseDocumentsPage({ legalCase }: { legalCase: LegalCase }) {
  return <CasePageLayout legalCase={legalCase} section="documents"><SourceNotice source="documents" caseNumber={legalCase.number} /><DocumentsBrowser key={legalCase.number} documents={getCaseDocuments(legalCase.number)} folders={getCaseFolders(legalCase.number)} /></CasePageLayout>;
}

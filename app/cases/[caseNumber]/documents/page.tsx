import { notFound } from "next/navigation";
import { findDemoCase, demoCases } from "@/entities/legal-case";
import { CaseDocumentsPage } from "@/_pages/case-details";

export const metadata = { title: "Документы дела" };
export function generateStaticParams() { return demoCases.map(item => ({ caseNumber: item.number })); }
export default async function Page({ params }: PageProps<"/cases/[caseNumber]/documents">) {
  const { caseNumber } = await params;
  const legalCase = findDemoCase(caseNumber);
  if (!legalCase) notFound();
  return <CaseDocumentsPage legalCase={legalCase} />;
}

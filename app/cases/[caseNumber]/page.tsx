import { notFound } from "next/navigation";
import { findDemoCase, demoCases } from "@/entities/legal-case";
import { CaseDetailsPage } from "@/_pages/case-details";

export const metadata = { title: "Обзор дела" };
export function generateStaticParams() { return demoCases.map(item => ({ caseNumber: item.number })); }
export default async function Page({ params }: PageProps<"/cases/[caseNumber]">) {
  const { caseNumber } = await params;
  const legalCase = findDemoCase(caseNumber);
  if (!legalCase) notFound();
  return <CaseDetailsPage legalCase={legalCase} />;
}

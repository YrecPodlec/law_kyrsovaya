import { notFound } from "next/navigation";
import { findDemoCase, demoCases } from "@/entities/legal-case";
import { CaseMailPage } from "@/_pages/case-details";

export const metadata = { title: "Почта дела" };
export function generateStaticParams() { return demoCases.map(item => ({ caseNumber: item.number })); }
export default async function Page({ params }: PageProps<"/cases/[caseNumber]/mail">) {
  const { caseNumber } = await params;
  const legalCase = findDemoCase(caseNumber);
  if (!legalCase) notFound();
  return <CaseMailPage legalCase={legalCase} />;
}

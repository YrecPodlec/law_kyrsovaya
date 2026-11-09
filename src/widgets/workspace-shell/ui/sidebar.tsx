import Link from "next/link";
import { BriefcaseBusiness, GraduationCap, Scale } from "lucide-react";
import styles from "./sidebar.module.scss";

export function Sidebar({ isCaseList }: { isCaseList: boolean }) {
  return <aside className={styles.sidebar}>
    <div className={styles.brand}><span className={styles.logo}><Scale size={23} aria-hidden="true" /></span><span><strong>ПРАВО</strong><small>Юридическая CRM</small></span></div>
    <p className={styles.caption}>Рабочее пространство</p>
    <nav className={styles.navigation} aria-label="Главная навигация">
      <Link className={styles.primary} href="/cases" aria-current={isCaseList ? "page" : undefined}><BriefcaseBusiness size={18} aria-hidden="true" /><span>Дела</span></Link>
    </nav>
    <div className={styles.education}><GraduationCap size={21} aria-hidden="true" /><strong>Учебный проект</strong><p>Единое пространство для дел, сроков и материалов.</p><span>Демонстрационная версия</span></div>
  </aside>;
}

import Link from "next/link";
import styles from "./not-found.module.scss";

export default function CaseNotFound() {
  return <main className={styles.empty}><span>404</span><h1>Дело не найдено</h1><p>Проверьте номер дела или выберите его из списка.</p><Link href="/cases">Вернуться к делам</Link></main>;
}

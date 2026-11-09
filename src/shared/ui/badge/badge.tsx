import type { ReactNode } from "react";
import styles from "./badge.module.scss";

type BadgeProps = { children: ReactNode; tone?: "blue" | "amber" | "green" | "neutral"; dot?: boolean };

export function Badge({ children, tone = "neutral", dot = false }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>
    {dot && <span className={styles.dot} aria-hidden="true" />}{children}
  </span>;
}

import type { ReactNode } from "react";
import styles from "./panel.module.scss";

export function Panel({ children, id, labelledBy, className = "" }: {
  children: ReactNode; id?: string; labelledBy?: string; className?: string;
}) {
  return <section id={id} aria-labelledby={labelledBy} className={`${styles.panel} ${className}`}>{children}</section>;
}

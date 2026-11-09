import type { Metadata } from "next";
import styles from "./app.module.scss";

export const metadata: Metadata = {
  title: { default: "ПРАВО — юридическая CRM", template: "%s · ПРАВО" },
  description: "Учебная CRM юридической фирмы: карточка дела, сроки и материалы.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={styles.document}>
      <body className={styles.body}>{children}</body>
    </html>
  );
}

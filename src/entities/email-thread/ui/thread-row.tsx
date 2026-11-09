import { ChevronDown, Mail } from "lucide-react";
import { formatDate } from "@/shared/lib/date";
import { lastMessageDate, type EmailThread } from "../model/threads";
import styles from "./thread-row.module.scss";

const formatTime = (date: string) => new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Moscow" }).format(new Date(date));

export function ThreadRow({ thread }: { thread: EmailThread }) {
  const messages = [...thread.messages].sort((a, b) => a.date.localeCompare(b.date));
  return <details className={styles.thread}>
    <summary><Mail className={styles.icon} size={22} aria-hidden="true" /><span className={styles.heading}><strong>{thread.subject}</strong><small>{thread.participants}</small><span>Писем: {messages.length}</span></span><time dateTime={lastMessageDate(thread)}>{formatDate(lastMessageDate(thread))}</time><ChevronDown className={styles.chevron} size={16} aria-hidden="true" /></summary>
    <div className={styles.messages} aria-label="Письма от ранних к поздним">{messages.map(message => <article key={message.id} className={styles.message}><header><h3>{message.sender}</h3><time dateTime={message.date}>{formatDate(message.date)}, {formatTime(message.date)} МСК</time></header><p>{message.body}</p></article>)}</div>
  </details>;
}

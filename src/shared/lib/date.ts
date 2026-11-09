export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(value));
}

export function daysUntil(date: string, asOf: string) {
  return Math.ceil((Date.parse(date) - Date.parse(asOf)) / 86_400_000);
}

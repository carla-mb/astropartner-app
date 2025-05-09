// For API submission (ISO 8601 format)
export function formatDateForAPI(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate()
    .toString()
    .padStart(2, '0')}T00:00:00Z`;
}

// For display (YYYY-MM-DD format)
export function formatDateForDisplay(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}
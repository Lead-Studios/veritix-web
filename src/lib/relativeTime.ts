export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const eventDate = new Date(date);
  const seconds = Math.floor((now.getTime() - eventDate.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export function UpdatedTimestamp({ date }: { date: Date | string }) {
  return <span>Updated {getRelativeTime(date)}</span>;
}

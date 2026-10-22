// Frontmatter dates are calendar days ("2024-5-25" or "2019-04-01"). Parse
// the parts and format in UTC so the day never shifts with the viewer's or
// the build machine's timezone.
function parseCalendarDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  if ([year, month, day].some(Number.isNaN)) return new Date(date);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatDate(date: string) {
  return parseCalendarDate(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatDateYear(date: string) {
  return parseCalendarDate(date).toLocaleDateString('en-US', {
    year: 'numeric',
    timeZone: 'UTC',
  });
}

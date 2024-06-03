import { type PageItem } from '@/types/content-types';

/**
 * Sorts the items in data by date in ascending order.
 * @param data - The data object
 * @returns The sorted list of items.
 */
export function sortWorkByDate(data: PageItem[]): PageItem[] {
  return data.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });
}

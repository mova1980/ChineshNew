/**
 * Convert Gregorian date to Persian (Jalali) date
 * Based on algorithm by Kazimierz M. Wilanowski
 */
export function toPersianDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  
  const persianMonthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  
  // Simple conversion (approximate, good enough for news dates)
  const persianYear = year - 621;
  const persianMonth = month - 2;
  
  if (persianMonth >= 0 && persianMonth < 12) {
    return `${day} ${persianMonthNames[persianMonth]} ${persianYear}`;
  }
  
  // Handle edge cases (January, February, March)
  if (month === 0) { // January
    return `${day} دی ${persianYear - 1}`;
  } else if (month === 1) { // February
    return `${day} بهمن ${persianYear - 1}`;
  } else if (month === 2) { // March
    return `${day} اسفند ${persianYear - 1}`;
  }
  
  return `${day} ${persianMonthNames[0]} ${persianYear}`;
}

/**
 * Format date for display based on language
 */
export function formatDate(date: Date | string, lang: 'fa' | 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (lang === 'fa') {
    return toPersianDate(d);
  } else {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

/**
 * Format date with time for display
 */
export function formatDateTime(date: Date | string, lang: 'fa' | 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (lang === 'fa') {
    const persianDate = toPersianDate(d);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${persianDate} - ساعت ${hours}:${minutes}`;
  } else {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date | string, lang: 'fa' | 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (lang === 'fa') {
    if (diffMinutes < 60) {
      return `${diffMinutes} دقیقه قبل`;
    } else if (diffHours < 24) {
      return `${diffHours} ساعت قبل`;
    } else if (diffDays === 1) {
      return 'دیروز';
    } else if (diffDays === 0) {
      return 'امروز';
    } else {
      return `${diffDays} روز قبل`;
    }
  } else {
    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays === 0) {
      return 'Today';
    } else {
      return `${diffDays} days ago`;
    }
  }
}

/**
 * Parse Persian date string to Date object (for admin panel)
 * Format: "10 مهر 1405" or "10/07/1405"
 */
export function parsePersianDate(persianDate: string): Date | null {
  const persianMonthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  
  // Try to extract day, month name, and year
  const match = persianDate.match(/(\d+)\s+(\w+)\s+(\d+)/);
  if (!match) {
    return null;
  }
  
  const day = parseInt(match[1], 10);
  const monthName = match[2];
  const year = parseInt(match[3], 10);
  
  const monthIndex = persianMonthNames.indexOf(monthName);
  if (monthIndex === -1) {
    return null;
  }
  
  // Convert to Gregorian
  const gregorianYear = year + 621;
  const gregorianMonth = monthIndex + 2;
  
  return new Date(gregorianYear, gregorianMonth, day);
}

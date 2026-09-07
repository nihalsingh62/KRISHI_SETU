// Utility functions for dynamic advance date calculation and normalization

export const ADVANCE_BOOKING_DAYS = 4; // Today + next 4 days (5 days total: Today, Tomorrow, Day +2, Day +3, Day +4)

/**
 * Format a Date object as local YYYY-MM-DD string
 */
export const formatLocalIsoDate = (d) => {
  const dateObj = d instanceof Date ? d : new Date(d);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Generate advance booking date options for Today + next N days
 */
export const getAdvanceBookingDates = (daysCount = ADVANCE_BOOKING_DAYS) => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i <= daysCount; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const isoDate = formatLocalIsoDate(d);
    const dayOfMonth = d.getDate();
    const monthShort = d.toLocaleDateString("en-US", { month: "short" });
    const monthLong = d.toLocaleDateString("en-US", { month: "long" });
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });

    let relativeLabel = "";
    if (i === 0) relativeLabel = "Today";
    else if (i === 1) relativeLabel = "Tomorrow";
    else relativeLabel = `Day +${i}`;

    dates.push({
      isoDate,
      displayDate: `${dayOfMonth} ${monthShort}`, // e.g. "8 Sep"
      displayFull: `${dayOfMonth} ${monthLong}`, // e.g. "8 September"
      relativeLabel, // "Today", "Tomorrow", "Day +2"
      weekday, // "Tue", "Wed"
      offsetDays: i,
      isToday: i === 0,
      isTomorrow: i === 1
    });
  }

  return dates;
};

/**
 * Normalize any date representation ("Today", "Tomorrow", "YYYY-MM-DD", etc.)
 * into a canonical YYYY-MM-DD string.
 */
export const normalizeDate = (dateStr) => {
  if (!dateStr || dateStr === "Today") {
    return formatLocalIsoDate(new Date());
  }
  if (dateStr === "Tomorrow") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatLocalIsoDate(tomorrow);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  // Try parsing date string like "10 September" or ISO timestamp
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return formatLocalIsoDate(parsed);
  }
  return dateStr;
};

/**
 * Human-readable label for a booking date
 */
export const formatBookingDate = (dateStr) => {
  if (!dateStr) return "Today";
  const norm = normalizeDate(dateStr);
  const today = new Date();
  const todayIso = formatLocalIsoDate(today);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowIso = formatLocalIsoDate(tomorrow);

  if (norm === todayIso || dateStr === "Today") {
    return `Today (${today.getDate()} ${today.toLocaleDateString("en-US", { month: "short" })})`;
  }
  if (norm === tomorrowIso || dateStr === "Tomorrow") {
    return `Tomorrow (${tomorrow.getDate()} ${tomorrow.toLocaleDateString("en-US", { month: "short" })})`;
  }

  // Parse YYYY-MM-DD
  const parts = norm.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      const monthShort = d.toLocaleDateString("en-US", { month: "short" });
      const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const diffDays = Math.round((d.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));
      const relLabel = diffDays > 1 ? ` (Day +${diffDays})` : "";
      return `${weekday}, ${day} ${monthShort}${relLabel}`;
    }
  }

  return dateStr;
};

/**
 * Validate that a date string is within the allowed advance booking window
 */
export const isDateInAdvanceWindow = (dateStr, daysCount = ADVANCE_BOOKING_DAYS) => {
  const norm = normalizeDate(dateStr);
  const todayIso = formatLocalIsoDate(new Date());

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + daysCount);
  const maxIso = formatLocalIsoDate(maxDate);

  if (norm < todayIso) {
    return { valid: false, reason: "PAST_DATE" };
  }
  if (norm > maxIso) {
    return { valid: false, reason: "OUTSIDE_WINDOW" };
  }

  return { valid: true, isoDate: norm };
};

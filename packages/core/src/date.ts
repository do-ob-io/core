/**
 * Return a JSON date string.
 */
export function dateJson(date?: Date) {
  return date?.toJSON() ?? new Date().toJSON();
};

// Define time multipliers for each unit
const timeMultipliers: { [key: string]: number } = {
  d: 24 * 60 * 60 * 1000, // days to milliseconds
  h: 60 * 60 * 1000,      // hours to milliseconds
  m: 60 * 1000,           // minutes to milliseconds
  s: 1000                 // seconds to milliseconds
};

/**
 * Converts a string of time units to their millisecond equivalent.
 */
function stringToMilliseconds(timeString: string): number {
  // Define regex to match days, hours, minutes, and seconds
  const regex = /(\d+)([dhms])/g;

  // Initialize the total milliseconds
  let totalMilliseconds = 0;

  // Match the regex and convert to milliseconds
  let match;
  while ((match = regex.exec(timeString)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2];

    if (timeMultipliers[unit]) {
      totalMilliseconds += value * timeMultipliers[unit];
    }
  }

  return totalMilliseconds;
}

/**
 * Create a date instance from a time string.
 */
export function dateCreate(timeString?: string) {
  if (!timeString) {
    return new Date();
  }
  return new Date(Date.now() + stringToMilliseconds(timeString));
}

/**
 * Create a numeric date value. Needed typically for bearers.
 */
export function dateNumeric(date?: Date | string) {
  if (typeof date === 'string') {
    const millisecond = stringToMilliseconds(date);

    return new Date(Date.now() + millisecond).getTime();
  }
  return (date?.getTime() ?? new Date().getTime());
};

/**
 * Alias for `dateCreate`.
 */
export const d = dateCreate;

/**
 * Alias for `dateNumeric`.
 */
export const dN = dateNumeric;

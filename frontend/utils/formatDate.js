/**
 * Safely formats a date string into a human-readable format.
 * @param {string|Date} dateSource - The date to format.
 * @param {string} placeholder - The text to show if the date is invalid or missing.
 * @returns {string} - The formatted date or the placeholder.
 */
export const formatDate = (dateSource, placeholder = 'Not Recorded') => {
  if (dateSource === null || dateSource === undefined) return placeholder;
  if (typeof dateSource === 'string') {
    const trimmed = dateSource.trim();
    if (!trimmed || trimmed === '0000-00-00' || trimmed === 'null' || trimmed === 'undefined') {
      return placeholder;
    }
  }

  try {
    const date = new Date(dateSource);

    // Check if the date is valid
    if (!isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC' // Forces consistent parsing for DATE columns
      }).format(date);
    }

    if (typeof dateSource === 'string') {
      const trimmed = dateSource.trim();
      if (/^\d{4}[-/]\d{2}[-/]\d{2}/.test(trimmed)) {
        return trimmed;
      }
    }

    return placeholder;
  } catch (err) {
    if (typeof dateSource === 'string' && /^\d{4}[-/]\d{2}[-/]\d{2}/.test(dateSource.trim())) {
      return dateSource.trim();
    }
    return placeholder;
  }
};


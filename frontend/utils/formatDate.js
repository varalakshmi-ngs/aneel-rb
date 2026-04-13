/**
 * Safely formats a date string into a human-readable format.
 * @param {string|Date} dateSource - The date to format.
 * @param {string} placeholder - The text to show if the date is invalid or missing.
 * @returns {string} - The formatted date or the placeholder.
 */
export const formatDate = (dateSource, placeholder = 'Not Recorded') => {
  if (!dateSource || dateSource === '0000-00-00' || dateSource === 'null' || dateSource === 'undefined') return placeholder;
  
  try {
    const date = new Date(dateSource);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return placeholder;
    }
    
    // Return in a clean format: "January 1, 2024"
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC' // Forces consistent parsing for DATE columns
    }).format(date);
  } catch (err) {
    return placeholder;
  }
};


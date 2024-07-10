/**
 * Handles can only be alphanumeric and underscores, and must be between 4 and 20 characters.
 */
export const handle = /^(?=[a-zA-Z0-9_]{4,20}$)(?!.*[_]{2}).*$/;

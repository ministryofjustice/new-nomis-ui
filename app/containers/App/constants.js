/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const DEFAULT_LOCALE = 'en'
export const DEFAULT_MOMENT_DATE_FORMAT_SPEC = 'L'
export const DEFAULT_MOMENT_TIME_FORMAT_SPEC = 'LT'
export const DATE_TIME_FORMAT_SPEC = 'YYYY-MM-DDTHH:mm:ss'
export const DATE_ONLY_FORMAT_SPEC = 'DD/MM/YYYY'
export const ISO_8601_DATE_FORMAT = 'YYYY-MM-DD'

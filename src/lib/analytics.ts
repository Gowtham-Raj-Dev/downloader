export type Platform = 'instagram' | 'youtube' | 'pinterest';
export type ActionType = 'single' | 'multi';
export type Action = 'fetch' | 'download';

export const trackUserAction = async (
  platform: Platform,
  type: ActionType,
  action: Action,
  count: number = 1
) => {
  // Do nothing
};

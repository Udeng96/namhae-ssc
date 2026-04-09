export const SOCIAL_PHOTO_MENU = {
  NONE:      'NONE',
  PHOTO:     'PHOTO',
  VMS_PHOTO: 'VMS_PHOTO',
  NORM:      'NORM',
  EMER:      'EMER',
} as const;

export const SOCIAL_VIDEO_MENU = {
  NONE:      'NONE',
  VIDEO:     'VIDEO',
  VMS_VIDEO: 'VMS_VIDEO',
  YOUTUBE:   'YOUTUBE',
} as const;

export type SocialPhotoMenu = typeof SOCIAL_PHOTO_MENU[keyof typeof SOCIAL_PHOTO_MENU];
export type SocialVideoMenu = typeof SOCIAL_VIDEO_MENU[keyof typeof SOCIAL_VIDEO_MENU];

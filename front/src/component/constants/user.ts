export const USER_TYPE = {
  ADMIN: '001',
  FIRE: '004',
  SENIOR: '006',
} as const;

export type UserTypeCode = typeof USER_TYPE[keyof typeof USER_TYPE];

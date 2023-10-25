

export enum GENDER_ENUM {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  TRANSMAN = 'TRANSMAN',
  TRANSWOMAN = 'TRANSWOMAN',
  DONT_KNOW = 'DONT_KNOW',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
  OTHER = 'OTHER',
}

export enum ENUM_ROLE_TYPE {
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER = 'USER',
  ADMIN = 'ADMIN',
}
export const userSelectfields = [
  'country',
  'firstName',
  'lastName',
  'email',
  'roles',
  'isActive',
  'createdAt',
  'updatedAt',
  'gender',
  'isEmailVerified',
  'lastLoggedIn',
  'id',
]

export const userRelations = [
  "transactions",
  "wallets"
]
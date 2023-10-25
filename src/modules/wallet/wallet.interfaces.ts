export enum CURRENCY_ENUM {
  USD = 'USD',
  EUR = 'EUR',
  USDT = 'USDT',
  RWF = 'RWF',
}
export enum WALLET_STATUS_ENUM {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
}

export enum TRANSACTION_TYPE_ENUM {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum TRANSACTION_STATUS_ENUM {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export const walletSelectfields = [
  'name',
  'currency',
  'pendingBalance',
  'availableBalance',
  'floatBalance',
  'ledgerBalance',
  'status',
  'isDeleted',
  'id',
];
export const walletRelations = ['transactions', 'user'];

export const transactionSelectfields = [
  'action',
  'status',
  'amount',
  'description',
  'walletStateAfter',
  'walletStateBefore',
  'reference',
  'transactionDate',
  'id',
];
export const transactionRelations = ['wallet', 'user'];

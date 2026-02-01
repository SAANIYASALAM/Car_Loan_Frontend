import { PaymentStatus } from './enums';

export interface EmiPayment {
  emiPaymentId: number;
  loanId: number;
  amount: number;
  dueDate: Date;
  paymentDate?: Date;
  status: PaymentStatus;
  emiNumber: number;
  lateFee: number;
  paymentMethod?: string;
  transactionId?: string;
}

export interface EmiPaymentDto {
  loanId: number;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
}

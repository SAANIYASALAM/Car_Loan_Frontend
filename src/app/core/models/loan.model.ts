import { CarType, LoanStatus } from './enums';
import { User } from './user.model';

export interface Loan {
  loanId: number;
  userId: number;
  carPrice: number;
  loanAmount: number;
  carType: CarType;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  status: LoanStatus;
  remainingEmis: number;
  nextDueDate?: Date;
  paidAmount: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  applicationDate: Date;
  approvalDate?: Date;
  disbursementDate?: Date;
  rejectionReason?: string;
  user?: User;
}

export interface LoanApplicationDto {
  userId: number;
  carType: CarType;
  carPrice: number;
  monthlyIncome: number;
  employmentType?: string;
  creditScore: number;
  downPaymentPercent: number;
  tenure: number;
  userAge: number;
}

export interface EligibilityCheckDto {
  eligible: boolean;
  estimatedEmi: number;
  interestRate: number;
  reason: string;
}

export interface EmiCalculationDto {
  principal: number;
  rate: number;
  tenure: number;
}

export interface LoanRuleDto {
  carType: CarType;
  baseRate: number;
  minDownPaymentPercent: number;
  riskFactor?: string;
  discount?: string;
}

export interface LoanFilterDto {
  status?: LoanStatus;
  carType?: CarType;
  fromDate?: Date;
  toDate?: Date;
}

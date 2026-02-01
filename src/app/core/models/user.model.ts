export interface User {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  kycStatus: string;
  creditScore: number;
  profileImage?: string;
  monthlyIncome: number;
  employmentType?: string;
  role: string;
  isActive?: boolean;
  createdAt?: Date;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  fullName?: string;
  mobile?: string;
  monthlyIncome?: number;
  employmentType?: string;
  profileImage?: string;
}

export interface UserDashboard {
  preApprovedLimit: number;
  creditScore: number;
  loanHealthScore: number;
  activeLoans: number;
  totalPaid: number;
  totalRemaining: number;
  personalizedOffers: PersonalizedOffer[];
}

export interface PersonalizedOffer {
  title: string;
  description: string;
  offerType: string;
  validUntil: Date;
}

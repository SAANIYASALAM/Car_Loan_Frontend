import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Loan, LoanFilterDto } from '../models/loan.model';
import { User } from '../models/user.model';

export interface DashboardStats {
  totalLoans: number;
  activeLoans: number;
  pendingApprovals: number;
  totalDisbursed: number;
  totalCollected: number;
  defaultRate: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  disbursements: number;
}

export interface CarTypeDistribution {
  carType: string;
  count: number;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getPendingLoans(): Observable<ApiResponse<Loan[]>> {
    return this.http.get<ApiResponse<Loan[]>>(`${this.apiUrl}/loans/pending`);
  }

  approveLoan(loanId: number): Observable<ApiResponse<Loan>> {
    return this.http.put<ApiResponse<Loan>>(`${this.apiUrl}/loans/${loanId}/approve`, {});
  }

  rejectLoan(loanId: number, reason: string): Observable<ApiResponse<Loan>> {
    return this.http.put<ApiResponse<Loan>>
      (`${this.apiUrl}/loans/${loanId}/reject`, { reason });
  }

  getAllLoans(filter?: LoanFilterDto): Observable<ApiResponse<Loan[]>> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.status !== undefined) params = params.set('status', filter.status.toString());
      if (filter.carType !== undefined) params = params.set('carType', filter.carType.toString());
      if (filter.fromDate) params = params.set('fromDate', filter.fromDate.toISOString());
      if (filter.toDate) params = params.set('toDate', filter.toDate.toISOString());
    }

    return this.http.get<ApiResponse<Loan[]>>(`${this.apiUrl}/loans`, { params });
  }

  getAllUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users`);
  }

  getUserLoans(userId: number): Observable<ApiResponse<Loan[]>> {
    return this.http.get<ApiResponse<Loan[]>>(`${this.apiUrl}/users/${userId}/loans`);
  }

  getMonthlyRevenue(months: number = 12): Observable<ApiResponse<MonthlyRevenue[]>> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get<ApiResponse<MonthlyRevenue[]>>
      (`${this.apiUrl}/analytics/monthly-revenue`, { params });
  }

  getCarTypeDistribution(): Observable<ApiResponse<CarTypeDistribution[]>> {
    return this.http.get<ApiResponse<CarTypeDistribution[]>>
      (`${this.apiUrl}/analytics/car-type-distribution`);
  }

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>
      (`${this.apiUrl}/analytics/dashboard-stats`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { 
  Loan, 
  LoanApplicationDto, 
  EligibilityCheckDto, 
  EmiCalculationDto,
  LoanRuleDto,
  LoanFilterDto 
} from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}/loan`;

  constructor(private http: HttpClient) {}

  applyForLoan(loanApplication: LoanApplicationDto): Observable<ApiResponse<Loan>> {
    return this.http.post<ApiResponse<Loan>>(`${this.apiUrl}/apply`, loanApplication);
  }

  getUserLoans(userId: number): Observable<ApiResponse<Loan[]>> {
    return this.http.get<ApiResponse<Loan[]>>(`${this.apiUrl}/user/${userId}`);
  }

  getLoanById(loanId: number): Observable<ApiResponse<Loan>> {
    return this.http.get<ApiResponse<Loan>>(`${this.apiUrl}/${loanId}`);
  }

  checkEligibility(loanApplication: LoanApplicationDto): Observable<ApiResponse<EligibilityCheckDto>> {
    return this.http.post<ApiResponse<EligibilityCheckDto>>
      (`${this.apiUrl}/check-eligibility`, loanApplication);
  }

  getLoanRules(carType: number): Observable<ApiResponse<LoanRuleDto>> {
    return this.http.get<ApiResponse<LoanRuleDto>>(`${this.apiUrl}/rules/${carType}`);
  }

  calculateEmi(emiCalculation: EmiCalculationDto): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>
      (`${this.apiUrl}/calculate-emi`, emiCalculation);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { EmiPayment, EmiPaymentDto } from '../models/emi.model';

@Injectable({
  providedIn: 'root'
})
export class EmiService {
  private apiUrl = `${environment.apiUrl}/emi`;

  constructor(private http: HttpClient) {}

  getEmisByLoan(loanId: number): Observable<ApiResponse<EmiPayment[]>> {
    return this.http.get<ApiResponse<EmiPayment[]>>(`${this.apiUrl}/loan/${loanId}`);
  }

  getUpcomingEmis(userId: number): Observable<ApiResponse<EmiPayment[]>> {
    return this.http.get<ApiResponse<EmiPayment[]>>(`${this.apiUrl}/upcoming/${userId}`);
  }

  getEmiHistory(userId: number): Observable<ApiResponse<EmiPayment[]>> {
    return this.http.get<ApiResponse<EmiPayment[]>>(`${this.apiUrl}/history/${userId}`);
  }

  payEmi(emiPayment: EmiPaymentDto): Observable<ApiResponse<EmiPayment>> {
    return this.http.post<ApiResponse<EmiPayment>>(`${this.apiUrl}/pay`, emiPayment);
  }
}

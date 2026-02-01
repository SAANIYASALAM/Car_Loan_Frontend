import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { LoanService } from '../../../core/services/loan.service';
import { Loan } from '../../../core/models/loan.model';
import { LoanStatusLabels, CarTypeLabels, LoanStatus, CarType } from '../../../core/models/enums';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    LoadingSpinnerComponent,
    CurrencyFormatPipe,
    DateFormatPipe
  ],
  template: `
    <div class="container">
      <h1>My Loans</h1>
      
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      
      <div *ngIf="!loading && loans.length === 0" class="empty-state">
        <p>You don't have any loans yet.</p>
        <button mat-raised-button color="primary" routerLink="/user/loan-application">
          Apply for a Loan
        </button>
      </div>

      <div *ngIf="!loading && loans.length > 0" class="loans-grid">
        <mat-card *ngFor="let loan of loans" class="loan-card">
          <mat-card-header>
            <mat-card-title>{{ getCarTypeLabel(loan.carType) }}</mat-card-title>
            <mat-chip [color]="getStatusColor(loan.status)">
              {{ getLoanStatusLabel(loan.status) }}
            </mat-chip>
          </mat-card-header>
          <mat-card-content>
            <div class="loan-details">
              <p><strong>Loan Amount:</strong> {{ loan.loanAmount | currencyFormat }}</p>
              <p><strong>EMI Amount:</strong> {{ loan.emiAmount | currencyFormat }}</p>
              <p><strong>Interest Rate:</strong> {{ loan.interestRate }}%</p>
              <p><strong>Tenure:</strong> {{ loan.tenure }} months</p>
              <p><strong>Remaining EMIs:</strong> {{ loan.remainingEmis }}</p>
              <p><strong>Application Date:</strong> {{ loan.applicationDate | dateFormat }}</p>
              <p *ngIf="loan.nextDueDate"><strong>Next Due Date:</strong> 
                {{ loan.nextDueDate | dateFormat }}
              </p>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" [routerLink]="['/user/emi-payment']" 
                    [queryParams]="{loanId: loan.loanId}">
              Pay EMI
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 24px; }
    .loans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }
    .loan-card { padding: 16px; }
    .loan-details p { margin: 8px 0; }
    .empty-state {
      text-align: center;
      padding: 40px;
    }
  `]
})
export class MyLoansComponent implements OnInit {
  loans: Loan[] = [];
  loading = true;
  currentUser = this.authService.getCurrentUser();

  constructor(
    private authService: AuthService,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    if (!this.currentUser) return;
    
    this.loading = true;
    this.loanService.getUserLoans(this.currentUser.id).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.loans = response.data;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getLoanStatusLabel(status: number): string {
    return LoanStatusLabels[status as LoanStatus];
  }

  getCarTypeLabel(carType: number): string {
    return CarTypeLabels[carType as CarType];
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 0: return 'warn';
      case 1: return 'accent';
      case 2: return 'warn';
      case 3: return 'primary';
      case 4: return '';
      default: return '';
    }
  }
}

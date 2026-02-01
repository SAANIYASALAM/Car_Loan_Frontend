import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdminService } from '../../../core/services/admin.service';
import { Loan } from '../../../core/models/loan.model';
import { CarTypeLabels, CarType } from '../../../core/models/enums';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-pending-approvals',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule,
    LoadingSpinnerComponent,
    CurrencyFormatPipe,
    DateFormatPipe
  ],
  template: `
    <div class="container">
      <h1>Pending Loan Approvals</h1>
      
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      
      <div *ngIf="!loading && pendingLoans.length === 0" class="empty-state">
        <p>No pending approvals at this time.</p>
      </div>

      <div *ngIf="!loading && pendingLoans.length > 0" class="loans-grid">
        <mat-card *ngFor="let loan of pendingLoans" class="loan-card">
          <mat-card-header>
            <mat-card-title>{{ getCarTypeLabel(loan.carType) }}</mat-card-title>
            <mat-chip color="warn">Pending</mat-chip>
          </mat-card-header>
          <mat-card-content>
            <div class="loan-details">
              <p><strong>Applicant:</strong> {{ loan.user?.fullName }}</p>
              <p><strong>Email:</strong> {{ loan.user?.email }}</p>
              <p><strong>Loan Amount:</strong> {{ loan.loanAmount | currencyFormat }}</p>
              <p><strong>Car Price:</strong> {{ loan.carPrice | currencyFormat }}</p>
              <p><strong>Interest Rate:</strong> {{ loan.interestRate }}%</p>
              <p><strong>Tenure:</strong> {{ loan.tenure }} months</p>
              <p><strong>EMI Amount:</strong> {{ loan.emiAmount | currencyFormat }}</p>
              <p><strong>Application Date:</strong> {{ loan.applicationDate | dateFormat }}</p>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="approveLoan(loan.loanId)">
              Approve
            </button>
            <button mat-raised-button color="warn" (click)="rejectLoan(loan.loanId)">
              Reject
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
      margin-top: 24px;
    }
    .loan-card { padding: 16px; }
    .loan-details p { margin: 8px 0; }
    .empty-state {
      text-align: center;
      padding: 40px;
    }
  `]
})
export class PendingApprovalsComponent implements OnInit {
  pendingLoans: Loan[] = [];
  loading = true;

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPendingLoans();
  }

  loadPendingLoans(): void {
    this.loading = true;
    this.adminService.getPendingLoans().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.pendingLoans = response.data;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  approveLoan(loanId: number): void {
    if (confirm('Are you sure you want to approve this loan?')) {
      this.adminService.approveLoan(loanId).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Loan approved successfully!', 'Close', { duration: 3000 });
            this.loadPendingLoans();
          }
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Close', { duration: 5000 });
        }
      });
    }
  }

  rejectLoan(loanId: number): void {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.adminService.rejectLoan(loanId, reason).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Loan rejected.', 'Close', { duration: 3000 });
            this.loadPendingLoans();
          }
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Close', { duration: 5000 });
        }
      });
    }
  }

  getCarTypeLabel(carType: number): string {
    return CarTypeLabels[carType as CarType];
  }
}

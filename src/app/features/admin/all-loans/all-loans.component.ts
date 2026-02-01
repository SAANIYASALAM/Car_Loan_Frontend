import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { AdminService } from '../../../core/services/admin.service';
import { Loan } from '../../../core/models/loan.model';
import { LoanStatusLabels, CarTypeLabels, LoanStatus, CarType } from '../../../core/models/enums';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
    selector: 'app-all-loans',
    imports: [
        CommonModule,
        MatCardModule,
        MatTableModule,
        MatChipsModule,
        LoadingSpinnerComponent,
        CurrencyFormatPipe,
        DateFormatPipe
    ],
    template: `
    <div class="container">
      <h1>All Loans</h1>
      
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      
      <mat-card *ngIf="!loading">
        <mat-card-content>
          <table mat-table [dataSource]="loans" class="mat-elevation-z8">
            <ng-container matColumnDef="loanId">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let loan">{{ loan.loanId }}</td>
            </ng-container>

            <ng-container matColumnDef="user">
              <th mat-header-cell *matHeaderCellDef>User</th>
              <td mat-cell *matCellDef="let loan">{{ loan.user?.fullName }}</td>
            </ng-container>

            <ng-container matColumnDef="carType">
              <th mat-header-cell *matHeaderCellDef>Car Type</th>
              <td mat-cell *matCellDef="let loan">{{ getCarTypeLabel(loan.carType) }}</td>
            </ng-container>

            <ng-container matColumnDef="loanAmount">
              <th mat-header-cell *matHeaderCellDef>Amount</th>
              <td mat-cell *matCellDef="let loan">{{ loan.loanAmount | currencyFormat }}</td>
            </ng-container>

            <ng-container matColumnDef="emiAmount">
              <th mat-header-cell *matHeaderCellDef>EMI</th>
              <td mat-cell *matCellDef="let loan">{{ loan.emiAmount | currencyFormat }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let loan">
                <mat-chip>{{ getLoanStatusLabel(loan.status) }}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="applicationDate">
              <th mat-header-cell *matHeaderCellDef>Applied On</th>
              <td mat-cell *matCellDef="let loan">{{ loan.applicationDate | dateFormat }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .container { padding: 24px; }
    table { width: 100%; }
  `]
})
export class AllLoansComponent implements OnInit {
  loans: Loan[] = [];
  loading = true;
  displayedColumns = ['loanId', 'user', 'carType', 'loanAmount', 'emiAmount', 'status', 'applicationDate'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loading = true;
    this.adminService.getAllLoans().subscribe({
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
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { LoanService } from '../../../core/services/loan.service';
import { LoanApplicationDto, EligibilityCheckDto } from '../../../core/models/loan.model';
import { CarType, CarTypeLabels } from '../../../core/models/enums';

@Component({
  selector: 'app-loan-application',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Apply for Car Loan</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loanForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Car Type</mat-label>
              <mat-select formControlName="carType">
                <mat-option *ngFor="let type of carTypes" [value]="type.value">
                  {{ type.label }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Car Price</mat-label>
              <input matInput type="number" formControlName="carPrice">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Monthly Income</mat-label>
              <input matInput type="number" formControlName="monthlyIncome">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Employment Type</mat-label>
              <mat-select formControlName="employmentType">
                <mat-option value="Salaried">Salaried</mat-option>
                <mat-option value="Self-Employed">Self-Employed</mat-option>
                <mat-option value="Business">Business</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Credit Score</mat-label>
              <input matInput type="number" formControlName="creditScore">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Down Payment (%)</mat-label>
              <input matInput type="number" formControlName="downPaymentPercent">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tenure (months)</mat-label>
              <input matInput type="number" formControlName="tenure">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Your Age</mat-label>
              <input matInput type="number" formControlName="userAge">
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button type="button" (click)="checkEligibility()"
                      [disabled]="loanForm.invalid || checking">
                {{ checking ? 'Checking...' : 'Check Eligibility' }}
              </button>
              <button mat-raised-button color="primary" type="submit"
                      [disabled]="loanForm.invalid || submitting">
                {{ submitting ? 'Submitting...' : 'Submit Application' }}
              </button>
            </div>
          </form>

          <div *ngIf="eligibilityResult" class="eligibility-result">
            <h3>Eligibility Result</h3>
            <p><strong>Status:</strong> {{ eligibilityResult.eligible ? 'Eligible' : 'Not Eligible' }}</p>
            <p><strong>Estimated EMI:</strong> ₹{{ eligibilityResult.estimatedEmi }}</p>
            <p><strong>Interest Rate:</strong> {{ eligibilityResult.interestRate }}%</p>
            <p><strong>Reason:</strong> {{ eligibilityResult.reason }}</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 24px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .actions { display: flex; gap: 16px; margin-top: 16px; }
    .eligibility-result {
      margin-top: 24px;
      padding: 16px;
      background: #e3f2fd;
      border-radius: 4px;
    }
  `]
})
export class LoanApplicationComponent implements OnInit {
  loanForm: FormGroup;
  carTypes = Object.keys(CarType)
    .filter(key => !isNaN(Number(key)))
    .map(key => ({ value: Number(key), label: CarTypeLabels[Number(key) as CarType] }));
  
  checking = false;
  submitting = false;
  eligibilityResult: EligibilityCheckDto | null = null;
  currentUser = this.authService.getCurrentUser();

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loanForm = this.fb.group({
      carType: [CarType.Sedan, Validators.required],
      carPrice: [500000, [Validators.required, Validators.min(100000)]],
      monthlyIncome: [50000, [Validators.required, Validators.min(10000)]],
      employmentType: ['Salaried', Validators.required],
      creditScore: [700, [Validators.required, Validators.min(300), Validators.max(900)]],
      downPaymentPercent: [20, [Validators.required, Validators.min(10), Validators.max(90)]],
      tenure: [60, [Validators.required, Validators.min(12), Validators.max(84)]],
      userAge: [30, [Validators.required, Validators.min(21), Validators.max(65)]]
    });
  }

  ngOnInit(): void {}

  checkEligibility(): void {
    if (this.loanForm.valid && this.currentUser) {
      this.checking = true;
      const application: LoanApplicationDto = {
        ...this.loanForm.value,
        userId: this.currentUser.id
      };

      this.loanService.checkEligibility(application).subscribe({
        next: (response) => {
          this.checking = false;
          if (response.success) {
            this.eligibilityResult = response.data;
          }
        },
        error: (error) => {
          this.checking = false;
          this.snackBar.open(error.message, 'Close', { duration: 5000 });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.loanForm.valid && this.currentUser) {
      this.submitting = true;
      const application: LoanApplicationDto = {
        ...this.loanForm.value,
        userId: this.currentUser.id
      };

      this.loanService.applyForLoan(application).subscribe({
        next: (response) => {
          this.submitting = false;
          if (response.success) {
            this.snackBar.open('Loan application submitted successfully!', 'Close', { 
              duration: 3000 
            });
            this.router.navigate(['/user/my-loans']);
          }
        },
        error: (error) => {
          this.submitting = false;
          this.snackBar.open(error.message, 'Close', { duration: 5000 });
        }
      });
    }
  }
}

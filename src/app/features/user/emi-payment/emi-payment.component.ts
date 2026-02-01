import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmiService } from '../../../core/services/emi.service';
import { EmiPaymentDto } from '../../../core/models/emi.model';

@Component({
  selector: 'app-emi-payment',
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
          <mat-card-title>Pay EMI</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Loan ID</mat-label>
              <input matInput type="number" formControlName="loanId">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Amount</mat-label>
              <input matInput type="number" formControlName="amount">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Payment Method</mat-label>
              <mat-select formControlName="paymentMethod">
                <mat-option value="NetBanking">Net Banking</mat-option>
                <mat-option value="DebitCard">Debit Card</mat-option>
                <mat-option value="CreditCard">Credit Card</mat-option>
                <mat-option value="UPI">UPI</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Transaction ID (Optional)</mat-label>
              <input matInput formControlName="transactionId">
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit"
                    [disabled]="paymentForm.invalid || submitting">
              {{ submitting ? 'Processing...' : 'Pay Now' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 24px; max-width: 600px; margin: 0 auto; }
    .full-width { width: 100%; margin-bottom: 16px; }
  `]
})
export class EmiPaymentComponent implements OnInit {
  paymentForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private emiService: EmiService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.paymentForm = this.fb.group({
      loanId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      paymentMethod: ['NetBanking', Validators.required],
      transactionId: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['loanId']) {
        this.paymentForm.patchValue({ loanId: params['loanId'] });
      }
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.submitting = true;
      const payment: EmiPaymentDto = this.paymentForm.value;

      this.emiService.payEmi(payment).subscribe({
        next: (response) => {
          this.submitting = false;
          if (response.success) {
            this.snackBar.open('Payment successful!', 'Close', { duration: 3000 });
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

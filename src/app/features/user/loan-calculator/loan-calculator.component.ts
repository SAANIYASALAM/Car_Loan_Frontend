import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoanService } from '../../../core/services/loan.service';
import { EmiCalculationDto } from '../../../core/models/loan.model';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
    selector: 'app-loan-calculator',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        CurrencyFormatPipe
    ],
    template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Loan EMI Calculator</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="calculatorForm" (ngSubmit)="calculate()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Loan Amount (Principal)</mat-label>
              <input matInput type="number" formControlName="principal">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Interest Rate (% per annum)</mat-label>
              <input matInput type="number" formControlName="rate" step="0.1">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tenure (months)</mat-label>
              <input matInput type="number" formControlName="tenure">
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit"
                    [disabled]="calculatorForm.invalid || calculating">
              {{ calculating ? 'Calculating...' : 'Calculate EMI' }}
            </button>
          </form>

          <div *ngIf="emiResult !== null" class="result">
            <h2>Monthly EMI</h2>
            <h1>{{ emiResult | currencyFormat }}</h1>
            <div class="breakdown">
              <p><strong>Total Amount Payable:</strong> 
                {{ (emiResult * calculatorForm.value.tenure) | currencyFormat }}
              </p>
              <p><strong>Total Interest:</strong> 
                {{ ((emiResult * calculatorForm.value.tenure) - calculatorForm.value.principal) | currencyFormat }}
              </p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .container { padding: 24px; max-width: 600px; margin: 0 auto; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .result {
      margin-top: 24px;
      padding: 24px;
      background: #e3f2fd;
      border-radius: 8px;
      text-align: center;
    }
    .result h1 {
      font-size: 3rem;
      color: #3f51b5;
      margin: 16px 0;
    }
    .breakdown {
      margin-top: 16px;
      text-align: left;
    }
  `]
})
export class LoanCalculatorComponent {
  calculatorForm: FormGroup;
  calculating = false;
  emiResult: number | null = null;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService
  ) {
    this.calculatorForm = this.fb.group({
      principal: [500000, [Validators.required, Validators.min(10000)]],
      rate: [8.5, [Validators.required, Validators.min(0.1), Validators.max(30)]],
      tenure: [60, [Validators.required, Validators.min(6), Validators.max(84)]]
    });
  }

  calculate(): void {
    if (this.calculatorForm.valid) {
      this.calculating = true;
      const calculation: EmiCalculationDto = this.calculatorForm.value;

      this.loanService.calculateEmi(calculation).subscribe({
        next: (response) => {
          this.calculating = false;
          if (response.success) {
            this.emiResult = response.data;
          }
        },
        error: () => {
          this.calculating = false;
        }
      });
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    imports: [CommonModule],
    template: `
    <footer>
      <div class="footer-content">
        <p>&copy; 2026 Car Loan EMI System. All rights reserved.</p>
        <p class="version">Version 1.0.0</p>
      </div>
    </footer>
  `,
    styles: [`
    footer {
      background-color: #333;
      color: white;
      padding: 20px;
      margin-top: auto;
    }
    .footer-content {
      text-align: center;
    }
    .footer-content p {
      margin: 5px 0;
    }
    .version {
      font-size: 0.85rem;
      color: #ccc;
    }
  `]
})
export class FooterComponent {}

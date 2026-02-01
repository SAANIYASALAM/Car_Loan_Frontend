import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | undefined, format: string = 'short'): string {
    if (!value) return '';
    
    const date = typeof value === 'string' ? new Date(value) : value;
    
    if (format === 'short') {
      return date.toLocaleDateString('en-IN');
    } else if (format === 'long') {
      return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (format === 'time') {
      return date.toLocaleTimeString('en-IN');
    } else {
      return date.toLocaleString('en-IN');
    }
  }
}

import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberLength]'
})
export class NumberLengthDirective {

  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');

    // Ensure the length is between 3 and 4
    const finalValue = numericValue.length >= 3 && numericValue.length <= 4
      ? numericValue
      : numericValue.slice(0, 4);

    // Update the input value
    this.ngControl.control?.setValue(finalValue, { emitEvent: false });
  }

}

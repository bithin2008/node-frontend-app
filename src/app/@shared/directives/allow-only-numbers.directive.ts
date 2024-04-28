import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[allowOnlyNumbers]'
})
export class AllowOnlyNumbersDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const initialValue = inputElement.value;
    inputElement.value = initialValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (initialValue !== inputElement.value) {
      event.stopPropagation(); // Prevent the input event from propagating
    }
  }
}
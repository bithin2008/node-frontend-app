import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[usPhoneNumber]'
})
export class UsPhoneNumberDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const maxLength = 14;

    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
      event.preventDefault();
    }
  }
}

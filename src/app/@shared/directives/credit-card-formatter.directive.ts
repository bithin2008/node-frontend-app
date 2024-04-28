import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[creditCardFormatter]'
})
export class CreditCardFormatterDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: InputEvent) {
  //   const inputElement = this.el.nativeElement as HTMLInputElement;
  //   let inputValue = inputElement.value.replace(/\D/g, ''); // Remove non-digit characters
  //   const minLength = 15; // Minimum required length for credit card numbers

  //   if (inputValue.length < minLength) {
  //     // If the input length is less than the required minimum, prevent further input
  //     event.preventDefault();
  //     return;
  //   }

  //   const maxLength = 17; // Maximum allowed length for credit card numbers

  //   if (inputValue.length > maxLength) {
  //     inputValue = inputValue.slice(0, maxLength); // Truncate to the maximum length
  //   }

  //   const formattedValue = this.formatCreditCard(inputValue);
  //   inputElement.value = formattedValue;
  // }

  // private formatCreditCard(value: string): string {
  //   const chunkSize = 4;
  //   const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
  //   const parts = value.match(regex);

  //   if (parts) {
  //     return parts.join(' ');
  //   } else {
  //     return value;
  //   }
  const input = this.el.nativeElement;
    const value = input.value.replace(/\D/g, ''); // Remove non-digit characters
    const formattedValue = value.substring(0, 16); // Truncate to 16 characters
    const spacedValue = formattedValue.match(/.{1,4}/g)?.join(' ') || ''; // Add spaces every 4 characters
    const cardImage = document.getElementById('cardImage') as HTMLImageElement;
    if (spacedValue.length > 3) {
      const cardType = this.getCardType(formattedValue);
    
      // Set image source based on card type
      if (cardImage) {
        switch (cardType) {
          case 'Visa':
            cardImage.src = 'assets/img/allCardIcon/visa.svg';
            break;
          case 'Mastercard':
            cardImage.src = 'assets/img/allCardIcon/mastercard.svg';
            break;
          case 'Amex':
            cardImage.src = 'assets/img/allCardIcon/amex.svg';
            break;
          case 'Discover':
            cardImage.src = 'assets/img/allCardIcon/discover.svg';
            break;
          case 'Diners Club':
            cardImage.src = 'assets/img/allCardIcon/diners.svg';
            break;
          case 'JCB':
            cardImage.src = 'assets/img/allCardIcon/jcb.svg';
            break;
          // Add cases for other card types as needed
          default:
            cardImage.src = 'assets/img/allCardIcon/credit-card.svg'; // Set a default image for unknown card types
        }
      }
    }else{
      cardImage.src = 'assets/img/allCardIcon/credit-card.svg';
    }
    input.value = spacedValue;
  
   }

 private getCardType(cardNumber:any) {
    if (/^5[1-5]/.test(cardNumber)) {
      return "Mastercard";
    } else if (/^4/.test(cardNumber)) {
      return "Visa";
    } else if (/^3[47]/.test(cardNumber)) {
      return 'Amex';
    } else if (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(cardNumber)) {
      return 'Discover';
    } else if (/^3(?:0[0-5]|[68][0-9])[0-9]{10}$/.test(cardNumber)) {
      return 'Diners Club';
    } else if (/^(?:2131|1800|35\d{2})\d{11}$/.test(cardNumber)) {
      return 'JCB';
    } else {
      return 'Unknown';
    }
  }
}

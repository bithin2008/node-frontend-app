import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slashify'
})
export class SlashifyPipe implements PipeTransform {
  transform(input: string): string {
    // Remove any non-digit characters
    const digits = input.replace(/\D/g, '');

    // Use a regular expression to split the string into pairs of two digits
    const pairs = digits.match(/(\d{2})/g);

    if (pairs) {
      // Join the pairs with a slash
      return pairs.join('/');
    } else {
      return input;
    }
  }
}

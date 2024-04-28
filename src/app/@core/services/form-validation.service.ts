import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntypedFormGroup, UntypedFormControl, AbstractControl, ValidatorFn, ValidationErrors, FormArray } from '@angular/forms';
import { regEx } from '../../@utils/const/regEx';
import * as $ from 'jquery';
@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  constructor() { }

  validateAllFormFields(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  getValidatorErrorMessage(rule: string, validatorValue?: any) {
    const errorMessage: any = {
      required: 'Field is required.',
      minlength: `Min. ${validatorValue?.requiredLength} characters required.`,
      maxlength: `The field cannot be more than ${validatorValue?.requiredLength} characters.`,
      min: `Min value must be at least ${validatorValue?.min}.`,
      max: `Value should not exceed more than ${validatorValue?.max}.`,
      email: 'Please enter valid email address.',
      validEmail: 'Please enter valid email address.',
      phoneNumber: 'Please enter 10 digit phone number.',
      ruleOne: 'error message 1',
      ruleTwo: 'error message 2',
      ruleThreec: 'error message 3',
      invalidPassword: 'Password must be 8 characters with 1 lowercase, 1 uppercase, 1 number, 1 special character.',
      invalidDomain: 'Please enter email with @unitedexploration.co.in only.',
      notMatching: 'Confirm field value should match with Actual value.',
      passwordNotMatching: 'Confirm Password should match with Password.',
      accountNoNotMatching: 'Confirm account no should match with Account no.',
      userNameExists: 'This username is already registered.',
      invalidPAN: 'Please enter a valid PAN number.',
      invalidExpiryDateFormat: 'Date is invalid',
      invalidExpiry: 'Card is expired',
      invalidCVV: 'Please enter a valid CVV.',
      invalidUSBankRouting:'Invalid bank routing number',
      minLengthArray: 'Please select at least one date from the calendar.',
      invalidAlphabetWithSpace:'Please enter only alphabets',
      invalidAlphaNumericWithSpace: 'Please enter alpha numeric values with space & few allowed special characters.',
      invalidCardNumber: 'Please enter valid card number',
      invalidNumericTwoDecimal: 'Numeric upto two decimal is accepted.',
      invalidNumber: 'This field should be only integer number.',
      invalidName: 'Please enter name using valid characters.',
      notEmpty: 'The field can not be empty.'
    };
    if (errorMessage[rule]) {
      return errorMessage[rule];
    } else {
      return 'Rule: ' + rule + ' : This field has a generic error.';
    }
  }

  validEmail(control: AbstractControl) {
    const valid = control?.value ? control?.value?.match(regEx.email) : true;
    return valid ? null : { 'validEmail': true };
  }

  phoneNumber(control: AbstractControl) {
    const valid = control?.value ? control?.value?.match(regEx.phone_number_US) : true;
    return valid ? null : { 'phoneNumber': true };
  }

  phoneNumberUS(control: AbstractControl) {
    const valid = control?.value ? control?.value?.match(regEx.phone_number_US) : true;
    return valid ? null : { 'phoneNumber': true };
  }

 usBankRouting(control: AbstractControl) {
    const valid = control?.value ? control?.value?.match(regEx.usBankRouting) : true;
    return valid ? null : { 'invalidUSBankRouting': true };
  }

  test1(control: AbstractControl) {
    return (control?.value == 'one') ? { 'ruleOne': true } : null;
  }

  test2(control: AbstractControl) {
    return (control?.value == 'two') ? { 'ruleTwo': true } : null;
  }

  test3(control: AbstractControl) {
    return (control?.value == 'three') ? { 'ruleThree': true } : null;
  }

  strongPassword(control: AbstractControl) {
    // password should have minimum 8 chars long with 1 lower case, 1 upper case & 1 number
    const regex = new RegExp(regEx.strong_password);
    const valid = regex.test(control.value);
    return valid ? null : { 'invalidPassword': true };
  }

  validName(control: AbstractControl) {
    const regex = new RegExp(regEx.name);
    const valid = regex.test(control.value);
    return valid ? null : { 'invalidName': true };
  }


  validEmailDomain(control: AbstractControl) {
    let error = null;
    if (control?.value && control?.value.indexOf("@") != -1) {
      let [_, domain] = control?.value.split("@");
      if (domain == "unitedexploration.co.in") {
        error = null;
      } else {
        error = { 'invalidDomain': true };
      }
    }
    return error;
  }

  matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      if (matchTo === 'password' || matchTo === 'confirmPassword') {
        return !!control.parent && !!control.parent.value && control.value === (control.parent?.controls as any)[matchTo].value ? null : { passwordNotMatching: true };
      }
      if (matchTo === 'accountNo' || matchTo === 'confirmAccountNo') {
        return !!control.parent && !!control.parent.value && control.value === (control.parent?.controls as any)[matchTo].value ? null : { accountNoNotMatching: true };
      }
      return !!control.parent && !!control.parent.value && control.value === (control.parent?.controls as any)[matchTo].value ? null : { notMatching: true };
    };
  }

  validPAN(control: AbstractControl) {
    const valid = control?.value ? control?.value?.match(regEx.pan_number) : true;
    return valid ? null : { 'invalidPAN': true };
  }

  validateCard(control: AbstractControl) {
    const regex = new RegExp(regEx.card_number_format);
    const valid = regex.test(control.value);
    return valid ? null : { 'invalidCardNumber': true };
  }
  validateExpirationDateFormat(control: AbstractControl) {
    const regex = new RegExp(regEx.card_expiry_date_format);
    const valid = regex.test(control.value);
    return valid ? null : { 'invalidExpiryDateFormat': true };
  }

  expiryDateValidator(control: AbstractControl) {
    if (!control.value) {
      return null
    }
    let validDate = true;
    const currentDate = new Date();
    const enteredDateParts = control.value.split('/');
    if (enteredDateParts.length === 2) {
        const enteredMonth = parseInt(enteredDateParts[0]);
        const enteredYear = parseInt(enteredDateParts[1]);
        // Adjust the entered year to a full year representation
        const fullEnteredYear = enteredYear < 100 ? 2000 + enteredYear : enteredYear;
        // Create a new date with the last day of the entered month and year
        const enteredDate = new Date(fullEnteredYear, enteredMonth, 0);
        // Check if entered date is in the current year or a future year
        if (enteredDate < currentDate) {
            validDate = false;
        }
    } else {
        validDate = false; // Invalid format
    }
    return validDate ? null : { 'invalidExpiryDateFormat': true };
}

  validateCVV(control: AbstractControl) {
    const regex = new RegExp(regEx.cvv);
    const valid = regex.test(control.value);
    return valid ? null : { 'invalidCVV': true };
  }

  minLengthArray(control: AbstractControl) {
    return control.value?.length > 0 ? null : { 'minLengthArray': true };
  }

  alphabetWithSpace(control: AbstractControl) {
    const regex = new RegExp(regEx.alpha_with_spaces);
    const valid = regex.test(control.value);
    return valid ? null : { 'invalidAlphabetWithSpace': true };
  }

  alphaNumericWithSpace(control: AbstractControl) {
    const regex = new RegExp(regEx.alphanumericWithSpaceAllowedChars);
    const valid = regex.test(control.value);
    return valid ? null : { 'invalidAlphaNumericWithSpace': true };
  }

  numericTwoDecimal(control: AbstractControl) {
    const regex = new RegExp(regEx.numeric_two_decimal_places);
    const valid = regex.test(control.value);
    return valid ? null : { 'invalidNumericTwoDecimal': true };
  }

  numericOnly(control: AbstractControl) {
    const regex = new RegExp(regEx.numeric_only);
    const valid = regex.test(control.value);
    return valid ? null : { 'invalidNumber': true };
  }

  notEmpty(control: AbstractControl) {
    const valid = control?.value ? !control?.value?.match(regEx.onlyspace) : true;
    return valid ? null : { 'notEmpty': true };
  }

  forms() {
    $('.form--contact .textBox input').focus(function () {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    $('.form--contact .textBox input').focusout(function () {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    let allFormField: any = document.querySelectorAll(".form-field");

    $('.form-field').on('input', () => {
      $(this).parent().toggleClass('not-empty');
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    $(document).ready(function () {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      $('.form-field').on('input', function () {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
    });

    $(function () {
      $('.form-field').focusout(function () {
        var text_val = $(this).val();
        $(this).parent().toggleClass('not-empty', text_val !== "");
      }).focusout();
    });

    setTimeout(function () {
      for (let i = 0; i < allFormField.length; i++) {
        if (allFormField[i].value) {
          allFormField[i].parentNode.classList.add("has-value");

          if (allFormField[i].tagName == "TEXTAREA") {
            allFormField[i].style.cssText = "height: var(--initHeight);";
            allFormField[i].style.cssText = `height: ${allFormField[i].scrollHeight}px`;
          }
        }
      }
    }, 500);

    for (let i = 0; i < allFormField.length; i++) {
      if (allFormField[i].tagName == "TEXTAREA") {
        allFormField[i].addEventListener("input", function () {
          allFormField[i].style.cssText = "height: var(--initHeight);";
          allFormField[i].style.cssText = `height: ${allFormField[i].scrollHeight}px`;
        });
      }
      allFormField[i].addEventListener("focus", function () {
        allFormField[i].parentNode.classList.add("has-value");
      });
      allFormField[i].addEventListener("blur", function () {
        if (!allFormField[i].value) {
          allFormField[i].parentNode.classList.remove("has-value");
        }
      });
    }

    (function (document, window, index) {
      var inputs = document.querySelectorAll('.inputfile');
      Array.prototype.forEach.call(inputs, function (input) {
        var label = input.nextElementSibling,
          labelVal = label.innerHTML;

        input.addEventListener('change', (e: any) => {
          var fileName = '';
          if (input.files && input.files.length > 1)
            fileName = (input.getAttribute('data-multiple-caption') || '').replace('{count}', input.files.length);
          else
            fileName = e.target.value.split('\\').pop();

          if (fileName)
            label.querySelector('span').innerHTML = fileName;
          else
            label.innerHTML = labelVal;
        });

        // Firefox bug fix
        input.addEventListener('focus', function () { input.classList.add('has-focus'); });
        input.addEventListener('blur', function () { input.classList.remove('has-focus'); });
      });
    }(document, window, 0));
    // jQuery('.form-elementfile input[type="file"]').on('change', function() {
    //     var infile = $(this).val();
    //     var filename = infile.split("\\");
    //     filename = filename[filename.length - 1];
    //     jQuery(this).parents('.form-elementfile').find('#filename').text(filename);
    //     // $(this).parent().addClass('hasValueall');
    // });

    // TEXTAREA.addEventListener('input', function(){
    // 	this.style.cssText = 'height: var(--initHeight);'
    // 	this.style.cssText = `height: ${this.scrollHeight}px`;
    // });

  }
}

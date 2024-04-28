import { Injectable } from '@angular/core';
import * as $ from 'jquery';
@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

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
    }, 100);

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


  }

  accordion() {
    const accItem = document.getElementsByClassName('js-acc-item') as HTMLCollectionOf<HTMLElement>;
    const accHD = document.getElementsByClassName('accordion-single-title') as HTMLCollectionOf<HTMLElement>;
    
    for (let i = 0; i < accHD.length; i++) {
        accHD[i].addEventListener('click', toggleItem, false);
    }
    
    function toggleItem(this: any) {
        const itemClass = this.parentNode?.className;
    
        for (let i = 0; i < accItem.length; i++) {
            accItem[i].className = 'accordion-single-item js-acc-item is-close';
        }
    
        if (itemClass === 'accordion-single-item js-acc-item is-close') {
            this.parentNode!.className = 'accordion-single-item js-acc-item is-open';
        }
    }   
  }

  initTab(){
    const whichtab: any = document.querySelector(".maptabMenu");
    const btn: NodeListOf<Element> = document.querySelectorAll(".tab_btn");
    const content: NodeListOf<Element> = document.querySelectorAll(".tab-pane");
  
    if (whichtab) {
      whichtab.onclick = (e: any): void => {
        console.log(e);
        const tabparent: string | undefined = e.target?.parentNode?.parentNode?.dataset.id;
        
        if (tabparent) {
          for (let i = 0; i < btn.length; i++) {
            btn[i].classList.remove("active");
          }
  
          // Alternatively, you can use a forEach loop for btn as well.
          // btn.forEach((b) => {
          //   b.classList.remove('active');
          // });
  
          e.target?.parentNode?.parentNode?.classList.add("active");
  
          content.forEach((c) => {
            c.classList.remove("show");
          });
  
          const element: HTMLElement | null = document.getElementById(tabparent);
          element?.classList.add("show");
        }
      };
    }
  }

  
}

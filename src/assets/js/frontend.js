const forms = () => {


    $('.form--contact .textBox input').focus(function() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  
    $('.form--contact .textBox input').focusout(function() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  
    let allFormField = document.querySelectorAll(".form-field");
  
    $('.form-field').on('input', function() {
      $(this).parent().toggleClass('not-empty', this.value.trim().length > 0);
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  
    $(document).ready(function () {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      $('.form-field').on('input', function() {
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
            allFormField[i].style.cssText = `height: ${this.scrollHeight}px`;
          }
        }
      }
    }, 100);
  
    for (let i = 0; i < allFormField.length; i++) {
      if (allFormField[i].tagName == "TEXTAREA") {
        allFormField[i].addEventListener("input", function () {
          allFormField[i].style.cssText = "height: var(--initHeight);";
          allFormField[i].style.cssText = `height: ${this.scrollHeight}px`;
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
  
        input.addEventListener('change', function (e) {
          var fileName = '';
          if (this.files && this.files.length > 1)
            fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
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


  window.addEventListener("DOMContentLoaded", () => {
    alert();
    forms();
    initTab();
  });



  const accSingleTriggers = document.querySelectorAll('.js-acc-single-trigger');

  accSingleTriggers.forEach(trigger => trigger.addEventListener('click', toggleAccordion));
  
  function toggleAccordion() {
    const items = document.querySelectorAll('.js-acc-item');
  
  
    items.forEach(item => {
      if (this.parentNode == item) {
        this.parentNode.classList.toggle('is-open');
        return;
      }
      item.classList.remove('is-open');
    });
  }   


   

  // document.querySelector(".tab_btn").addEventListener("click", () => {
  //   document.querySelector(".tab_btn").classList.toggle("active");
  //   document.querySelector(".tab-pane").classList.toggle("active");
   
  // });



  const collapsibleButtons = document.querySelectorAll(
    ".addon_btn"
  );
  
  collapsibleButtons.forEach((collapsibleButton) => {
    const collapsibleContentDataHeight =
    collapsibleButton.nextElementSibling.offsetHeight;
    collapsibleButton.nextElementSibling.style.height = 0;
    collapsibleButton.addEventListener("click", (e) => {
      if (
        !e.currentTarget.parentElement.classList.contains("collapsible-tab__open")
      ) {
        e.currentTarget.parentElement.classList.toggle("collapsible-tab__open");
        e.currentTarget.nextElementSibling.style.height = `${collapsibleContentDataHeight}px`;
      } else {
        e.currentTarget.parentElement.classList.remove("collapsible-tab__open");
        e.currentTarget.nextElementSibling.style.height = 0;
      }
    });
  });
  

//data-id="states"

initTab = () => {
  const whichtab = document.querySelector(".maptabMenu");
  const btn = document.querySelectorAll(".tab_btn");
  const content = document.querySelectorAll(".tab-pane");

  if (whichtab) {
    
    whichtab.onclick = (e) => {
      console.log(e);
      const tabparent = e.target.parentNode.parentNode.dataset.id;
      if (tabparent) {
        for (var i = 0; i < btn.length; i++) {
          btn[i].classList.remove("active");
        }
        // btn.forEach(b => {
        //   b.classList.remove('active');
        // });
        e.target.parentNode.parentNode.classList.add("active");
        content.forEach((c) => {
          c.classList.remove("show");
        });
        const element = document.getElementById(tabparent);
        element.classList.add("show");
      }
    };
  }
};

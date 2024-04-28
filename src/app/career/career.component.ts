import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormValidationService } from '../@core/services/form-validation.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../@core/services/alert.service';
import { ApiService } from '../@core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { CommonService } from '../@core/services/common.service';
import { SharedService } from '../@core/services/shared.service';
import { Meta, Title } from '@angular/platform-browser';
import { ReCaptchaV3Service } from 'ng-recaptcha';
@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss']
})
export class CareerComponent {
  @ViewChild('careerFormSection') private careerFormSection: ElementRef | any;
  public careerForm!: FormGroup;
  public contactFormSubmitted: boolean = false;
  public uploadedResume: any = '';
  public fileAdded: boolean = false;
  public pageDetails:any={};
  public loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private formValidationService: FormValidationService,
    private apiService: ApiService,
    private commonSvc: CommonService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private sharedService: SharedService,
    private router: Router,
     private activatedRoute: ActivatedRoute,
    private title: Title, private meta: Meta
  ) {

    const resolvedData = this.activatedRoute.snapshot.data['routeData'];
    if (resolvedData?.data) {
      this.pageDetails = resolvedData.data
      this.title.setTitle(this.pageDetails?.title);
      this.meta.removeTag('keyword');
      this.meta.removeTag('description');
      this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description ? this.pageDetails?.meta_description : '' });
      this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords ? this.pageDetails?.meta_keywords : '' });
      this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: this.pageDetails.schema_markup ? JSON.stringify(this.pageDetails?.schema_markup) : '' });
    }
  
    this.careerForm = this.fb.group({
      firstName: ['', [Validators.required, this.formValidationService.notEmpty]],
      lastName: ['', [Validators.required, this.formValidationService.notEmpty]],
      emailId: ['', [Validators.required, this.formValidationService.notEmpty, this.formValidationService.validEmail]],
      mobileNo: ['', [Validators.required, this.formValidationService.phoneNumberUS,]],
      experience: ['1', [Validators.required]],
      resumeFile: ['', [Validators.required]]
    });
  }

  get s1() { return this.careerForm.controls; }

  ngAfterViewInit() {
    this.formValidationService.forms();

    this.commonSvc.gsapInit();
    // this.commonSvc.gsapTxtRevealAnim();
    // this.commonSvc.gsapImgRevealAnim();

  }

  changeMobileFormat(e: any) {
    this.careerForm.controls['mobileNo'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  // fileClickEvent(event: any){    
  //   const inputElement = event.target as HTMLInputElement;
  // if (inputElement.files && inputElement.files.length > 0) {
  //   this.careerForm.controls['resumeFile'].setValue(inputElement.files[0]);
  // } else {
  //   this.careerForm.controls['resumeFile'].setValue(null);
  // }
  // this.careerForm.controls['resumeFile'].updateValueAndValidity();
  // }

  fileChangeEvent(event: any): void {
    const fileSize = event.target.files[0].size / 1024 / 1024; // in MB
    let uploadBlock: any = document.querySelector(".upload-block");
    uploadBlock.setAttribute("data-text", '');
    if (fileSize > 2) {
      this.alertService.warning('File size exceeds 2MB',);
      this.fileAdded = false;
      this.careerForm.patchValue({
        resumeFile: null
      })
      var el: any = document.getElementById('real-file');
      el.value = '';
    }
    let validation: any = this.commonSvc.validateFileUpload(event.target.files[0].name, ['docx', 'doc', 'pdf']);
    if (validation) {
      this.uploadedResume = event.target.files[0];
      uploadBlock.setAttribute("data-text", this.truncateString(this.uploadedResume.name, 35));
      this.fileAdded = true;
      this.clearFileInput();
    } else {
      this.fileAdded = false;
      this.alertService.warning('Only docs, pdf formats are supported',);
      this.careerForm.patchValue({
        resumeFile: null
      })
      this.fileAdded = false;
      this.clearFileInput();
      return
    }
  }

  scrollToCareerForm() {
    this.careerFormSection.nativeElement.scrollIntoView({ behavior: 'smooth', })
  }

  clearFileInput() {
    // Reset the input field by setting its value to an empty string
    var el: any = document.getElementById('real-file');
    el.value = '';
  }

  async careerSubmit() {
    this.contactFormSubmitted=true;
    if (!this.careerForm.valid) {
      this.formValidationService.validateAllFormFields(this.careerForm);
      return
    }
    console.log('this.careerForm.value', this.careerForm.value);
    delete this.careerForm.value.resumeFile;
    this.loading=true;
    const token = await this.recaptchaV3Service.execute('submitCareer').toPromise();
    let res: any = await this.commonSvc.verifyreCaptcha(token);
    if (res.status == 1) {
    this.apiService.post(`${AppConfig.apiUrl.careers.submitCareer}`, this.careerForm.value).subscribe({
      next: (response: any) => {
        this.loading=false;
        if (response.status == 1) {
          this.updateResume(response.data.career_id);
        } else {
          this.alertService.error(response.message);
          this.fileAdded = false;
        }
      },
      error: (er) => {
        this.loading = false;
      },
      complete: () => {        
        this.loading = false;
      }
    });
  }
  }

  preventNumberInput(e: any) {
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    if (keyCode > 47 && keyCode < 58 || keyCode > 95 && keyCode < 107) {
      e.preventDefault();
    }
  }

  mszKeyDown(e: any): any {
    if (e.which === 32 && !e.target.value.length) {
      e.preventDefault();
    }
  }

  async updateResume(career_id: any) {
    if (!this.s1['resumeFile'].value) {
      return
    }
    const formData = new FormData();
    let fileName = this.s1['resumeFile'].value.substring(this.s1['resumeFile'].value.lastIndexOf("/") + 1);
    formData.append('resumeFile', this.uploadedResume, fileName);
    this.uploadResume(career_id, formData);
  }

  uploadResume(career_id: string, formData: any) {
    this.apiService.fileupload(`${AppConfig.apiUrl.careers.uploadResume}/${career_id}`, formData).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.contactFormSubmitted = false;
          this.careerForm.reset();
          this.careerForm.patchValue({
            experience: 1
          })
          let uploadBlock: any = document.querySelector(".upload-block");
          uploadBlock.setAttribute("data-text", '');
          this.fileAdded = false;
          var el: any = document.getElementById('real-file');
          if (el)
            el.value = '';

          this.router.navigate(['/career/thank-you']);
        }
      },
      error: (err) => { }, complete: () => { },
    })
  }

  truncateString(str: any, maxLength: any) {
    if (str.length > maxLength) {
      return str.slice(0, maxLength - 3) + '...';
    } else {
      return str;
    }
  }

}

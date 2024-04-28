import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/@core/services/alert.service';
import { ApiService } from 'src/app/@core/services/api.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import { SharedService } from 'src/app/@core/services/shared.service';
import { AppConfig } from '../../../@utils/const/app.config';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  isDropdownVisible = false;
  public submitted: boolean = false;
  isOpenDropdown: boolean = false;
  public isVisable: boolean = false;
  public isReadOnly: boolean = true;
  isOpened = true;
  public realtorObj: any = {};
  public validZip: boolean = false;
  public validZipMessage: any = '';
  
  constructor(
    private router: Router,
    private alertService: AlertService,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService,
    private sharedService: SharedService,

    private commonSvc: CommonService,
    private formValidationSvc: FormValidationService
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Realestate Professional Portal- Edit Profile');
    this.sharedService.sharedRealtorData$.subscribe((response: any) => {
      if (response) {
this.realtorObj=response;
        this.editProfileForm.patchValue({
          companyName: response.data.company_name,
          contactName: response.data.contact_name,
          emailId: response.data.email,
          mobileNo:this.commonSvc.setUSFormatPhoneNumber(response.data.mobile),
          address: response.data.address,
          accountType: response.data.account_type,
          officeLocation: response.data.office_location,
          officeAddress: response.data.office_address,
          officeZip: response.data.office_zip,
          officeCity: response.data.office_city,
          officeState: response.data.office_state
        })
      }
    })
  }

  editProfileForm = this.fb.group({
    companyName: ['', [Validators.required, this.formValidationSvc.notEmpty]],
    contactName: ['', [Validators.required, this.formValidationSvc.notEmpty]],
    emailId: ['', [Validators.required, this.formValidationSvc.notEmpty, this.formValidationSvc.validEmail]],
    mobileNo: ['', [Validators.required, this.formValidationSvc.phoneNumberUS,]],
    address: ['', [Validators.required]],
    accountType: ['', [Validators.required]],
    officeLocation: ['', [Validators.required]],
    officeAddress: ['', [Validators.required]],
    officeZip: ['', [Validators.required]],
    officeCity: ['', [Validators.required]],
    officeState: ['', [Validators.required]],
  })

  get f() { return this.editProfileForm.controls; }

  ngAfterViewInit() {
    document.addEventListener('mouseup', (e) => {
      let container: any = document.getElementById('shortDropdown');
      if (container) {
        if (!container.contains(e.target)) {
          if (this.isDropdownVisible) {
            this.isDropdownVisible = false
          } else {
            this.isDropdownVisible = true
          }
        }
      }
    });
    this.formValidationSvc.forms();
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  chekcZipCode(ev: any) {
    if (ev.target.value.length > 4) {
      this.validZip = false;
      this.validZipMessage = '';
      this.apiSvc.post(AppConfig.apiUrl.common.locationByZip, { zip: ev.target.value.toString() }).subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            if (response.data.is_serviceable == 1 && response.data.active_status == 1) {
              this.validZip = true;
              this.editProfileForm.patchValue({
                officeState: response.data.state,
                officeCity: response.data.city
              });
              this.formValidationSvc.forms();
            } else {
              this.validZipMessage = 'Unavailable services in this zip code';
            }
          } else {
            this.validZipMessage = response.message;
            this.editProfileForm.patchValue({
              officeState: '',
              officeCity: ''
            });
          }
        },
        error: () => {
        },
        complete: () => {
          if (!this.validZip) {
            this.editProfileForm.patchValue({
              officeState: '',
              officeCity: ''
            });
          }
        }
      });
    } else {
      this.validZipMessage = '';
      this.editProfileForm.patchValue({
        officeState: '',
        officeCity: ''
      });
    }
  }

  enableVisibility() {
    this.isVisable = true;
  }

  disableVisibility() {
    this.isVisable = false;
  }

  onSubmit() {
    this.submitted = true
    if (!this.editProfileForm.valid) {
      this.formValidationSvc.validateAllFormFields(this.editProfileForm);
      return
    }
    this.editProfileForm.value.updatedUserType = 3;
    this.editProfileForm.value.mobileNo = this.commonSvc.convertToNormalPhoneNumber(this.f['mobileNo'].value);
    this.apiSvc.put(`${AppConfig.apiUrl.realtorPortal.updateRealtorProfile}`, this.editProfileForm.value).subscribe({
      next: (response: any) => {
        console.log('response', response);
        if (response.status == 1) {          
          this.alertService.success(response.message);       
          this.getRealtorDetails(this.realtorObj.data.realestate_professional_id)
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }





  getRealtorDetails(realtorId:any) { 
    this.apiSvc.post(`${AppConfig.apiUrl.realtorPortal.getRealtorDetails}/${realtorId}`, '').subscribe({
      next: (response: any) => {
        if (response.status == 1) { 
          this.sharedService.updateRealtorData(response);    
        } else {
          this.alertService.error(response.message);
        }
      }
    })
  }
}

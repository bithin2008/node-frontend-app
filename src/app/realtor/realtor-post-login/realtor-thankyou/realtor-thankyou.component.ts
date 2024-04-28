import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/@core/services/alert.service';
import { ApiService } from 'src/app/@core/services/api.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import { SharedService } from 'src/app/@core/services/shared.service';
import { AppConfig } from '../../../@utils/const/app.config';


@Component({
  selector: 'app-realtor-thankyou',
  templateUrl: './realtor-thankyou.component.html',
  styleUrls: ['./realtor-thankyou.component.scss']
})
export class RealtorThankyouComponent {
  public policyId: any = '';
  public policyDetails:any={};
  constructor(
    private sharedService: SharedService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private formValidationService: FormValidationService,
    private apiService: ApiService,
    private router: Router,
    private commonSvc: CommonService,
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Real Estate Professional Thank You');
    this.activatedRoute.queryParams.subscribe((params: any) => {
      console.log(params['policyid']);
      console.log(atob(decodeURIComponent(params['policyid'])));
      this.policyId = atob(decodeURIComponent(params['policyid']));     
    });
  }

  async ngOnInit(): Promise<void> {
    this.policyDetails = await this.getPolicyDetails(this.policyId);
  }



  generateEscrowInvoice(policy_id: any, key: any = null) {
    console.log(policy_id, key);
    this.apiService.post(`${AppConfig.apiUrl.realtorPortal.generateEscrowInvoice}/${policy_id}${key == 'send-mail' ? '/send-mail' : ''}`, '').subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          if (key != 'send-mail' && response.escrow_invoice_url) {
            const url = response.escrow_invoice_url;
            this.downloadFile(url);
          }
          this.alertService.success(response.message);
        } else {
          this.alertService.error(response.message);
        }
      },
      error: () => {
      },
      complete: () => {
        // this.loading = false;
      }
    });

  }

  downloadFile(url: string) {
    const a: any = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop();
    a.setAttribute('target', '_blank'); // Set the target attribute to '_blank'
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getPolicyDetails(policyId: number) {
    return new Promise<void>((resolve, reject) => {
      this.apiService.post(`${AppConfig.apiUrl.realtorPortal.policyDetails}/${policyId}`, '').subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            resolve(response.data)
          }
        },
        error: (err) => {
          reject(err)
        },
      })
    })
  }
}

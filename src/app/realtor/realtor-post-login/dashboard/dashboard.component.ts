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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isDropdownVisible = false;
  isOpenDropdown: boolean = false;
  public isVisable: boolean = false;
  isOpened = true;
  public realtorPolicyList: any = [];
  sortField: string = 'policy_proforma_info_id'; // Default sorting field
  sortOrder: string = 'DESC'; // Default sorting order
  paginationObj = {
    first: 0,
    currentPage: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  };
  itemPerPageDropdown = [10, 20, 30, 50, 100, 150, 200];
  searchKeyword: any = '';
  searchingvalue: any = '';
  public claimCount: number = 0;
  public paidAmount: number = 0;
  public dueAmount: number = 0;
  constructor(
    private sharedService: SharedService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private formValidationService: FormValidationService,
    private apiService: ApiService,
    private router: Router,
    private commonSvc: CommonService,
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Real Estate Professional Dashboard');
    this.activatedRoute.queryParams.subscribe(params => {
      this.paginationObj.currentPage = parseInt(params['page']) || 1;
      this.paginationObj.limit = parseInt(params['limit']) || 10;
      this.paginationObj.first = (this.paginationObj.currentPage - 1) * this.paginationObj.limit || 0;
    });
  }


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

    this.getAllPolicies();
    this.getAllPolicyAmounts();
    this.getAllPolicyDueAmounts();
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  paginate(event: any) {
    this.paginationObj.currentPage = event.page + 1;
    if (this.paginationObj.limit !== event.rows) {
      this.paginationObj.limit = event.rows
    }
    this.router.navigate(['/realestate-professional-portal/dashboard'], {
      queryParams: {
        page: this.paginationObj.currentPage,
        limit: this.paginationObj.limit
      },
      queryParamsHandling: 'merge',
    });
  this.getAllPolicies();

  }

  actionDropDown() {

  }

  enableVisibility() {
    this.isVisable = true;
  }

  disableVisibility() {
    this.isVisable = false;
  }


  ngOnInit(): void {

  }

  updateSorting(columnName: string) {
    // If the same column is clicked again, toggle the sorting order
    if (columnName === this.sortField) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // If a new column is clicked, set the new sorting column and reset the sorting order to 'asc'
      this.sortField = columnName;
      this.sortOrder = 'asc';
    }
    this.isDropdownVisible=false;
    // Call your API endpoint to fetch data with the updated sorting parameters
    this.getAllPolicies();
  }

  searchPolicy(ev:any){
    if(ev.target.value.length>2){      
      this.getAllPolicies()
    }
    if(ev.target.value.length==0){  
      this.getAllPolicies() 
    }

  }

  getAllPolicies() {
    this.apiService.post(`${AppConfig.apiUrl.realtorPortal.getAllRealtorPolicies}?page=${this.paginationObj.currentPage}&limit=${this.paginationObj.limit}&sortField=${this.sortField}&sortOrder=${this.sortOrder}&search=${this.searchingvalue}`, '').subscribe({
      next: (response: any) => {
        this.realtorPolicyList = response.data;
        this.paginationObj = response?.pagination;
        this.realtorPolicyList.forEach((item: any) => {
          if(this.searchingvalue.length==0){
            //this.claimCount = this.claimCount + item.policy_info.claim_list.length;
          //   item.policy_info.payment_details.forEach((paymnt: any) => {
          //  //   this.paidAmount = this.paidAmount + paymnt.amount;
          //     if(paymnt.payment_status != 1){
          //       this.dueAmount = this.dueAmount + paymnt.amount;
          //     }               
          //   })
          }
          
        });
      }
    })
  }

  getAllPolicyAmounts() {
    this.apiService.post(`${AppConfig.apiUrl.realtorPortal.getAllRealtorPolicyPaidAmount}`, '').subscribe({
      next: (response: any) => {
        this.paidAmount = response.paid_amount 
      }
    })
  }
  
  getAllPolicyDueAmounts() {
    this.apiService.post(`${AppConfig.apiUrl.realtorPortal.getAllRealtorPolicyDueAmount}`, '').subscribe({
      next: (response: any) => {
        this.dueAmount = response.due_amount 
      }
    })
  }




  // -------------------------

  generatePaymentReceipt(policy_id: any, key: any = null) {
    console.log(policy_id,key); 
    this.apiService.post(`${AppConfig.apiUrl.realtorPortal.generatePaymentReceipt}/${policy_id}${key == 'send-mail' ? '/send-mail' : ''}`, '').subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          if (key != 'send-mail' && response.payment_receipt_url) {
            const url = response.payment_receipt_url;
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
        //this.loading = false;
      }
    });

  }
  generateEscrowInvoice(policy_id: any, key: any = null) {
    console.log(policy_id,key);
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
}

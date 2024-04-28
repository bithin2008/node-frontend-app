import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private receivedCustomerData: BehaviorSubject<object> = new BehaviorSubject<object>({});
  sharedCustomerData$ = this.receivedCustomerData.asObservable();


  private receivedPageData: BehaviorSubject<object> = new BehaviorSubject<object>({});
  sharedPageData$ = this.receivedPageData.asObservable();
  
  private receivedRealtorData: BehaviorSubject<object> = new BehaviorSubject<object>({});
  sharedRealtorData$ = this.receivedRealtorData.asObservable();

  private receivedSubmoduleDetails: BehaviorSubject<object> = new BehaviorSubject<object>({});
  sharedSubmoduleDetails$ = this.receivedSubmoduleDetails.asObservable();

  constructor() { }
  
  updateCustomerData(data: any) {
    this.receivedCustomerData.next(data)
  }

  updatePageData(data: any) {
    this.receivedPageData.next(data)
  }

  updateSubmoduleDetails(data: any) {
    this.receivedSubmoduleDetails.next(data)
  }

  updateRealtorData(data: any) {
    this.receivedRealtorData.next(data)
  }


}

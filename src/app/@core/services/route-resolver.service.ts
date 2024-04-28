import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/@core/services/common.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root',
})
export class RouteResolver implements Resolve<any> {
  constructor(private commonService: CommonService,private activatedRoute: ActivatedRoute, private router: Router,private apiService: ApiService) {}

  async resolve(routeSnapshot: ActivatedRouteSnapshot, ): Promise<Observable<any> | Promise<any> | any> {

    const urlSegments = routeSnapshot.url.map((segment) => segment.path);    
     if(routeSnapshot.url.length==0){
        urlSegments.push('home');
     }
    
    // You can access route parameters if needed
   // const id = route.params.id;

   let seoResponse: any = await this.apiService.get(`${AppConfig.apiUrl.common.getPageDetails}?route=${urlSegments[0] ? urlSegments[0] : 'home'}&active_status=1`).toPromise();
  // console.log('seoResponse',seoResponse);
   

    // Call your API service to fetch data
  
    return seoResponse?seoResponse:false;
  }
}
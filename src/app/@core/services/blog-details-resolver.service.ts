import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/@core/services/common.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root',
})
export class BlogDetailsResolver implements Resolve<any> {
  constructor(private commonService: CommonService,private activatedRoute: ActivatedRoute, private router: Router,private apiService: ApiService) {}

  async resolve(routeSnapshot: ActivatedRouteSnapshot, ): Promise<Observable<any> | Promise<any> | any> {

    const urlSegments = routeSnapshot.url.map((segment) => segment.path);
   
    console.log('urlSegments',urlSegments);
    
    
    let seoResponse: any = await this.apiService.get(`${AppConfig.apiUrl.common.getPostsDetails}/${urlSegments[0]}`).toPromise();
 
   

    // Call your API service to fetch data
    return seoResponse?seoResponse:false;
  }
}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { ErrorPageNotFoundComponent } from '../error-page-not-found/error-page-not-found.component';
import { BlogDetailsResolver } from '../@core/services/blog-details-resolver.service';
import { RouteResolver } from '../@core/services/route-resolver.service';


const routes: Routes = [

  { path: '', component: BlogsComponent},
  { path: ':slug', component: BlogDetailsComponent, resolve: { blogData: BlogDetailsResolver } },
  { path: '**', component: ErrorPageNotFoundComponent }
  
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }

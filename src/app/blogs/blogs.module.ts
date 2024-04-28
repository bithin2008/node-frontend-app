import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogsRoutingModule } from './blogs-routing.module';

import { PaginatorModule } from 'primeng/paginator';
import { SharedModule } from '../@shared/shared.module';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';



@NgModule({
  declarations: [
    BlogsComponent,
    BlogDetailsComponent,
  ],
  imports: [
    CommonModule,
    BlogsRoutingModule,
    PaginatorModule,
    SharedModule
    
  ],
})
export class BlogsModule { }

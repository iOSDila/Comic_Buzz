import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateStoryComponent } from './create-story/create-story.component';
import { CreatedStoriesComponent } from './created-stories/created-stories.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { HomeTemplateRoutingModule } from './home-template-routing.module';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { PaymentComponent } from './payment/payment.component';

import { SlideShowComponent } from './slide-show/slide-show.component';
import { TableSearchPipe } from './table-search.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    CreateStoryComponent,
    CreatedStoriesComponent,
    ManageUsersComponent,
    AdminHomeComponent,
    PaymentComponent,
    SlideShowComponent,
    TableSearchPipe
  ],
  imports: [
    CommonModule,
    HomeTemplateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  entryComponents: [
    ProfileComponent
  ]
})
export class HomeTemplateModule { }

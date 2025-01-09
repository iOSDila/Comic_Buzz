import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { CreateStoryComponent } from './create-story/create-story.component';
import { CreatedStoriesComponent } from './created-stories/created-stories.component';
import { HomeComponent } from './home/home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { PaymentComponent } from './payment/payment.component';
import { HomeTemplateComponent } from './home-template.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
    {
        path: 'home-template',
        component: HomeTemplateComponent,
        children: [
            { path: 'profile', component: ProfileComponent },
            { path: 'create-story', component: CreateStoryComponent },
            { path: 'created-story', component: CreatedStoriesComponent },
            { path: 'home', component: HomeComponent },
            { path: 'admin-user', component: AdminHomeComponent },
            { path: 'manage-user', component: ManageUsersComponent },
            { path: 'pay', component: PaymentComponent }
        ], 
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class HomeTemplateRoutingModule { }

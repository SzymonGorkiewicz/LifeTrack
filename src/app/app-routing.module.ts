import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Site/login/login.component';
import { RegisterComponent } from './Site/register/register.component';
import { HomepageComponent } from './Site/homepage/homepage.component';
import { AuthGuard } from './Services/auth.guard';
import { GraphsComponent } from './Site/graphs/graphs.component';
import { SettingsComponent } from './Site/settings/settings.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent},
  { path: 'homepage', component: HomepageComponent, canActivate: [AuthGuard]},
  { path: 'graphs', component: GraphsComponent, canActivate: [AuthGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

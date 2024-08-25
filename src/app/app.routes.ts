import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewHistoryComponent } from './view-history/view-history.component';

export const routes: Routes = [
  {path:'', redirectTo:'/home', pathMatch:'full'},
  {path:'home', component: HomeComponent},
  {path:'view-history', component: ViewHistoryComponent}
];

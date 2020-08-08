import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'explore',
    loadChildren: () => import('./explore/explore.module').then( m => m.ExplorePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'my-dives',
    loadChildren: () => import('./my-dives/my-dives.module').then( m => m.MyDivesPageModule)
  },
  {
    path: 'weather',
    loadChildren: () => import('./weather/weather.module').then( m => m.WeatherPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'log-dive',
    loadChildren: () => import('./log-dive/log-dive.module').then( m => m.LogDivePageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'edit-dive',
    loadChildren: () => import('./edit-dive/edit-dive.module').then( m => m.EditDivePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
 },
  {
    path: 'temp',
    loadChildren: () => import('./temp/temp.module').then( m => m.TempPageModule)

  },
  {
    path: 'no-internet',
    loadChildren: () => import('./no-internet/no-internet.module').then( m => m.NoInternetPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {  preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

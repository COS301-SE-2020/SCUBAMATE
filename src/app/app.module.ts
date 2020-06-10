import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


//api
import { HttpClientModule } from '@angular/common/http';


//services 
import { accountService } from './service/account.service';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [RouterModule.forRoot([]),
            BrowserModule,
            IonicModule.forRoot(), 
            AppRoutingModule,
            HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    accountService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

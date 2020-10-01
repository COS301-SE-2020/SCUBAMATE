import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FlashCardComponent } from '../app/components/flash-card/flash-card.component';

//forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms' ;

//api
import { HttpClientModule } from '@angular/common/http';

//Connection check
import {ConnectionServiceModule} from 'ng-connection-service';

//services 
import { accountService } from './service/account.service';
import { diveService } from './service/dive.service';
import { weatherService } from './service/weather.service';
import { chartService } from './service/chart.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

//Global
import { GlobalService } from './global.service';


//validators
import { AgeValidator } from './validators/age';

import {HttpModule} from '@angular/http';
//rating 
import { IonicRatingModule  } from 'ionic4-rating';
//cropping
import { Crop } from '@ionic-native/crop/ngx';

@NgModule({
  declarations: [
    AppComponent,
    FlashCardComponent],
  entryComponents: [],
  imports: [HttpModule,
            IonicRatingModule ,
            BrowserModule,
            IonicModule.forRoot(), 
            AppRoutingModule,
            HttpClientModule,
            ConnectionServiceModule,
            FormsModule,
            ReactiveFormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    accountService,
    diveService,
    weatherService,
    chartService,
    AgeValidator,
    Crop,
    GlobalService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

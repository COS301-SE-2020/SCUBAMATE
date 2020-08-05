import { Component} from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {ConnectionService} from 'ng-connection-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent{

  isConnected = true;  
  noInternetConnection: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private connectionService: ConnectionService
  ) {
    this.initializeApp();
    this.connectionService.monitor().subscribe(isConnected => {  
      this.isConnected = isConnected;  
      if (this.isConnected) {  
        this.noInternetConnection=false;  
      }  
      else {  
        this.noInternetConnection=true;  
      }  
    }) 
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}

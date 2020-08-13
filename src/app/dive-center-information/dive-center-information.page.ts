import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-dive-center-information',
  templateUrl: './dive-center-information.page.html',
  styleUrls: ['./dive-center-information.page.scss'],
})
export class DiveCenterInformationPage implements OnInit {

  //Variables
  location: {
    latitude: number,
    longitude: number
  };

  constructor(private geolocation: Geolocation) { }

  ngOnInit() {
    this.findCenterLocation();
  }

  findCenterLocation(){
    

    this.location ={
      latitude: -27.506939,
      longitude: 32.654464
    }


    
  }

}

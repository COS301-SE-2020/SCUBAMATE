import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { diveService } from '../service/dive.service';
import { Router } from '@angular/router';

export interface DC {
  Description: string ;
  Coords: string ;
  Courses: string[];
  LogoPhoto: string ;
  Name: string ;
}

@Component({
  selector: 'app-dive-center-information',
  templateUrl: './dive-center-information.page.html',
  styleUrls: ['./dive-center-information.page.scss'],
})
export class DiveCenterInformationPage implements OnInit {

  /*********************************************
                Global Variables
  *********************************************/
  location: {
    latitude: number,
    longitude: number
  };

  loginLabel:string ;
  currentDiveCenter: DC ;

  //Viewable Variables
  showLoading: Boolean;
  showDiveCenter : Boolean ;

  /********************************************/

  constructor(private router: Router, private _diveService: diveService, private geolocation: Geolocation) { }

  ngOnInit() {
    this.findCenterLocation();

    this.showDiveCenter = false; 
    this.showLoading = true;

    this.loginLabel ="Login";
      if(!localStorage.getItem("accessToken"))
      {
        this.loginLabel = "Login";
      }else{
        this.loginLabel = "Log Out";
      }

    this._diveService.getSingleDiveCenter(localStorage.getItem("ViewDiveCenter")).subscribe( data=>{
      this.currentDiveCenter = data;

      this.showLoading = false;
      this.showDiveCenter = true ;
    });

  }

  ionViewWillEnter(){
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
    }
  }

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken");
      this.router.navigate(['home']);
    }else{
      this.router.navigate(['login']);
    }
  }

  findCenterLocation(){
    

    this.location ={
      latitude: -27.506939,
      longitude: 32.654464
    }


    
  }

}

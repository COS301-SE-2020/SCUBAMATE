import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';
import { Router } from '@angular/router';

export interface DS {
  Description: string ;
  Coords: string ;
  Name: string ;
  LogoPhoto: string ; 
}

@Component({
  selector: 'app-dive-site-information',
  templateUrl: './dive-site-information.page.html',
  styleUrls: ['./dive-site-information.page.scss'],
})
export class DiveSiteInformationPage implements OnInit {

    /*********************************************
                Global Variables
  *********************************************/
 Key = {
  key: null,
  city: null,
  province: null
};
Coordinates = {
  Latitude: null,
  Longitude: null
};
Weather = {
  Date: null,
  Min: null,
  Max: null,
  Day: null,
  Night: null,
  Desc: null ,
  Wind: null
};
tempDate: Date;
weatherDate: string;

loginLabel:string ;
currentDiveSite: DS ;
accountType : string;

//Viewable Variables
showLoading: Boolean;
showDiveSite : Boolean ;

/********************************************/

  constructor(private _weatherService: weatherService , private router: Router, private _diveService: diveService, private geolocation: Geolocation) {
    if(localStorage.getItem("accessToken")){
      if(localStorage.getItem("accessToken").substring(36, 38) == "01"){
        this.accountType = "Instructor"
      }else if (localStorage.getItem("accessToken").substring(36, 38) == "00"){
        this.accountType = "Diver"
      }else if(localStorage.getItem("accessToken").substring(36, 38) == "10"){
        this.accountType = "Admin"
      }else if(localStorage.getItem("accessToken").substring(36, 38) == "11"){
        this.accountType = "SuperAdmin"
      }else{
        this.accountType = "*Diver"
      }
    }
   }

  ngOnInit() {

    
    this.showDiveSite = false; 
    this.showLoading = true;

    this.loginLabel ="Login";
      if(!localStorage.getItem("accessToken"))
      {
        this.loginLabel = "Login";
      }else{
        this.loginLabel = "Log Out";
      }

      if(localStorage.getItem("accessToken")){
        if(localStorage.getItem("accessToken").substring(36, 38) == "01"){
          this.accountType = "Instructor"
        }else if (localStorage.getItem("accessToken").substring(36, 38) == "00"){
          this.accountType = "Diver"
        }else if(localStorage.getItem("accessToken").substring(36, 38) == "10"){
          this.accountType = "Admin"
        }else if(localStorage.getItem("accessToken").substring(36, 38) == "11"){
          this.accountType = "SuperAdmin"
        }else{
          this.accountType = "*Diver"
        }
      }

    this._diveService.getSingleDiveSite(localStorage.getItem("ViewDiveSite")).subscribe( data=>{
      this.currentDiveSite = data;
      console.log("---------------");
      console.log(data);
      this.showLoading = false;
      this.showDiveSite = true ;

      //GET Weather at Dive Center
      this.Coordinates ={
        Latitude: this.currentDiveSite.Coords.substr(0, this.currentDiveSite.Coords.indexOf(","))  ,
        Longitude: this.currentDiveSite.Coords.substr(this.currentDiveSite.Coords.indexOf(",")+1, this.currentDiveSite.Coords.length -1 ) 
      }


      this._weatherService.getLocationKey(this.Coordinates).subscribe(res => {
        this.Key.key = res.Key;
        this.Key.city = res.LocalizedName;
        this.Key.province = res.AdministrativeArea.LocalizedName;
  
        this._weatherService.getLogWeather(this.Key).subscribe(res => {
              this.Weather.Date = res.DailyForecasts[0].Date;
              this.Weather.Min = res.DailyForecasts[0].Temperature.Minimum.Value + " " +res.DailyForecasts[0].Temperature.Minimum.Unit;
              this.Weather.Max = res.DailyForecasts[0].Temperature.Maximum.Value + " " + res.DailyForecasts[0].Temperature.Maximum.Unit;
              this.Weather.Day = res.DailyForecasts[0].Day.IconPhrase;
              this.Weather.Night = res.DailyForecasts[0].Night.IconPhrase;
              this.Weather.Desc = res.Headline.Text;
              this.Weather.Wind = res.DailyForecasts[0].Day.Wind.Speed.Value + " " + res.DailyForecasts[0].Day.Wind.Speed.Unit ;


          });
      });
    });
  }

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken");
      this.accountType = "*Diver";
      this.router.navigate(['login']);
    }else{
      this.router.navigate(['login']);
    }
  }

}

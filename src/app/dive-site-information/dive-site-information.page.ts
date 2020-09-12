import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';
import { Router } from '@angular/router';

import { GlobalService } from "../global.service";

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
optionalWeather : string[];

loginLabel:string ;
currentDiveSite: DS ;
accountType : string;

//Viewable Variables
showLoading: Boolean;
showDiveSite : Boolean ;

/********************************************/

  constructor(public _globalService: GlobalService, private _weatherService: weatherService , private router: Router, private _diveService: diveService, private geolocation: Geolocation) {
    
   }

  ngOnInit() {
    this.optionalWeather = ["cloudy","deary","fog","hazy sunshine","intermittent clouds","mostly cloudy w showers","mostly cloudy","mostly sunny","overcast","partly sunny w showers","partly sunny w t-storms","partly sunny","plenty of sunshine","rain","showers","sunny","t-storms","windy"];
    ;
    
    this.showDiveSite = false; 
    this.showLoading = true;
    this._globalService.activeExploreFeed = "sites";

    this.loginLabel ="Login";
      if(!localStorage.getItem("accessToken"))
      {
        this.loginLabel = "Login";
      }else{
        this.loginLabel = "Log Out";
        this.accountType = this._globalService.accountRole; 
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
              this.Weather.Day = ((res.DailyForecasts[0].Day.IconPhrase).replace('/','')).toLowerCase();
              if(!this.contains(this.optionalWeather, this.Weather.Day)){
                this.Weather.Day ="uncertain";
              }
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

  contains(arr,search): boolean{
      let returnBool = false;
      arr.forEach(function(item) {
          if(item==search){
              returnBool=true;
          }
      });
      return returnBool;
  }
}

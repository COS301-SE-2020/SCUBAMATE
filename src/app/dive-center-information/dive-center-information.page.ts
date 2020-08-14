import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';
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
  currentDiveCenter: DC ;

  //Viewable Variables
  showLoading: Boolean;
  showDiveCenter : Boolean ;

  /********************************************/

  constructor( private _weatherService: weatherService , private router: Router, private _diveService: diveService, private geolocation: Geolocation) { }

  ngOnInit() {


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

      //GET Weather at Dive Center
      this.Coordinates ={
        Latitude: this.currentDiveCenter.Coords.substr(0, this.currentDiveCenter.Coords.indexOf(","))  ,
        Longitude: this.currentDiveCenter.Coords.substr(this.currentDiveCenter.Coords.indexOf(",")+1, this.currentDiveCenter.Coords.length -1 ) 
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

              this.tempDate = new Date();
              var dd = String(this.tempDate.getDate()).padStart(2, '0');
              var mm = String(this.tempDate.getMonth() + 1).padStart(2, '0'); 
              var yyyy = this.tempDate.getFullYear();
              var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thurday", "Friday", "Saturday"];
              var day = days[this.tempDate.getDay()];

              this.weatherDate =   day + ", " + dd + "/" + mm + "/" + yyyy;
             /* document.getElementById("Date").innerText = this.weatherDate;
              document.getElementById("WeatherDesc").innerText = this.Weather.Desc;
              document.getElementById("City").innerText = this.Key.city;
              document.getElementById("Coordinates").innerText = this.Coordinates.Latitude + ", " + this.Coordinates.Longitude;
              document.getElementById("MinTemp").innerText += " " + this.Weather.Min;
              document.getElementById("MaxTemp").innerText += " " + this.Weather.Max;
              document.getElementById("Day").innerText += " " + this.Weather.Day;
              document.getElementById("Night").innerText += " " + this.Weather.Night;*/
              console.log(this.Weather);

          });
      });





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



}

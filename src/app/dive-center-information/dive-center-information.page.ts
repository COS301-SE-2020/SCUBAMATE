import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';
import { Router } from '@angular/router';
//import { Http} from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { GlobalService } from "../global.service";

export interface DC {
  Description: string ;
  Coords: string ;
  Courses: string[];
  LogoPhoto: string ;
  Name: string ;
  Instructors: string[] ;
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
  optionalWeather : string[];

  loginLabel:string ;
  currentDiveCenter: DC ;
  accountType : string ;

  //Viewable Variables
  showLoading: Boolean;
  showDiveCenter : Boolean ;
  showWeather : Boolean = false; 

  /********************************************/

  constructor(public _globalService: GlobalService,  private _weatherService: weatherService , private router: Router, private _diveService: diveService, private geolocation: Geolocation, private http: HttpClient) { 
    
  }


  ngOnInit() {
    this.optionalWeather = ["cloudy","deary","fog","hazy sunshine","intermittent clouds","mostly cloudy w showers","mostly cloudy","mostly sunny","overcast","partly sunny w showers","partly sunny w t-storms","partly sunny","plenty of sunshine","rain","showers","sunny","t-storms","windy"];
    ;
    this.showDiveCenter = false; 
    this.showLoading = true;
    this._globalService.activeExploreFeed = "centers";

    this.loginLabel ="Login";
      if(!localStorage.getItem("accessToken"))
      {
        this.loginLabel = "Login";
      }else{
        this.loginLabel = "Log Out";
        this.accountType = this._globalService.accountRole;
      }
      
    this._diveService.getSingleDiveCenter(localStorage.getItem("ViewDiveCenter")).subscribe( data=>{
      this.currentDiveCenter = data;
      console.log(data);
      
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

              
              this.Weather.Day = ((res.DailyForecasts[0].Day.IconPhrase).replace('/','')).toLowerCase();
              if(!this.contains(this.optionalWeather, this.Weather.Day)){
                this.Weather.Day ="uncertain";
              }
              this.Weather.Night = res.DailyForecasts[0].Night.IconPhrase;
              this.Weather.Desc = res.Headline.Text;
              this.Weather.Wind = res.DailyForecasts[0].Day.Wind.Speed.Value + " " + res.DailyForecasts[0].Day.Wind.Speed.Unit ;

             this.showWeather = true; 
             
             //console.log("Weather Pic: " +  this.Weather.Day );

             this.showLoading = false;
          });
      });

    });

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
                
  ionViewWillEnter(){
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
      this.accountType = this._globalService.accountRole;
    }
   
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

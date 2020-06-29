import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

export interface Dive{
  Buddy : string;
  TimeIn: string;
  TimeOut: string;
  DiveDate: string ;
  Weather: string[] ; 
}

@Component({
  selector: 'app-my-dives',
  templateUrl: './my-dives.page.html',
  styleUrls: ['./my-dives.page.scss'],
})
export class MyDivesPage implements OnInit {
//{Location: "Here" , DateOf: "07/03/2019", Weather: "Sunny 70% Visibility", TimeIn: "10:00", TimeOut:"10:45", Buddy: "Gerorge Flint"} 
   diveLst: Dive[] ;
  loginLabel:string ;
  Key = {
    "key": null
  };
  Coordinates ={
    Latitude: null,
    Longitude: null
  };

  constructor(private router: Router, private _diveService: diveService, private _weatherService: weatherService, private geolocation: Geolocation) {}
  
  ngOnInit() {
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }

    console.log("Do a Private search:");
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log("Getting Coordinates");
      this.Coordinates.Latitude = resp.coords.latitude;
      this.Coordinates.Longitude = resp.coords.longitude;
      console.log(this.Coordinates);

      this._weatherService.getLocationKey(this.Coordinates).subscribe(res => {
        console.log("Getting location key");
        this.Key.key = res.Key;
        console.log("getLocationKey returned: " + this.Key);
  
        this._weatherService.getLogWeather(this.Key).subscribe(res => {
        console.log("Getting weather information");
        console.log("Date: " + res.DailyForecasts[0].Date);
        console.log("Temperature Min: " + res.DailyForecasts[0].Temperature.Minimum.Value + res.DailyForecasts[0].Temperature.Minimum.Unit);
        console.log("Temperature Max: " + res.DailyForecasts[0].Temperature.Maximum.Value + res.DailyForecasts[0].Temperature.Maximum.Unit);
        console.log("Day Description: " + res.DailyForecasts[0].Day.IconPhrase);
        console.log("Night Description: " + res.DailyForecasts[0].Night.IconPhrase);
      });
      });

     }).catch((error) => {
       console.log('Error getting location', error);
     });
    
      //get private dives
      if(localStorage.getItem("accessToken") != null)
      {
        this._diveService.getPrivateDive().subscribe( res =>{
          console.log(res);
          console.log(res.Items);

            this.diveLst = res.Items;
        })
         
      }else{
        this.diveLst = [];
      }
      


  }

  ionViewWillEnter(){
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }

    console.log("Do a Private search:");
    //get private dives
    if(localStorage.getItem("accessToken") != null)
    {
      this._diveService.getPrivateDive().subscribe( res =>{
        console.log(res);
        console.log(res.Items);

          this.diveLst = res.Items;
      })
       
    }else{
      this.diveLst = [];
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

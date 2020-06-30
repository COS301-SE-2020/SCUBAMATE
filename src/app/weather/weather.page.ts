import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { weatherService } from '../service/weather.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage implements OnInit {

  Key = {
    "key": null
  };
  Coordinates ={
    Latitude: null,
    Longitude: null
  };
  loginLabel:string ;
  constructor(private router: Router, private _weatherService: weatherService,private geolocation: Geolocation) {}
  
  ngOnInit() {
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }

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
  }

  ionViewWillEnter(){
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }
  }

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken");
      this.router.navigate(['']);
    }else{
      this.router.navigate(['login']);
    }
  }
}

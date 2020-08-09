import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { weatherService } from '../service/weather.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as CryptoJS from 'crypto-js';  
import { UUID } from 'angular2-uuid';
import {ConnectionService} from 'ng-connection-service';
import { filter } from 'rxjs/operators';

//forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';


export interface DiveLog{
  DiveID : string; 
  AccessToken: string ; 
  Approved: boolean;
  DiveDate: string;
  TimeIn: string;
  TimeOut: string;
  Visibility:string;
  Depth: string;
  Buddy:string;
  DiveTypeLink: string;
  AirTemp: number;
  SurfaceTemp: number;
  BottomTemp: number;
  DiveSite: string;
  Description: string ;
  InstructorLink: "-" ;
  Weather: String[] ;
  DivePublicStatus: Boolean;
}


@Component({
  selector: 'app-log-dive',
  templateUrl: './log-dive.page.html',
  styleUrls: ['./log-dive.page.scss'],
})
export class LogDivePage implements OnInit {

  /*********************************************
                Global Variables
  *********************************************/
    uuidValue:string;
    showLoading: Boolean;
    DiveTypeLst: [];
    DiveSiteLst: [];
    BuddyLst:[];
    cDate : Date; 
    currentDate : string ;
    MaxTempAPI : number ;
    MinTempAPI : number ;
    MoonPhase : string ;
    WeatherDescription: string ; 
    WindSpeed : string;

    isConnected = true;  
    noInternetConnection: boolean;
    previousUrl: string;
    //Form Groups
  diveForm;
  diveObj: DiveLog;

  /********************************************/
  
   Key = {
    "key": null
  };
  Coordinates ={
    Latitude: null,
    Longitude: null
  };
  loginLabel:string ;


  constructor(private _accountService : accountService, private router: Router, private _diveService: diveService, private _weatherService: weatherService,private geolocation: Geolocation, public formBuilder: FormBuilder, public alertController : AlertController, private connectionService: ConnectionService) {
    this.connectionService.monitor().subscribe(isConnected => {  
      this.isConnected = isConnected;  
      if (this.isConnected) {  
        this.noInternetConnection=false;  
      }  
      else {  
        this.noInternetConnection=true;
        this.router.navigate(['no-internet']);
      }  
    });
    //generate GUID
    this.uuidValue=UUID.UUID();

     //Diver Form
     this.diveObj ={
      DiveID :  "D"+ this.uuidValue,
      AccessToken: localStorage.getItem("accessToken"),
      Approved: false,
      DiveDate: "",
      TimeIn: "",
      TimeOut: "",
      Visibility:"",
      Depth: "",
      Buddy: "",
      DiveTypeLink: "",
      AirTemp: 0 ,
      SurfaceTemp: 0 ,
      BottomTemp: 0 ,
      DiveSite: "",
      Description: "",
      InstructorLink: "-" ,
      Weather: [] ,
      DivePublicStatus: false
    }


    this.diveForm = formBuilder.group({
      DiveID: ['', Validators.required],
      AccessToken: ['', Validators.required],
      Approved: [],
      DiveDate: ['', Validators.required],
      TimeIn: ['', Validators.required],
      TimeOut: ['', Validators.required],
      Visibility:['', Validators.required],
      Depth: ['', Validators.required],
      Buddy: ['', Validators.required],
      DiveTypeLink: ['', Validators.required],
      AirTemp: ['', Validators.required],
      SurfaceTemp: ['', Validators.required],
      BottomTemp: ['', Validators.required],
      DiveSite: ['', Validators.required],
      Description: ['', Validators.required],
      InstructorLink: [''] ,
      Weather: [''] ,
      DivePublicStatus: ['']
    });

    router.events.pipe(
      filter(event => event instanceof NavigationEnd)  
    ).subscribe((event: NavigationEnd) => {
      console.log(event.url);
      if(event.url == '/no-internet'){
        console.log("Calling saveTempLog");
        this.saveTempLog();
      }
      else if(event.url == '/log-dive'){
        console.log("Calling checkComplete");
        // if(this.checkCompleteLog() == false){
        //   console.log("Not complete form, calling restore");
        //   this.restoreDive();
        // }
        // else{
        //   console.log("Form complete, can automatically submit");
        // }
      }
    });
  }
  
  ngOnInit() {
     this.cDate = new Date();
      var dd = String(this.cDate.getDate()).padStart(2, '0');
      var mm = String(this.cDate.getMonth() + 1).padStart(2, '0'); 
      var yyyy = this.cDate.getFullYear();

      this.currentDate =   yyyy + '-'+ mm + '-' + dd  ;
      console.log(this.currentDate);

    this.showLoading = true;
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }

     this._diveService.getDiveSites("*").subscribe(
      data => {
          console.log(data);
          this.DiveSiteLst = data.ReturnedList ; 
          this.showLoading = false;
      }
    ); //end DiveSite req

    this._diveService.getDiveTypes("*").subscribe(
      data => {
          console.log(data);
          this.DiveTypeLst = data.ReturnedList ; 
          console.log("In type");
          this.showLoading = false;
      }
    ); //end DiveType req

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
        console.log(res.DailyForecasts[0]);
        //setup variables
        this.MinTempAPI = res.DailyForecasts[0].Temperature.Minimum.Value;
        this.MaxTempAPI = res.DailyForecasts[0].Temperature.Maximum.Value;
        this.MoonPhase = res.DailyForecasts[0].Moon.Phase ;
        this.WeatherDescription = res.DailyForecasts[0].Day.ShortPhrase ;
        this.WindSpeed = res.DailyForecasts[0].Day.Wind.Speed.Value + " " + res.DailyForecasts[0].Day.Wind.Speed.Unit  ; 


      });
      });

     }).catch((error) => {
       console.log('Error getting location', error);
     });

  } //end ngOnInit

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
      this.router.navigate(['home']);
    }else{
      this.router.navigate(['login']);
    }
  }


  onSubmit(pub: boolean, desc: string, siteOf:string, dateOf : string , timeI : string, timeO: string  , diveT: string, bud: string, vis: string, dep: string, aTemp: number, sTemp: number, bTemp: number,  event: Event) {
    event.preventDefault();

    //generate GUID
    this.uuidValue=UUID.UUID();


    if(localStorage.getItem('accessToken')) //if user signed in 
    {
            if( ( siteOf =="") || (dateOf=="") || ( timeI =="") ||( timeO =="") || ( diveT=="")  )
            {
              alert("Fill in al the fields");
            }
            else
            {
              if(bud == ""){
                bud = "-";
              }
              //Weather req
              this._weatherService.getLogWeather(siteOf).subscribe(res => {
                console.log(res);
                //var tempWeather: [] = [res.wind, res.moon, res.sunny, res.swell]
              });
              //logging the dive
                  var log = {
                    DiveID: "D"+ this.uuidValue,
                    AccessToken : localStorage.getItem('accessToken'),
                    Approved: false,
                    DiveDate: dateOf ,
                    TimeIn: timeI ,
                    TimeOut: timeO ,
                    Visibility: vis + "m",
                    Depth: dep + "m",
                    Buddy: bud ,
                    DiveTypeLink: diveT   ,
                    AirTemp: Number(aTemp) ,
                    SurfaceTemp: Number(sTemp) ,
                    BottomTemp: Number(bTemp) ,
                    DiveSite: siteOf,
                    Description: desc ,
                    InstructorLink: "-" ,
                    Weather: [this.WindSpeed, this.MoonPhase, this.WeatherDescription],
                    DivePublicStatus: pub
                  } as DiveLog;
          
              console.log(log);
              this.showLoading = true;
              this._diveService.logDive(log).subscribe( res =>{
                
                console.log(res);
                this.showLoading = false;
               this.router.navigate(['my-dives']);
                console.log("after nav");
              })
            }
    
  }else{
    alert("To Log dives first sign in to your account");
  }


  }


  buddyListFinder(eventValue: string){

     if(eventValue.length >= 2)
    {
        this.showLoading = true;
        this._accountService.lookAheadBuddy(eventValue).subscribe(
          data => {
            console.log(eventValue);
              console.log(data);
              this.BuddyLst = data.ReturnedList ; 
              this.showLoading = false;
          }
        ); //end Buddy req
    }

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: 'Invalid Log',
      message: 'Please provide all required information to complete the Dive Log',
      buttons: ['OK']
    });
  
    await alert.present();
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: 'Successful Log',
      message: 'Your dive has been logged',
      buttons: ['OK']
    });
  
    await alert.present();
  }

  DiveLogSubmit(){
    this.diveObj.Weather =  [this.WindSpeed, this.MoonPhase, this.WeatherDescription] ; 
    this.diveObj.AirTemp = Number(this.diveObj.AirTemp );
    this.diveObj.SurfaceTemp = Number(this.diveObj.SurfaceTemp );
    this.diveObj.BottomTemp = Number(this.diveObj.BottomTemp );
    this.diveObj.InstructorLink = "-";
    this.diveObj.Visibility = this.diveObj.Visibility + "m";
    this.diveObj.Depth = this.diveObj.Depth + "m";
    console.log(this.diveObj);

  /*  if( !this.diveForm.valid ){
      this.presentAlert();
    }else{
 

      console.log(this.diveObj);
     


    } */
    this.showLoading = true;
    this._diveService.logDive(this.diveObj).subscribe( res =>{
                
      console.log(res);
      this.showLoading = false;
      this.presentSuccessAlert();
      localStorage.removeItem("Backup");
      this.router.navigate(['my-dives']);
    });
  }

  saveTempLog(){
    this.diveObj.Weather =  [this.WindSpeed, this.MoonPhase, this.WeatherDescription] ; 
    this.diveObj.AirTemp = Number(this.diveObj.AirTemp );
    this.diveObj.SurfaceTemp = Number(this.diveObj.SurfaceTemp );
    this.diveObj.BottomTemp = Number(this.diveObj.BottomTemp );
    this.diveObj.InstructorLink = "-";
    this.diveObj.Visibility = this.diveObj.Visibility;
    this.diveObj.Depth = this.diveObj.Depth;
    localStorage.setItem("Backup", JSON.stringify(this.diveObj));
    console.log("Saving the temp log to localstorage: " + localStorage.getItem("Backup"));
  }

  checkCompleteLog(){
    // var log;
    // if(localStorage.getItem("Backup")){
    //   log = JSON.parse(localStorage.getItem("Backup"));
    //   if(log.DiveSite == "" || log.DiveType == "" || log.DiveDate == "" || log.TimeIn == "" || log.TimeOut == "" || log.Buddy == "" || log.Visibility == "" || log.Depth == "" || log.Description == ""){
    //     return false;
    //   }
    //   else return true;
    // }
  }

  restoreDive(){
    // var log = JSON.parse(localStorage.getItem("Backup"));
    // this.diveObj.Weather =  [this.WindSpeed, this.MoonPhase, this.WeatherDescription]; 
    // this.diveObj.AirTemp = Number(log.AirTemp);
    // this.diveObj.SurfaceTemp = Number(log.SurfaceTemp);
    // this.diveObj.BottomTemp = Number(log.BottomTemp);
    // this.diveObj.InstructorLink = "-";
    // this.diveObj.Visibility = log.Visibility;
    // this.diveObj.Depth = log.Depth;
  }

  automaticallySendLog(){
    // console.log("Will automatically send log and then route as per norm.");
    // var log = JSON.parse(localStorage.getItem("Backup"));
    // this.showLoading = true;
    // this._diveService.logDive(log).subscribe( res =>{
                
    //   console.log(res);
    //   this.showLoading = false;
    //   this.presentSuccessAlert();
    //   localStorage.removeItem("Backup");
    //   this.router.navigate(['my-dives']);
    // });
  }

}

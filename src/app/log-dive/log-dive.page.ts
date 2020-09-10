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
import { GlobalService } from "../global.service";

//forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { JsonPipe } from '@angular/common';




export interface DiveLog{
  DiveID : string; 
  AccessToken: string ; 
  DiveDate: string;
  TimeIn: string;
  TimeOut: string;
  Visibility:string;
  Depth: string;
  Buddy:string;
  DiveTypeLink: string;
  AirTemp: number;
  SurfaceTemp: number;
  BottomTemp: number
  DiveSite: string;
  Description: string ;
  InstructorLink: String[] ;
  Weather: String[] ;
  DivePublicStatus: Boolean;
  isCourse: Boolean;
  Rating: number;
  WaterType: String;
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

    //Lookahead Lists
    DiveTypeLst: [];
    DiveSiteLst: [];
    BuddyLst:[];
    CourseLst: [];
    InstructorLst:[];

    //Instructor Array 
    instructorInput: string ;
    instructorUserInput : string[];
    showInstructors : boolean = false;

    //Dive Specific Details
    cDate : Date; 
    currentDate : string ;
    MaxTempAPI : number ;
    MinTempAPI : number ;
    MoonPhase : string ;
    WeatherDescription: string ; 
    WindSpeed : string;
    RateGiven : number;

    //Form Groups
    diveForm;
    diveObj: DiveLog;

    //Page Navigation
    firstPageVisible : boolean ;
    secondPageVisible: boolean;
    thirdPageVisible: boolean;
    fourthPageVisible: boolean; 

    //Viewable Inputs
    showCourseInput : boolean;
    accountType : string;
    currentDiveTypeSelected : string = "Normal";
    //showDiveTypeInput : boolean; 
    allLoaded: boolean ;
    

  /********************************************/
  isConnected = true;  
  noInternetConnection: boolean;
  previousUrl: string;

   Key = {
    "key": null
  };
  Coordinates ={
    Latitude: null,
    Longitude: null
  };
  loginLabel:string ;

  constructor(public _globalService: GlobalService,  private _accountService : accountService, private router: Router, private _diveService: diveService, private _weatherService: weatherService,private geolocation: Geolocation, public formBuilder: FormBuilder, public alertController : AlertController, private connectionService: ConnectionService) {
    
    
    
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

      //Get Current Date default input
      this.cDate = new Date();
      var dd = String(this.cDate.getDate()).padStart(2, '0');
      var mm = String(this.cDate.getMonth() + 1).padStart(2, '0'); 
      var yyyy = this.cDate.getFullYear();

      this.currentDate =   yyyy + '-'+ mm + '-' + dd  ;

    //generate GUID
    this.uuidValue=UUID.UUID();
    this.showLoading = true;

    //Get coordinates and return current weather
    this.geolocation.getCurrentPosition().then((resp) => {
      // console.log("Getting Coordinates");
      this.Coordinates.Latitude = resp.coords.latitude;
      this.Coordinates.Longitude = resp.coords.longitude;
      // console.log(this.Coordinates);

      this._weatherService.getLocationKey(this.Coordinates).subscribe(res => {
        // console.log("Getting location key");
        this.Key.key = res.Key;
        // console.log("getLocationKey returned: " + this.Key);
  
        this._weatherService.getLogWeather(this.Key).subscribe(res => {
        console.log(res.DailyForecasts[0]);
        //setup variables
        this.MinTempAPI = res.DailyForecasts[0].Temperature.Minimum.Value;
        this.MaxTempAPI = res.DailyForecasts[0].Temperature.Maximum.Value;
        this.MoonPhase = res.DailyForecasts[0].Moon.Phase ;
        this.WeatherDescription = (res.DailyForecasts[0].Day.IconPhrase).replace('/','');
        this.WindSpeed = res.DailyForecasts[0].Day.Wind.Speed.Value + " " + res.DailyForecasts[0].Day.Wind.Speed.Unit  ; 


          //Diver Form
          this.diveObj ={
            DiveID :  "D"+ this.uuidValue,
            AccessToken: localStorage.getItem("accessToken"),
            DiveDate: this.currentDate,
            TimeIn: "",
            TimeOut: "",
            Visibility:"",
            Depth: "",
            Buddy: "",
            DiveTypeLink: "",
            AirTemp: this.MinTempAPI  ,
            SurfaceTemp: this.MinTempAPI  ,
            BottomTemp: this.MinTempAPI ,
            DiveSite: "",
            Description: "",
            InstructorLink: [] ,
            Weather: [] ,
            DivePublicStatus: false,
            isCourse: false,
            Rating: 0, 
            WaterType: "Saltwater"
          }

        //setup weather info in Dive Log Object
        this.diveObj.Weather =  [this.WindSpeed, this.MoonPhase, this.WeatherDescription] ; 
        this.showLoading = false;
        this.allLoaded = true;
      });
      });

     }).catch((error) => {
       console.log('Error getting location', error);
     });
    
    this.diveForm = formBuilder.group({
      DiveID: ['', Validators.required],
      AccessToken: ['', Validators.required],
      DiveDate: ['',Validators.required],
      TimeIn: ['', Validators.required],
      TimeOut: ['', Validators.required],
      Visibility:[ Validators.required],
      Depth: [ Validators.required],
      Buddy: ['', Validators.required],
      DiveTypeLink: ['', Validators.required],
      AirTemp: ['',Validators.required],
      SurfaceTemp: ['', Validators.required],
      BottomTemp: ['', Validators.required],
      DiveSite: ['', Validators.required],
      Description: ['', Validators.required],
      InstructorLink: [''] ,
      Weather: [''] ,
      DivePublicStatus: [''],
      Rating : [''],
      WaterType: ['']
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
        if(this.checkCompleteLog() == false){
          console.log("Not complete form");
          //this.restoreDive();
        }
        else{
          console.log("Form complete, can automatically submit");
          this.presentConfirm();
        }
      }
    });

  }
  
  ngOnInit() {
    //setup page navigation view
    this.firstPageVisible = true;
    this.secondPageVisible = false;
    this.thirdPageVisible = false;
    this.fourthPageVisible = false;

    this.showCourseInput = false;
   // this.showDiveTypeInput = true;

    this.instructorUserInput = new Array();


    this.showLoading = true;
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
      this.accountType = this._globalService.accountRole;
    }
    

  } //end ngOnInit

  ionViewWillEnter(){
    
    //setup page navigation view
    this.firstPageVisible = true;
    this.secondPageVisible = false;
    this.thirdPageVisible = false;
    this.fourthPageVisible = false;

    //this.showCourseInput = false;
    //this.showDiveTypeInput = true;

    this.instructorUserInput = new Array();

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
      this.router.navigate(['home']);
    }else{
      this.router.navigate(['login']);
    }
  }

  onSubmit(pub: boolean, desc: string, siteOf:string, dateOf : string , timeI : string, timeO: string  , diveT: string, bud: string, vis: string, dep: string, aTemp: number, sTemp: number, bTemp: number, rting: number, wtype:string, event: Event) {
    event.preventDefault();

    //generate GUID
    this.uuidValue=UUID.UUID();


    if(localStorage.getItem('accessToken')) //if user signed in 
    {
            if( ( siteOf =="") || (dateOf=="") || ( timeI =="") ||( timeO =="") || ( diveT=="")  )
            {
              alert("Fill in all the fields");
            }
            else
            {
              if(bud == ""){
                bud = "-";
              }
              //Weather req
              this._weatherService.getLogWeather(siteOf).subscribe(res => {
                //console.log(res);
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
                    Visibility: vis ,
                    Depth: dep ,
                    Buddy: bud ,
                    DiveTypeLink: diveT   ,
                    AirTemp: Number(aTemp) ,
                    SurfaceTemp: Number(sTemp) ,
                    BottomTemp: Number(bTemp) ,
                    DiveSite: siteOf,
                    Description: desc ,
                    InstructorLink: [] ,
                    Weather: [this.WindSpeed, this.MoonPhase, this.WeatherDescription],
                    DivePublicStatus: pub,
                    isCourse: this.showCourseInput,
                    Rating: rting,
                    WaterType: wtype
                  } as DiveLog;
          
              //console.log(log);
              this.showLoading = true;
              this._diveService.logDive(log).subscribe( res =>{
                
                //console.log(res);
                this.showLoading = false;
                this.showCourseInput = false;
              //  this.showDiveTypeInput = true;
                this.router.navigate(['my-dives']);
                //console.log("after nav");
              })
            }
    
  }else{
    alert("To Log dives first sign in to your account");
  }
  }


  buddyListFinder(){
     if(this.diveObj.Buddy.length >= 2)
    {
      //console.log(this.diveObj.Buddy);
        this.showLoading = true;
        this._accountService.lookAheadBuddy(this.diveObj.Buddy).subscribe(
          data => {
              //console.log(data);
              this.BuddyLst = data.ReturnedList ; 
              this.showLoading = false;
          }, err =>{
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

  async presentGeneralAlert(hd, msg) {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: hd,
      message: msg,
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

  async presentConfirm() {
    const alert = this.alertController.create({
      header: 'Log Complete',
      message: 'Your last saved dive log was complete. Do you wish to submit?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log("Continuing to complete form.")
          }
        },
        {
          text: 'Submit',
          handler: () => {
            this.automaticallySendLog();
          }
        }
      ]
    });

    (await alert).present();
  }

  DiveLogSubmit(){


    //setup weather final 
    this.diveObj.AirTemp = Number(this.diveObj.AirTemp );
    this.diveObj.SurfaceTemp = Number(this.diveObj.SurfaceTemp );
    this.diveObj.BottomTemp = Number(this.diveObj.BottomTemp );
    this.diveObj.Rating = this.RateGiven ; 
    //link Instructor Array
    this.diveObj.InstructorLink = this.instructorUserInput ; 
    this.diveObj.isCourse = this.showCourseInput ;

    console.log(this.diveObj);

      if(localStorage.getItem("Backup")){
        localStorage.removeItem("Backup");
      }
  
      this.showLoading = true;
      this._diveService.logDive(this.diveObj).subscribe( res =>{
                  
        //console.log(res);
        this.showLoading = false;
        this.presentSuccessAlert();
        this.router.navigate(['my-dives']);
      }, err =>{
        if(err.error)
        {
          alert( err.error);
          this.presentGeneralAlert("Unable to Log Dive", err.error);
        }else{
          this.presentGeneralAlert("Unable to Log Dive", "Something went wrong.. please try again");
        }
      });

    
    
  }

  saveTempLog(){
    //setup weather final 
    this.diveObj.AirTemp = Number(this.diveObj.AirTemp );
    this.diveObj.SurfaceTemp = Number(this.diveObj.SurfaceTemp );
    this.diveObj.BottomTemp = Number(this.diveObj.BottomTemp );
    this.diveObj.Visibility = this.diveObj.Visibility ;
    this.diveObj.Depth = this.diveObj.Depth ;
    this.diveObj.Rating = this.RateGiven;

    //link Instructor Array
    this.diveObj.InstructorLink = this.instructorUserInput ; 

    //console.log(this.diveObj);
    if(localStorage.getItem("Backup")){
      localStorage.removeItem("Backup");
    }
    localStorage.setItem("Backup", JSON.stringify(this.diveObj));
    //console.log("Saving the temp log to localstorage: " + localStorage.getItem("Backup"));
  }

  checkCompleteLog(){
    var log;
    if(localStorage.getItem("Backup")){
      log = JSON.parse(localStorage.getItem("Backup"));
      if(log.DiveSite == "" || log.DiveType == "" || log.DiveDate == "" || log.TimeIn == "" || log.TimeOut == "" || log.Buddy == "" || log.Visibility == "" || log.Depth == "" || log.Description == ""){
        return false;
      }
      else return true;
    }
  }

  restoreDive(){
    var log = JSON.parse(localStorage.getItem("Backup"));
    this.diveObj.Weather =  [this.WindSpeed, this.MoonPhase, this.WeatherDescription]; 
    this.diveObj.AirTemp = Number(log.AirTemp);
    this.diveObj.SurfaceTemp = Number(log.SurfaceTemp);
    this.diveObj.BottomTemp = Number(log.BottomTemp);
    //this.diveObj.InstructorLink = "-";
    this.diveObj.Visibility = log.Visibility;
    this.diveObj.Depth = log.Depth;
    this.diveObj.Rating = log.RateGiven;
  }

  automaticallySendLog(){
    //console.log("Will automatically send log and then route as per norm.");
    var log = JSON.stringify(localStorage.getItem("Backup"));
    //console.log("Automatically sending log " + JSON.parse(log));
    this.showLoading = true;
    if(localStorage.getItem("Backup")){
      localStorage.removeItem("Backup");
    }
    this._diveService.logDive(JSON.parse(log)).subscribe( res =>{

                
      // console.log(res);
      this.showLoading = false;
      this.presentSuccessAlert();
      this.router.navigate(['my-dives']);
    }, err =>{
      if(err.error)
      {
        alert( err.error);
      }else{
        alert("Something went wrong..");
      }
    });
  }

  //Navigation of Pages
  nextPage(){
      if(this.firstPageVisible){
        this.firstPageVisible = false;
        this.secondPageVisible = true;
      }else if(this.secondPageVisible){
        this.secondPageVisible = false;
        this.thirdPageVisible = true;
      }else if (this.thirdPageVisible){
        this.thirdPageVisible = false;
        this.fourthPageVisible = true;
      }
  }

  previousPage(){
      if(this.firstPageVisible){
        this.firstPageVisible = true;
        this.secondPageVisible = false;
      }else if(this.secondPageVisible){
        this.firstPageVisible = true;
        this.secondPageVisible = false;
      }else if (this.thirdPageVisible){
        this.secondPageVisible = true;
        this.thirdPageVisible = false;
      }else if (this.fourthPageVisible){
        this.thirdPageVisible = true;
        this.fourthPageVisible = false;
      }

  }

  viewCourse(typeDive: string){
    if(typeDive == 'Normal'){
      this.showCourseInput = false ;
      this.diveObj.isCourse = false ;
    }else{
      this.showCourseInput = true ;
      this.diveObj.isCourse = true ;
    }
    this.currentDiveTypeSelected = typeDive;
    //this.showCourseInput = !this.showCourseInput;
    this.diveObj.DiveTypeLink = "";
    //this.showDiveTypeInput = !this.showDiveTypeInput; 
  }

  setWaterType(wDive: string){
    this.diveObj.WaterType = wDive ; 
  }


  DiveTypeListFinder(){

    this.showLoading = true; 

    this._diveService.getDiveTypes(this.diveObj.DiveTypeLink).subscribe(res =>{
      this.DiveTypeLst = res.ReturnedList ;
      this.showLoading = false;  

    }, err =>{
      this.showLoading = false; 
    });


  }

  DiveSiteListFinder(){

    this.showLoading = true; 

    this._diveService.getDiveSites(this.diveObj.DiveSite).subscribe(res =>{
      this.DiveSiteLst = res.ReturnedList ;
      this.showLoading = false;  

    }, err =>{
      this.showLoading = false; 
    });


  }

  InstructorListFinder(){

    this.showLoading = true;
    this._accountService.lookAheadInstructor(this.instructorInput).subscribe(data => {
          // console.log(data);
          this.InstructorLst = data.ReturnedList ; 
          this.showLoading = false;
      
        }, err=>{

          this.showLoading = false;

      }
    ); 

  }

  addInstructor(){
    if(this.instructorInput.length >= 2)
    {
     const index: number = this.instructorUserInput.indexOf(this.instructorInput);
     if (index == -1) {
       this.instructorUserInput.push(this.instructorInput);
     }
      this.instructorInput = "";
      this.showInstructors = true ; 
    }
    this.InstructorLst = [] ;
    // console.log("Course Added: ");
    // console.log(this.instructorUserInput);
    
   }
  
   removeInstructor(s : string){
    const index: number = this.instructorUserInput.indexOf(s);
    if (index !== -1) {
      this.instructorUserInput.splice(index, 1);
      
      if(this.instructorUserInput.length == 0){
        this.showInstructors = false;
      }

    }  
  
    this.InstructorLst = [] ;
  }

  CourseListFinder(){

       this.showLoading = true;
       this._diveService.getDiveCourses(this.diveObj.DiveTypeLink).subscribe(
         data => {
            //  console.log(data);
             this.CourseLst = data.ReturnedList ; 
             this.showLoading = false;
         }, err=>{
          this.showLoading = false;
         }
       ); 
}
  onRateChange(event) {
    //console.log('Your rate:', event);
    this.RateGiven = Number(event);
  }
}

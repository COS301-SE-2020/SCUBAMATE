import { Component, OnInit , ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { chartService } from '../service/chart.service';
import { AlertController } from '@ionic/angular';
import { ThrowStmt } from '@angular/compiler';
import { GlobalService } from "../global.service";

import { Chart } from 'chart.js';
import {mergeMap, groupBy, map, reduce } from 'rxjs/operators';

export interface UC{
  AccessToken: string;
  Email: string ;
  Name: string ;
}

export interface NDC{
  AccessToken: string  ;
  Email : string ;
  LogoPhoto: string ;
  Coords : string ;
  Description : string ;
  Name : string ;
  Courses : string [];
  DiveSites: string[];
}

export interface instructor{
  AccountGuid : string ;
  AccountVerified: boolean ;
  FirstName : string ;
  LastName : string ;
  Email : string ;
  InstructorNumber : string ;
}

export interface DC {
  Description: string ;
  Coords: string ;
  Courses: string[];
  DiveSites: string[];
  LogoPhoto: string ;
  Name: string ;
  Instructors: string[] ;
}

export interface newCourse{
  Name: string ;
  CourseType: string;
  MinAgeRequired: number;
  SurveyAnswer: string ; 
  RequiredCourses: string[];
  QualificationType: string ; 
}

export interface newSite{
  Name: string ;
  Coords: string ;
  Description: string ;
  LogoPhoto: string ;  
  TypeOfDives: string;
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.page.html',
  styleUrls: ['./admin-page.page.scss'],
})
export class AdminPagePage implements OnInit {

  /*********************************************
                Global Variables
  *********************************************/
  loginLabel:string ;
  accountType : string;
  base64textString : string ; 

  //lookahead Lists
  BuddyLst : string [];
  CenterLst : string[];
  CourseLst : string[];
  DiveSiteLst: string[];

  //Course Array 
  showCourses: Boolean = false;
  userCourses : string[];
  courseInputField: string = "";

  //Site Array
  siteInput: string ;
  siteUserInput : string[];
  showSites : boolean = false;

  //Viewable Content
  showRegisterUserToCenter: boolean ;
  showRegisterNewCenter : boolean ;
  showUnverifiedInstructors : boolean ; 
  showVerifiedInstructors: boolean ;  
  showEditBasicDiveCentre : boolean;
  showAddCourse: boolean;
  showAddSite: boolean ; 
  showAddCourseToCentre : boolean ;
  showAddSiteToCentre : boolean ; 
  showLoading: boolean ; 

  showAdminChart : boolean = true ;
  showSuperAdminChart : boolean = true;

  //Verified | Unverified Instructors List
  verifiedInstructors: instructor[]; 
  unverifiedInstructors: instructor[];
  allInstructors: instructor[];

  //Page Views
  firstPageNewCentre : boolean ;
  secondPageNewCentre : boolean ; 
  thirdPageNewCentre : boolean ;
  fourthPageNewCentre : boolean ; 

  //Form Objects
  UserToCenterObj : UC ;
  NewCenterObj: NDC ;
  NewCourseObj: newCourse; 
  NewSiteObj: newSite ; 

  currentDiveCenter: DC ;

  //Charts
  @ViewChild("lineCanvasDivesAtSite") lineCanvasDivesAtSite: ElementRef;
  private lineChartDivesAtSite: Chart;
  totalNumberOfDivesYear : string = "0";
  dateSearch : string = "2020"; 
  timeSearch : string = "All Day";

  
  @ViewChild("pieCanvasDivesAtSiteRating") pieCanvasDivesAtSiteRating: ElementRef;
  private pieChartDivesAtSiteRating: Chart;

  @ViewChild("lineCanvasChartPeekDivesAtSite") lineCanvasChartPeekDivesAtSite: ElementRef;
  private lineChartPeekDivesAtSite: Chart;

  @ViewChild("lineCanvasChartAgeGroup") lineCanvasChartAgeGroup: ElementRef;
  private lineChartAgeGroup: Chart;

  @ViewChild("barCanvasChartRoles") barCanvasChartRoles: ElementRef;
  private barChartChartRoles: Chart;

  @ViewChild("lineCanvasChartCourses") lineCanvasChartCourses: ElementRef;
  private lineChartCourses: Chart;

  @ViewChild("lineCanvasChartFrequencyLogin") lineCanvasChartFrequencyLogin: ElementRef;
  private lineChartFrequencyLogin: Chart;


  //Admin Graph
  showAdminDiveSiteGraph : boolean = false; 

  //Date
  currentDate = new Date();
  



  /********************************************/

  constructor(private _chartService: chartService, public _globalService: GlobalService, public alertController : AlertController , private _diveService: diveService,private router: Router,private _accountService: accountService) {
    this.UserToCenterObj ={
      AccessToken : localStorage.getItem("accessToken"),
      Email : "",
      Name : "" 
    }

    this.NewCenterObj={
      AccessToken: localStorage.getItem("accessToken"),
      Email : "" , 
      LogoPhoto: "" , 
      Coords : "" , 
      Description : "" , 
      Name : "" , 
      Courses :[] ,  
      DiveSites: [] , 
    }

    this.NewCourseObj={
      Name: "",
      CourseType: "",
      MinAgeRequired: 10,
      SurveyAnswer: "", 
      RequiredCourses: [],
      QualificationType: ""
    }

    this.NewSiteObj ={
      Name: "",
      Coords: "",
      LogoPhoto: "",
      Description: "" ,
      TypeOfDives: "" 
    }

  }

  ngOnInit() {
    //Setup page load variables
    this.showRegisterUserToCenter = false; 
    this.showRegisterNewCenter = false ;
    this.showLoading = false;
    this.showAddCourse = false;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = false;
    this.showAddSite = false; 
    this.showAdminChart = true ;
    this.showSuperAdminChart = true ;

    this.firstPageNewCentre = false ; 
    this.secondPageNewCentre = false ; 
    this.thirdPageNewCentre = false; 
    this.fourthPageNewCentre = false; 

    this.showCourses = false;
    this.userCourses = new Array();

    this.siteUserInput = new Array();

    this.allInstructors = new Array();
    this.verifiedInstructors = new Array();
    this.unverifiedInstructors = new Array();
    
    this.verifiedInstructors  = [] ;
    this.unverifiedInstructors = [] ;


    //Setup Dive Centre Object
    this.currentDiveCenter ={
      Description: "",
      Coords: "",
      Courses: [],
      DiveSites: [],
      LogoPhoto: "",
      Name: "",
      Instructors: [],
    }

    //this.hideAllViews();

    

    //Setup Login Label
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";

      this._globalService.activeLabel =  "Log Out";
      this._globalService.accountRole = localStorage.getItem("accessToken").substring(36, 38) ;
      this.accountType = this._globalService.accountRole;



      //get initial chart data
      if(this.accountType == "11"){
        this.showSuperAdminChart = true ; 

        var numDivesBody ={
          "AccessToken" : localStorage.getItem("accessToken") ,
          "DiveSite" : "*",
          "YearOfSearch" : this.currentDate.getFullYear().toString()
        }

        this.dateSearch =  this.currentDate.getFullYear().toString() ;


        this.showLoading = true ;
          this._chartService.numberDivesAtSiteChartData(numDivesBody).subscribe( data =>{
              this.showLoading = false;
              this.totalNumberOfDivesYear = data.TotalNumberOfDives.toString();
 
              this.drawNumDivesAtSiteChart(data, "All Dive Sites");

          },err =>{
            this.showLoading = false;
            
            if(err.error){
              this.generalAlert("Number Of Dives Chart Error", err.error);
            }else{
              console.log("Could not access number Dives At Site Chart Data");
            }
            
          });



          var rateDivesBody ={
            "AccessToken" : localStorage.getItem("accessToken") ,
            "DiveSite" : "*"
          };

          this.showLoading = true ;
          this._chartService.ratingAtDiveSiteChartData(rateDivesBody).subscribe( data =>{
              this.showLoading = false;
               this.drawRatingDivesAtSiteChart(data, "Rating of All Dive Sites");
            
        
          },err =>{
            this.showLoading = false;
            
            if(err.error){
              this.generalAlert("Rating Of Dives Chart Error", err.error);
            }else{
              console.log("Could not access rating of  Dives At Site Chart Data");
            }
            
          });

          var peekDivesBody ={
            "AccessToken" : localStorage.getItem("accessToken") ,
            "DiveSite" : "*",
            "YearOfSearch" : this.currentDate.getFullYear().toString()
          };

          this.showLoading = true ;
          this._chartService.peakTimesDivesAtSiteChartData(peekDivesBody).subscribe( data =>{
              this.showLoading = false;
              this.drawPeekDivesAtSiteChart(data, "All Dive Sites");
          },err =>{
            this.showLoading = false;
            
            if(err.error){
              this.generalAlert("Number Of Dives Chart Error", err.error);
            }else{
              console.log("Could not access number Dives At Site Chart Data");
            }
            
          });


          var ageGroupBody1 ={
            "AccessToken" : localStorage.getItem("accessToken") 
          };

          this.showLoading = true ;
          this._chartService.numberUsersInRoles(ageGroupBody1).subscribe( data =>{
              this.showLoading = false;

            
              this.drawRolesChart(data, "Total Users in Role Groups");
            

          },err =>{
            this.showLoading = false;
            
            if(err.error){
              this.generalAlert("User Role Chart Error", err.error);
            }else{
              console.log("Could not access user role Chart Data");
            }
        
      });
///remove here

      }
      else if(this.accountType =="10"){
        this.showAdminChart = true ; 
        this.getDiveCentreInformation();
        this.getUnverifiedInstructors();
      }

      var ageGroupBody ={
        "AccessToken" : localStorage.getItem("accessToken") 
      };

      this.showLoading = true ;
      this._chartService.ageGroupChartData(ageGroupBody).subscribe( data =>{
          this.showLoading = false;
          this.drawAgeGroupChart(data, "Total Users in Age Group");
         

      },err =>{
        this.showLoading = false;
        
        if(err.error){
          this.generalAlert("Age Groups Chart Error", err.error);
        }else{
          console.log("Could not access number Age Groups Chart Data");
        }
        
      });

      

      this.showLoading = true ;
      this._chartService.numberUsersDoneCourse(ageGroupBody).subscribe( data =>{
          this.showLoading = false;
         
          this.drawCourseChart(data, "Total Users Completed Course");
         

      },err =>{
        this.showLoading = false;
        
        if(err.error){
          this.generalAlert("Total Completed Course Chart Error", err.error);
        }else{
          console.log("Could not access Total Completed Course");
        }
        
      });

      this.showLoading = true ;
      this._chartService.frequencyLoginChart(ageGroupBody).subscribe( data =>{
          this.showLoading = false;
          console.log(data);
          this.drawFrequencyLoginChart(data, "Number Users Active");
         

      },err =>{
        this.showLoading = false;
        
        if(err.error){
          this.generalAlert("Frequency of User Access to App Chart Error", err.error);
        }else{
          console.log("Could not access Frequency of User Access to App");
        }
        
      });

  

    }

    
  }

  ionViewWillEnter(){
    this.hideAllViews();
     //Setup page load variables
     this.showRegisterUserToCenter = false; 
     this.showRegisterNewCenter = false ;
     this.showLoading = false;
     this.showAddCourse = false;
     this.showAddCourseToCentre = false;
     this.showAddSiteToCentre = false;
     this.showEditBasicDiveCentre = false; 
     this.showAdminChart = true ;
     this.showSuperAdminChart = true ;
 
     this.firstPageNewCentre = false ; 
     this.secondPageNewCentre = false ; 
     this.thirdPageNewCentre = false; 
     this.fourthPageNewCentre = false; 
 
     this.showCourses = false;
     this.userCourses = new Array();
 
     this.siteUserInput = new Array();

     this.DiveSiteLst = [];
 
 
     //Setup Dive Centre Object
     this.currentDiveCenter ={
      Description: "",
      Coords: "",
      Courses: [],
      DiveSites: [],
      LogoPhoto: "",
      Name: "",
      Instructors: [],
    }

     //Setup Login Label
     this.loginLabel ="Login";
     if(!localStorage.getItem("accessToken"))
     {
       this.loginLabel = "Login";
     }else{
       this.loginLabel = "Log Out";
 
         //Setup User Role
         this._globalService.activeLabel =  "Log Out";
         this.accountType = this._globalService.accountRole;
         console.log(this.accountType);
     }

     if(this.accountType =="10"){
      this.getDiveCentreInformation();
      //this.getUnverifiedInstructors();
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

  onFileSelected(event) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      //console.log(reader.result);
      let s = reader.result ; 
      me.base64textString = reader.result.toString() ;

      if(me.showRegisterNewCenter){
        me.NewCenterObj.LogoPhoto = me.base64textString;
      }else if(me.showEditBasicDiveCentre){
        me.currentDiveCenter.LogoPhoto = me.base64textString;
      }else if(me.showAddSite){
        me.NewSiteObj.LogoPhoto = me.base64textString ;
      }
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

  //Toggle Viewable Content Functions
  viewRegisterUserToCenter(){
    this.showRegisterNewCenter = false ;
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = true;
    this.showAddCourse = false;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = false;
    this.showAddSite = false;
    this.showAdminChart = false ;
    this.showSuperAdminChart = false;

    this.showCourses = false;
    this.showSites = false;
    this.courseInputField = "";
    this.siteInput = "" ;

    this.firstPageNewCentre = false ;
    this.secondPageNewCentre = false;
    this.thirdPageNewCentre = false;

  }

  viewRegisterNewCenter(){
    this.showRegisterNewCenter = true ;
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = false;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = false;
    this.showAddSite = false;
    this.showAdminChart = false ;
    this.showSuperAdminChart = false;

    this.firstPageNewCentre = true ;
    this.secondPageNewCentre = false;
    this.thirdPageNewCentre = false;


    this.showCourses = false;
    this.showSites = false;
    this.courseInputField = "";
    this.siteInput = "" ;
  }

  viewUnverifiedInstructors(){
    this.showRegisterNewCenter = false ;
    this.showUnverifiedInstructors = true ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = false;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = false;
    this.showAddSite = false;
    this.showAdminChart = false ;
    this.showSuperAdminChart = false;

    this.showCourses = false;
    this.showSites = false;
    this.courseInputField = "";
    this.siteInput = "" ;

    this.firstPageNewCentre = false ;
    this.secondPageNewCentre = false;
    this.thirdPageNewCentre = false;
  }

  viewVerifiedInstructors(){
    this.showRegisterNewCenter = false ;
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = true;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = false;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = false;
    this.showAddSite = false;
    this.showAdminChart = false ;
    this.showSuperAdminChart = false;

    this.showCourses = false;
    this.showSites = false;
    this.courseInputField = "";
    this.siteInput = "" ;

    this.firstPageNewCentre = false ;
    this.secondPageNewCentre = false;
    this.thirdPageNewCentre = false;
  }

  viewAddBasicCentre(){
    this.showRegisterNewCenter = false ;
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = false;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = true; 
    this.showAddSite = false;
    this.showAdminChart = false ;
    this.showSuperAdminChart = false;

    this.showCourses = false;
    this.showSites = false;
    this.courseInputField = "";
    this.siteInput = "" ;

    this.firstPageNewCentre = false ;
    this.secondPageNewCentre = false;
    this.thirdPageNewCentre = false;
  }

  viewAddCourseToCentre(){
    this.showRegisterNewCenter = false ;
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = false;
    this.showAddCourseToCentre = true;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = false; 
    this.showAddSite = false;
    this.showAdminChart = false ;
    this.showSuperAdminChart = false;

    this.showCourses = true;
    this.showSites = false;
    this.courseInputField = "";
    this.siteInput = "" ;

    this.firstPageNewCentre = false ;
    this.secondPageNewCentre = false;
    this.thirdPageNewCentre = false;
  }

  viewAddCourse(){
    this.showRegisterNewCenter = false ;
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = true;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = false;
    this.showAddSite = false;
    this.showAdminChart = false ;
    this.showSuperAdminChart = false;

    this.showCourses = false;
    this.showSites = false;
    this.courseInputField = "";
    this.siteInput = "" ;

    this.firstPageNewCentre = false ;
    this.secondPageNewCentre = false;
    this.thirdPageNewCentre = false;
  }

  viewAddSiteToCentre(){
    this.showRegisterNewCenter = false ;
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = false;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = true;
    this.showEditBasicDiveCentre = false;
    this.showAddSite = false;
    this.showAdminChart = false ;
    this.showSuperAdminChart = false;

    this.showCourses = false;
    this.showSites = true;
    this.courseInputField = "";
    this.siteInput = "" ;

    this.firstPageNewCentre = false ;
    this.secondPageNewCentre = false;
    this.thirdPageNewCentre = false;
  }

  viewAddSite(){
    this.showRegisterNewCenter = false ;
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = false;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = false;
    this.showAddSite = true;
    this.showAdminChart = false ;
    this.showSuperAdminChart = false;

    this.showCourses = false;
    this.showSites = true;
    this.courseInputField = "";
    this.siteInput = "" ;

    this.firstPageNewCentre = false ;
    this.secondPageNewCentre = false;
    this.thirdPageNewCentre = false;
  }

  viewAdminCharts(){
    this.showRegisterNewCenter = false ;
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = false;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = false;
    this.showAddSite = false;
    this.showAdminChart = true ;
    this.showSuperAdminChart = false;

    this.showCourses = false;
    this.showSites = true;
    this.courseInputField = "";
    this.siteInput = "" ;

    this.firstPageNewCentre = false ;
    this.secondPageNewCentre = false;
    this.thirdPageNewCentre = false;


    this.searchAllDiveSitesCharts(this.currentDate.getFullYear().toString());
    this.updateAgeGroupChart();
   // this.updateFrequencyLoginChart();
    this.updateCourseChart() ;

     
  }

  viewSuperAdminCharts(){
    this.showRegisterNewCenter = false ;
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = false;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = false;
    this.showAddSite = false;
    this.showAdminChart = false ;
    this.showSuperAdminChart = true;

    this.showCourses = false;
    this.showSites = true;
    this.courseInputField = "";
    this.siteInput = "" ;

    this.firstPageNewCentre = false ;
    this.secondPageNewCentre = false;
    this.thirdPageNewCentre = false;

    this.searchAllDiveSitesCharts(this.currentDate.getFullYear().toString());
    this.updateAgeGroupChart();
    this.updateFrequencyLoginChart();
    this.updateRolesChart();
    this.updateCourseChart() ;
  }

  hideAllViews(){
    this.showRegisterNewCenter = false ;
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = false;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = false;
    this.showAddSite = false;
    this.showAdminChart = false ;
    this.showSuperAdminChart = false;

    this.showCourses = false;
    this.showSites = false;
    this.courseInputField = "";
    this.siteInput = "" ;

    this.firstPageNewCentre = false ;
    this.secondPageNewCentre = false;
    this.thirdPageNewCentre = false;
  }

  //Page Navigation Fuctions
  next(){

    if(this.firstPageNewCentre == true){
      this.firstPageNewCentre = false ; 
      this.secondPageNewCentre = true ;
      this.thirdPageNewCentre = false; 
      this.fourthPageNewCentre = false;
    }else if(this.secondPageNewCentre == true ){
      this.firstPageNewCentre = false ; 
      this.secondPageNewCentre = false ;
      this.thirdPageNewCentre = true ; 
      this.fourthPageNewCentre = false;
    }

  }

  previous(){

    if(this.secondPageNewCentre == true){
      this.firstPageNewCentre = true ; 
      this.secondPageNewCentre = false ;
      this.thirdPageNewCentre = false; 
      this.fourthPageNewCentre = false;
    }else if( this.thirdPageNewCentre == true ) {
      this.firstPageNewCentre = false ; 
      this.secondPageNewCentre = true ;
      this.thirdPageNewCentre = false; 
      this.fourthPageNewCentre = false;
    }

  }


  //Lookahead Functions
  buddyListFinder( entry : string ){

    if(entry.length >= 2)
   {
       this.showLoading = true;
       this._accountService.lookAheadBuddy(entry).subscribe(
         data => {
             this.BuddyLst = data.ReturnedList ; 
             this.showLoading = false;
         }, err =>{
           this.showLoading = false;
         }
       ); //end Buddy req
   }

 }

 CenterListFinder(eventValue: string){

  if(eventValue.length >= 2)
 {
     this.showLoading = true;
     this._diveService.getDiveCenters(eventValue).subscribe(
       data => {
           this.CenterLst = data.ReturnedList ; 
           this.showLoading = false;
       }
     ); //end Buddy req
 }
 
 }

 CourseListFinder(){

  if(this.courseInputField.length >= 2)
 {
     this.showLoading = true;
     this._diveService.getDiveCourses(this.courseInputField).subscribe(
       data => {
         console.log("Course search for: " + this.courseInputField);
           console.log(data);
           this.CourseLst = data.ReturnedList ; 
           this.showLoading = false;
       }
     ); //end Buddy req
 }
 
 }

 addCourse(){
  if(this.courseInputField.length >= 2)
  {
   const index: number = this.userCourses.indexOf(this.courseInputField);
   if (index == -1) {
     this.userCourses.push(this.courseInputField);
     this.showCourses = true;
   }
    this.courseInputField = "";
    this.CourseLst = [];
  }
 
  console.log("Course Added: ");
  console.log(this.userCourses);
  
 }

 removeCourse(s : string){
  const index: number = this.userCourses.indexOf(s);
  if (index !== -1) {
    this.userCourses.splice(index, 1);

  }  

  this.CourseLst = [] ;
}

addCourseToDiveCentre(){
  
  if(this.courseInputField.length >= 2)
  {
    let index: number;
    if(typeof this.currentDiveCenter.Courses == "undefined"){
      index = -1;
      this.currentDiveCenter.Courses =[];
    }
    else{
      index = this.currentDiveCenter.Courses.indexOf(this.courseInputField);
    }
   
   if (index == -1) {
    this.currentDiveCenter.Courses.push(this.courseInputField);
     this.showCourses = true;
   }
    this.courseInputField = "";
    this.CourseLst = [];
  }
 
  console.log("Course Added: ");
  console.log( this.currentDiveCenter.Courses);

}

removeCourseFromDiveCentre(s : string){
  const index: number =this.currentDiveCenter.Courses.indexOf(s);
  if (index !== -1) {
    this.currentDiveCenter.Courses.splice(index, 1);
  }  

  this.CourseLst = [] ;
}

addCourseToCourse(){
  
  if(this.courseInputField.length >= 2)
  {
   const index: number = this.NewCourseObj.RequiredCourses.indexOf(this.courseInputField);
   if (index == -1) {
     this.NewCourseObj.RequiredCourses.push(this.courseInputField);
     this.showCourses = true;
   }
    this.courseInputField = "";
    this.CourseLst = [];
  }
 
  console.log("Course Added: ");
  console.log( this.currentDiveCenter.Courses);

}

removeCourseFromCourse(s : string){
  const index: number = this.NewCourseObj.RequiredCourses.indexOf(s);
  if (index !== -1) {
    this.NewCourseObj.RequiredCourses.splice(index, 1);
  }  

  this.CourseLst = [] ;
}

addSiteToDiveCentre(){
  if(this.siteInput.length >= 2)
  {
    let index :number;
    if(typeof this.currentDiveCenter.DiveSites == "undefined"){
      index = -1;
      this.currentDiveCenter.DiveSites =[];
    }
    else{
      index = this.currentDiveCenter.DiveSites.indexOf(this.siteInput);
    }
   
   if (index == -1) {
    this.currentDiveCenter.DiveSites.push(this.siteInput);
     this.showSites = true;
   }
    this.siteInput = "";
    this.DiveSiteLst = [];
  }
 
  console.log("Course Added: ");
  console.log( this.currentDiveCenter.DiveSites);

}

removeSiteFromDiveCentre(s : string){
  const index: number =this.currentDiveCenter.DiveSites.indexOf(s);
  if (index !== -1) {
    this.currentDiveCenter.DiveSites.splice(index, 1);
  }  

  this.DiveSiteLst = [] ;
}

DiveSiteListFinder(){

  this.showLoading = true; 

  this._diveService.getDiveSites(this.siteInput).subscribe(res =>{
    this.DiveSiteLst = res.ReturnedList ;
    this.showLoading = false;  

  }, err =>{
    this.showLoading = false; 
  });


}

addSite(){
  if(this.siteInput.length >= 2)
  {
   const index: number = this.siteUserInput.indexOf(this.siteInput);
   if (index == -1) {
     this.siteUserInput.push(this.siteInput);
   }
    this.siteInput = "";
    this.showSites = true ; 
  }
  this.DiveSiteLst = [] ;
  
 }

 removeSite(s : string){
  const index: number = this.siteUserInput.indexOf(s);
  if (index !== -1) {
    this.siteUserInput.splice(index, 1);
    
    if(this.siteUserInput.length == 0){
      this.showSites = false;
    }

  }  

  this.DiveSiteLst = [] ;
}

getUnverifiedInstructors(){

  this.showLoading = true ;
  this.allInstructors = [] ;
  this.unverifiedInstructors = [];
  this.verifiedInstructors = [];

  this._accountService.getUnverifiedInstructors().subscribe(res=>{

    this.allInstructors = res.UnverifiedInstructors ; 
    console.log("Instructors \n ===============");
    console.log( res.UnverifiedInstructors );

    for(var x = 0 ; x < this.allInstructors.length ; x++){

      if(this.allInstructors[x].AccountVerified == false){
        if(this.unverifiedInstructors.indexOf(this.allInstructors[x]) == -1){
          this.unverifiedInstructors.push(this.allInstructors[x]);
        }
        
      }else{
        if(this.verifiedInstructors.indexOf(this.allInstructors[x]) == -1){
        this.verifiedInstructors.push(this.allInstructors[x]);
        }
      }

    }

    console.log("Unverified");
    console.log(this.unverifiedInstructors);

    this.showLoading = false ;
  }, err =>{
    this.showLoading = false ;
  });


}

getDiveCentreInformation(){
  this.showLoading = true ;
  
  var bod ={
    "AccessToken" : localStorage.getItem("accessToken")
  }

  this._diveService.getAdminDiveCenter(bod).subscribe( data=>{
    
    this.currentDiveCenter = data.Item;
    this.showLoading = false ;
    this.DiveSiteLst = this.currentDiveCenter.DiveSites  ; 
    //console.log(this.currentDiveCenter);

    ////Dive Site Charts

    if(this.DiveSiteLst != undefined && this.DiveSiteLst.length != 0)
    {
      this.showAdminDiveSiteGraph = true ; 

      var numDivesBody ={
        "AccessToken" : localStorage.getItem("accessToken") ,
        "DiveSite" : this.DiveSiteLst[0] ,
        "YearOfSearch" : this.currentDate.getFullYear().toString()
      }
  
      this.dateSearch =  this.currentDate.getFullYear().toString() ;
  
  
      this.showLoading = true ;
        this._chartService.numberDivesAtSiteChartData(numDivesBody).subscribe( data =>{
            this.showLoading = false;
            this.totalNumberOfDivesYear = data.TotalNumberOfDives.toString();
  
            this.drawNumDivesAtSiteChart(data, this.DiveSiteLst[0]  );
  
        },err =>{
          this.showLoading = false;
          
          if(err.error){
            this.generalAlert("Number Of Dives Chart Error", err.error);
          }else{
            console.log("Could not access number Dives At " + this.DiveSiteLst[0]  +" Chart Data");
          }
          
        });
  
  
  
        var rateDivesBody ={
          "AccessToken" : localStorage.getItem("accessToken") ,
          "DiveSite" : this.DiveSiteLst[0] 
        };
  
        this._chartService.ratingAtDiveSiteChartData(rateDivesBody).subscribe( data =>{
            this.showLoading = false;
             this.drawRatingDivesAtSiteChart(data, "Rating of " + this.DiveSiteLst[0]  );
          
      
        },err =>{
          this.showLoading = false;
          
          if(err.error){
            this.generalAlert("Rating Of Dives Chart Error", err.error);
          }else{
            console.log("Could not access rating of  Dives At Site Chart Data");
          }
          
        });
  
        var peekDivesBody ={
          "AccessToken" : localStorage.getItem("accessToken") ,
          "DiveSite" : this.DiveSiteLst[0]  ,
          "YearOfSearch" : this.currentDate.getFullYear().toString()
        };
  
        this._chartService.peakTimesDivesAtSiteChartData(peekDivesBody).subscribe( data =>{
            this.showLoading = false;
            this.drawPeekDivesAtSiteChart(data, this.DiveSiteLst[0]   );
        },err =>{
          this.showLoading = false;
          
          if(err.error){
            this.generalAlert("Number Of Dives Chart Error", err.error);
          }else{
            console.log("Could not access number Dives At Site Chart Data");
          }
          
        });
  
    }

   

    ////




  }, err =>{

    if(err.error){
      this.generalAlert("Failed to Retrieve Dive Centre Info",err.err );
    }else{
      this.generalAlert("Failed to Retrieve Dive Centre Info", "Please try again" );
    }


  });


}

 //Submit functions
 UserToCenterSubmit(){

    if(this.UserToCenterObj.Name != "" && this.UserToCenterObj.Email != ""){
      var index1 = this.UserToCenterObj.Email.indexOf("(")+1 ;
      if(index1 != -1)
      {
        var index2 = this.UserToCenterObj.Email.length;
        this.UserToCenterObj.Email = this.UserToCenterObj.Email.substr( index1,index2 ) ;
  
        var index3 = this.UserToCenterObj.Email.length ; 
        this.UserToCenterObj.Email = this.UserToCenterObj.Email.substr( 0,index3 ) ;
      }
      this.UserToCenterObj.Email.trim();
      this.showLoading = true ;
      this._accountService.addUsertoDiveCenter(this.UserToCenterObj).subscribe(res=>{
          this.showLoading = false;
          this.UserToCenterObj.Email = "";
          this.UserToCenterObj.Name = "" ;
          this.showRegisterUserToCenter = false ;
          
          this.presentUserToCenterSuccessAlert();
          this.hideAllViews();
      }, err=>{
        this.showLoading = false;
        this.presentUserToCenterFailAlert();
      });
    }

 }

 newDiveCenterSubmit(){
    this.NewCenterObj.Courses = this.userCourses ;
    this.NewCenterObj.DiveSites = this.siteUserInput ;

    var index1 = this.NewCenterObj.Email.indexOf("(")+1 ;
    if(index1 != -1)
    {
      var index2 = this.NewCenterObj.Email.length;
      this.NewCenterObj.Email = this.NewCenterObj.Email.substr( index1,index2 ) ;

      var index3 = this.NewCenterObj.Email.indexOf(")") ; 
      this.NewCenterObj.Email = this.NewCenterObj.Email.substr( 0,index3 ) ;
    }

    console.log(this.NewCenterObj);

    this.showLoading = true ;
    this._accountService.addDiveCenter(this.NewCenterObj).subscribe(res=>{
      this.showLoading = false ;
      this.generalAlert("Success" , "New Dive Centre Added");
      this.showRegisterNewCenter = false ; 

      this.NewCenterObj ={
        AccessToken: localStorage.getItem("accessToken"),
        Email : "" , 
        LogoPhoto: "" , 
        Coords : "" , 
        Description : "" , 
        Name : "" , 
        Courses :[] ,  
        DiveSites: [] ,
      }

      this.siteUserInput=[];
      this.userCourses=[];
      this.showCourses = false;
      this.showSites=false;

      this.hideAllViews();
    }, err=>{
      this.showLoading = false ;
      this.generalAlert("Unsuccessful Upload" , "New Dive Centre Not Added");
    });

    

 }

 verifyInstructor(iGUID : string){

  var body={
    "AccountVerified" : true ,
    "AccessToken": localStorage.getItem("accessToken"),
    "AccountGuid": iGUID
  }

  this.showLoading = true ;
  this._accountService.verifyInstructor(body).subscribe(res=>{

    this.showLoading = false ;
    this.getUnverifiedInstructors();

  }, err=>{

    this.showLoading = false ;
    this.generalAlert("Unable to Verify", "Could not verify Instructor. Try Again");

  });


 }

 removeInstructor(iGUID : string){

  var body={
    "AccountVerified" : false ,
    "AccessToken": localStorage.getItem("accessToken"),
    "AccountGuid": iGUID
  }

  console.log(body);

  this.showLoading = true ;
  this._accountService.verifyInstructor(body).subscribe(res=>{

    this.showLoading = false ;
    this.getUnverifiedInstructors();

  }, err=>{

    this.showLoading = false ;
    this.generalAlert("Unable to Remove", "Could not remove Instructor. Try Again");

  });

 }

 updateDiveCentreSubmit(){

  var body ={
    "AccessToken" : localStorage.getItem("accessToken") ,
    "Name" : this.currentDiveCenter.Name ,
    "Coords": this.currentDiveCenter.Coords , 
    "Description": this.currentDiveCenter.Description,
    "LogoPhoto" :  this.currentDiveCenter.LogoPhoto
  }

  console.log("Send Update \n ===============");
  console.log(body);

  this.showLoading = true ;
  this._diveService.editBasicDiveCentre(body).subscribe(res => {
    this.showLoading = false ;
    this.generalAlert("Success", "Dive Centre Updated. Updates may take a moment to appear.");

    this.hideAllViews();

  }, err=>{
    this.showLoading = false ;
    if(err.error){
      this.generalAlert("Failed to update", err.error);
    }else{
      this.generalAlert("Failed", "Dive Centre Not Updated");
    }
    
  });

 }

 updateCoursesOfDiveCentreSubmit(){

  var body ={
    "AccessToken" : localStorage.getItem("accessToken") ,
    "Name" : this.currentDiveCenter.Name ,
    "Courses": this.currentDiveCenter.Courses 
  }


  console.log("Send Update Course \n ===============");
  console.log(body);

  this.showLoading = true ;
  this._diveService.addCoursesToDiveCentre(body).subscribe(res => {
    this.showLoading = false ;
    this.generalAlert("Success", "Dive Centre Courses Updated");

    this.hideAllViews();

  }, err=>{
    this.showLoading = false ;
    if(err.error){
      this.generalAlert("Failed to update", err.error);
    }else{
      this.generalAlert("Failed", "Dive Centre Courses Not Updated");
    }
    
  });

  

 }

 updateSitesOfDiveCentreSubmit(){

  var body ={
    "AccessToken" : localStorage.getItem("accessToken") ,
    "Name" : this.currentDiveCenter.Name ,
    "DiveSites": this.currentDiveCenter.DiveSites 
  }


  console.log("Send Update Sites \n ===============");
  console.log(body);

  this.showLoading = true ;
  this._diveService.addDiveSitesToCentre(body).subscribe(res => {
    this.showLoading = false ;
    this.generalAlert("Success", "Dive Centre Sites Updated");

    this.hideAllViews();



  }, err=>{
    this.showLoading = false ;
    if(err.error){
      this.generalAlert("Failed to update", err.error);
    }else{
      this.generalAlert("Failed", "Dive Centre Sites Not Updated");
    }
    
  });


 }

 createNewCourseSubmit(){

  console.log(this.NewCourseObj);

  if(this.NewCourseObj.Name == ""){
    this.NewCourseObj.Name = "TBD" ;
  }

  if(this.NewCourseObj.CourseType == ""){
    this.NewCourseObj.CourseType = "Specialisation"; 
  }

  if(this.NewCourseObj.SurveyAnswer == ""){
    this.NewCourseObj.SurveyAnswer = "F";
  }

  if(this.NewCourseObj.QualificationType == ""){
    this.NewCourseObj.QualificationType ="Diver";
  }

  var body = {
    "AccessToken" : localStorage.getItem("accessToken") ,
    "Name": this.NewCourseObj.Name , 
    "CourseType": this.NewCourseObj.CourseType ,
    "MinAgeRequired": this.NewCourseObj.MinAgeRequired ,
    "SurveyAnswer": this.NewCourseObj.SurveyAnswer ,
    "RequiredCourses": this.NewCourseObj.RequiredCourses ,
    "QualificationType": this.NewCourseObj.QualificationType
  }

  console.log(body);


 this.showLoading = true ;
  this._diveService.createNewCourse(body).subscribe(res=>{
    this.showLoading = false ;
    this.generalAlert("Success", "Course Created");

    this.hideAllViews();

    this.NewCourseObj={
      Name: "",
      CourseType: "",
      MinAgeRequired: 10,
      SurveyAnswer: "", 
      RequiredCourses: [],
      QualificationType: ""
    }

  }, err=>{

    this.showLoading = false ;
    if(err.error){
      this.generalAlert("Failed to create", err.error);
    }else{
      this.generalAlert("Failed", "Course not created");
    }

  });



 }

 createNewSiteSubmit(){
   
    var body = {
      "AccessToken" : localStorage.getItem("accessToken") ,
      "Name" : this.NewSiteObj.Name ,
      "Coords" : this.NewSiteObj.Coords,
      "Description" : this.NewSiteObj.Description,
      "TypeOfDives" : this.NewSiteObj.TypeOfDives
    }

    console.log(body); 

    this.showLoading = true ;
    this._diveService.createNewSite(body).subscribe(res=>{
      this.showLoading = false ;
      this.generalAlert("Success", "Dive Site Created");
  
      this.hideAllViews();

      this.NewSiteObj ={
        Name: "",
        Coords: "",
        LogoPhoto: "",
        Description: "",
        TypeOfDives : "" 
      }
  
    }, err=>{
  
      this.showLoading = false ;
      if(err.error){
        this.generalAlert("Failed to Create", err.error);
      }else{
        this.generalAlert("Failed", "Dive Sites Not Created");
      }
  
    });



 }


 //alerts
 async presentUserToCenterSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'User Registered to Center',
      message: 'User has now been given Admin privileges',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentUserToCenterFailAlert() {
    const alert = await this.alertController.create({
      header: 'User Registered Not to Center',
      message: 'Registration failed. Please try again',
      buttons: ['OK']
    });

    await alert.present();
  }

  async generalAlert(heading: string, msg : string ){
    const alert = await this.alertController.create({
      header: heading,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }



  ///Functions for drawing charts
  searchAllDiveSitesCharts( YS ){
    this.DoSiteYearChartSearch(YS) ;
    this.DoSiteRatingChartSearch() ;
    this.DoPeekSiteYearChartSearch(YS);
  }

  random_rgba(){
    var o = Math.round, r= Math.random, s=255 ;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ', 0.7)' ;
  }

  updateNumDivesAtSiteChart(returnedData, msg){


    this.lineChartDivesAtSite.destroy();
    this.drawNumDivesAtSiteChart(returnedData, msg);


  }

  drawNumDivesAtSiteChart(returnedData, msg){


    let keys = returnedData["ReturnedList"].map(d => d.Month);
    let values = returnedData["ReturnedList"].map(d => d.AmountOfDives);


    this.lineChartDivesAtSite = new Chart(this.lineCanvasDivesAtSite.nativeElement,{
  type: "line",
  data: {
    labels: keys,
    datasets: [
      {
        label: msg,
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(244, 162, 97,0.4)",
        borderColor: "rgba(244, 162, 97,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(244, 162, 97,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(231, 111, 81,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: values,
        spanGaps: false
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [ {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Month'
        },
        ticks: {
          major: {
            fontStyle: 'bold',
            fontColor: '#FF0000'
          }
        }
      } ],
      yAxes: [ {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Total Dives'
        }
      } ]
    }
  }
});
  }

  updateRatingDivesAtSiteChart(returnedData, msg){


    this.pieChartDivesAtSiteRating.destroy();
    this.drawRatingDivesAtSiteChart(returnedData, msg);


  }

  drawRatingDivesAtSiteChart(returnedData, msg){


    let keys = returnedData["Ratings"][0].map(d => d.Rating);
    let values = returnedData["Ratings"][0].map(d => d.Amount);


    this.pieChartDivesAtSiteRating = new Chart(this.pieCanvasDivesAtSiteRating.nativeElement,{
      type: 'doughnut',
      data: {
        labels: keys,
        datasets: [{
          label: "Rating of Dive Site",
          backgroundColor: ["#c45850","#ed576b","#F4A261","#2A9D8F","#2dd36f"],
          data: values
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: msg
        }
      }
      });
  }


  drawPeekDivesAtSiteChart(returnedData, msg){


    let keys = returnedData["ReturnedList"].map(d => d.Hour);
    let values = returnedData["ReturnedList"].map(d => d.AmountOfDives);

    
    this.lineChartPeekDivesAtSite = new Chart(this.lineCanvasChartPeekDivesAtSite.nativeElement,{
      type: "line",
      data: {
        labels: keys,
        datasets: [
          {
            label: msg,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(244, 162, 97,0.4)",
            borderColor: "rgba(244, 162, 97,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(244, 162, 97,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(231, 111, 81,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: values,
            spanGaps: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [ {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Time'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000'
              }
            }
          } ],
          yAxes: [ {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Total Dives'
            }
          } ]
        }
      }
    });


  }

  updatePeekDivesAtSiteChart(returnedData, msg){


    this.lineChartPeekDivesAtSite.destroy();
    this.drawPeekDivesAtSiteChart(returnedData, msg);


  }

  drawAgeGroupChart(returnedData, msg){


    let keys = returnedData["ReturnedList"].map(d => d.AgeGroup);
    let values = returnedData["ReturnedList"].map(d => d.AmountOfUsers);

    
    this.lineChartAgeGroup = new Chart(this.lineCanvasChartAgeGroup.nativeElement,{
      type: "bar",
      data: {
        labels: keys,
        datasets: [
          {
            label: msg,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(42, 157, 143)",
            borderColor: "rgba(42, 157, 143)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(244, 162, 97,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(32, 117, 107)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: values,
            spanGaps: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [ {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Age Groups'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000'
              }
            }
          } ],
          yAxes: [ {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Total Users'
            }
          } ]
        }
      }
    });


  }

  updateAgeGroupChart(){

    this.lineChartAgeGroup.destroy();

    var ageGroupBody ={
      "AccessToken" : localStorage.getItem("accessToken") 
    };

    this.showLoading = true ;
    this._chartService.ageGroupChartData(ageGroupBody).subscribe( data =>{
        this.showLoading = false;
        this.drawAgeGroupChart(data, "Total Users in Age Group");


       

    },err =>{
      this.showLoading = false;
      
      if(err.error){
        this.generalAlert("Age Groups Chart Error", err.error);
      }else{
        console.log("Could not access number Age Groups Chart Data");
      }
      
    });
    
 
    
    


  }


  updateRolesChart(){

    this.barChartChartRoles.destroy();
    var ageGroupBody1 ={
      "AccessToken" : localStorage.getItem("accessToken") 
    };

    this.showLoading = true ;
    this._chartService.numberUsersInRoles(ageGroupBody1).subscribe( data =>{
        this.showLoading = false;

      
        this.drawRolesChart(data, "Total Users in Role Groups");
      

    },err =>{
      this.showLoading = false;
      
      if(err.error){
        this.generalAlert("User Role Chart Error", err.error);
      }else{
        console.log("Could not access user role Chart Data");
      }
  
});
  }

  updateFrequencyLoginChart(){

   this.lineChartFrequencyLogin.destroy() ; 

    var ageGroupBody ={
      "AccessToken" : localStorage.getItem("accessToken") 
    };


    this.showLoading = true ;
      this._chartService.frequencyLoginChart(ageGroupBody).subscribe( data =>{
          this.showLoading = false;
          console.log(data);
          this.drawFrequencyLoginChart(data, "Number Users Active");
         

      },err =>{
        this.showLoading = false;
        
        if(err.error){
          this.generalAlert("Frequency of User Access to App Chart Error", err.error);
        }else{
          console.log("Could not access Frequency of User Access to App");
        }
        
      });

  }

  updateCourseChart(){
    this.lineChartCourses.destroy() ; 

    var ageGroupBody ={
      "AccessToken" : localStorage.getItem("accessToken") 
    };


    this.showLoading = true ;
    this._chartService.numberUsersDoneCourse(ageGroupBody).subscribe( data =>{
        this.showLoading = false;
       
        this.drawCourseChart(data, "Total Users Completed Course");
       

    },err =>{
      this.showLoading = false;
      
      if(err.error){
        this.generalAlert("Total Completed Course Chart Error", err.error);
      }else{
        console.log("Could not access Total Completed Course");
      }
      
    });
  }

  drawRolesChart(returnedData, msg){


    let keys = returnedData["ReturnedList"].map(d => d.Role);
    let values = returnedData["ReturnedList"].map(d => d.AmountOfUsers);

    
    this.barChartChartRoles = new Chart(this.barCanvasChartRoles.nativeElement,{
      type: "bar",
      data: {
        labels: keys,
        datasets: [
          {
            label: msg,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(42, 157, 143)",
            borderColor: "rgba(42, 157, 143)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(244, 162, 97,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(32, 117, 107)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: values,
            spanGaps: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [ {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'User Roles'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000'
              }
            }
          } ],
          yAxes: [ {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Total Users'
            }
          } ]
        }
      }
    });


  }

  drawFrequencyLoginChart(returnedData, msg){


    let keys = returnedData["DaysPassed"][0].map(d => d.Day);
    let values = returnedData["DaysPassed"][0].map(d => d.Amount);

    
    this.lineChartFrequencyLogin = new Chart(this.lineCanvasChartFrequencyLogin.nativeElement,{
      type: "line",
      data: {
        labels: keys,
        datasets: [
          {
            label: msg,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(244, 162, 97,1)",
            borderColor: "rgba(244, 162, 97,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(244, 162, 97,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(231, 111, 81,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: values,
            spanGaps: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [ {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Frequency of Access'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000'
              }
            }
          } ],
          yAxes: [ {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Total Users'
            }
          } ]
        }
      }
    });


  }

  drawCourseChart(returnedData, msg){


    let keys = returnedData["CompletedCourseDivers"].map(d => d.Course);
    let values = returnedData["CompletedCourseDivers"].map(d => d.Total);

    
    this.lineChartCourses = new Chart(this.lineCanvasChartCourses.nativeElement,{
      type: "bar",
      data: {
        labels: keys,
        datasets: [
          {
            label: msg,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(42, 157, 143)",
            borderColor: "rgba(42, 157, 143)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(244, 162, 97,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(32, 117, 107)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: values,
            spanGaps: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [ {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Courses'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000'
              }
            }
          } ],
          yAxes: [ {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Total Divers Completed'
            }
          } ]
        }
      }
    });


  }

  //Functions for Chart Searches

  DoSiteYearChartSearch(yearSearch){

    if(this.siteInput == "")
    {
      this.siteInput = "*";
    }

    if(yearSearch == 0){
      yearSearch = this.currentDate.getFullYear();
    }

    this.dateSearch = yearSearch.toString();

    if(this.dateSearch.length < 4 ){
      for(let x = this.dateSearch.length ; x < 4; x++){
        this.dateSearch += "0";
      }
    }else if(this.dateSearch.length > 4 ){
      this.dateSearch = this.dateSearch.substring(0,4);
    }

    var numDivesBody ={
      "AccessToken" : localStorage.getItem("accessToken") ,
      "DiveSite" : this.siteInput,
      "YearOfSearch" :this.dateSearch
    };


    console.log(numDivesBody);

    this.showLoading = true ;
          this._chartService.numberDivesAtSiteChartData(numDivesBody).subscribe( data =>{
              this.showLoading = false;
              this.totalNumberOfDivesYear = data.TotalNumberOfDives.toString();
              console.log(data);

              if(this.siteInput=="*")
              { 
                this.updateNumDivesAtSiteChart(data, "All Dive Sites");
              }else{
                this.updateNumDivesAtSiteChart(data, this.siteInput);
              }
              

          },err =>{
            this.showLoading = false;
            
            if(err.error){
              this.generalAlert("Number Of Dives Chart Error", err.error);
            }else{
              console.log("Could not access number Dives At Site Chart Data");
            }
            
          });


  }

  DoPeekSiteYearChartSearch(yearSearch){

    if(this.siteInput == "")
    {
      this.siteInput = "*";
    }

    if(yearSearch == 0){
      yearSearch = this.currentDate.getFullYear();
    }

    this.dateSearch = yearSearch.toString();

    if(this.dateSearch.length < 4 ){
      for(let x = this.dateSearch.length ; x < 4; x++){
        this.dateSearch += "0";
      }
    }else if(this.dateSearch.length > 4 ){
      this.dateSearch = this.dateSearch.substring(0,4);
    }

    var numDivesBody ={
      "AccessToken" : localStorage.getItem("accessToken") ,
      "DiveSite" : this.siteInput,
      "YearOfSearch" :this.dateSearch
    };

    console.log("Peek Search");
    console.log(numDivesBody);


    this.showLoading = true ;
          this._chartService.peakTimesDivesAtSiteChartData(numDivesBody).subscribe( data =>{
              this.showLoading = false;
              console.log(data);

              if(this.siteInput=="*")
              { 
                this.updatePeekDivesAtSiteChart(data, "All Dive Sites");
              }else{
                this.updatePeekDivesAtSiteChart(data, this.siteInput);
              }
              

          },err =>{
            this.showLoading = false;
            
            if(err.error){
              this.generalAlert("Peak Time Dives Chart Error", err.error);
            }else{
              console.log("Could not access peak times Dives At Site Chart Data");
            }
            
          });


  }

  DoSiteRatingChartSearch(){
    if(this.siteInput == "")
    {
      this.siteInput = "Shark Alley";
    }

    var rateDivesBody ={
      "AccessToken" : localStorage.getItem("accessToken") ,
      "DiveSite" : this.siteInput
    };

    this.showLoading = true ;
    this._chartService.ratingAtDiveSiteChartData(rateDivesBody).subscribe( data =>{
        this.showLoading = false;
        
        console.log(data);

        if(this.siteInput=="*")
        { 
          this.updateRatingDivesAtSiteChart(data, "Overall Rating of All Sites");
        }else{
          this.updateRatingDivesAtSiteChart(data, "Rating of " +this.siteInput);
        }
          
      
  
    },err =>{
      this.showLoading = false;
      
      if(err.error){
        this.generalAlert("Rating Of Dives Chart Error", err.error);
      }else{
        console.log("Could not access rating of  Dives At Site Chart Data");
      }
      
    });




  }


}

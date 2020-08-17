import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { AlertController } from '@ionic/angular';
import { ThrowStmt } from '@angular/compiler';

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
  DiveSiteLst: [];

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
  showAddCourseToCentre : boolean ;
  showAddSiteToCentre : boolean ; 
  showLoading: boolean ; 

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

  //Forms




  /********************************************/

  constructor( public alertController : AlertController , private _diveService: diveService,private router: Router,private _accountService: accountService) {
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

    if(localStorage.getItem("accessToken")){
         //Setup User Role
         if(localStorage.getItem("accessToken").substring(36, 38) == "01"){
          this.accountType = "Instructor";
        }else if (localStorage.getItem("accessToken").substring(36, 38) == "00"){
          this.accountType = "Diver";
        }else if(localStorage.getItem("accessToken").substring(36, 38) == "10"){
          this.accountType = "Admin";
          this.getUnverifiedInstructors();
        }else if(localStorage.getItem("accessToken").substring(36, 38) == "11"){
          this.accountType = "SuperAdmin";
        }else{
          this.accountType = "*Diver";
        }
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

    //Setup Login Label
    this.loginLabel ="Login";
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

  onFileSelected(event) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      //console.log(reader.result);
      let s = reader.result ; 
      me.base64textString = reader.result.toString() ;

      console.log(me.NewCenterObj.LogoPhoto);
      me.NewCenterObj.LogoPhoto = me.base64textString;
      console.log(me.NewCenterObj.LogoPhoto);
     
      
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

  //Toggle Viewable Content Functions
  viewRegisterUserToCenter(){
    this.showRegisterUserToCenter = true; 
    this.showRegisterNewCenter = false ;
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false; 

  }

  viewRegisterNewCenter(){
    this.showRegisterUserToCenter = false; 
    this.showRegisterNewCenter = true ;
    this.firstPageNewCentre = true ; 
    
  }

  viewUnverifiedInstructors(){
    this.showUnverifiedInstructors = true ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;  
  }

  viewVerifiedInstructors(){
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = true;
    this.showRegisterUserToCenter = false;  
  }

  viewAddBasicCentre(){
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = false;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = true; 
  }

  viewAddCourseToCentre(){
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = false;
    this.showAddCourseToCentre = true;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = false; 
  }

  viewAddCourse(){
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = true;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = false;
    this.showEditBasicDiveCentre = false;
  }

  viewAddSite(){
    this.showUnverifiedInstructors = false ;
    this.showVerifiedInstructors = false;
    this.showRegisterUserToCenter = false;
    this.showAddCourse = false;
    this.showAddCourseToCentre = false;
    this.showAddSiteToCentre = true;
    this.showEditBasicDiveCentre = false;
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


    for(var x = 0 ; x < this.allInstructors.length ; x++){

      if(this.allInstructors[x].AccountVerified == false){
        this.unverifiedInstructors.push(this.allInstructors[x]);
      }else{
        this.verifiedInstructors.push(this.allInstructors[x]);
      }

    }

    this.showLoading = false ;
  }, err =>{
    this.showLoading = false ;
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
  
        var index3 = this.UserToCenterObj.Email.length -1 ; 
        this.UserToCenterObj.Email = this.UserToCenterObj.Email.substr( 0,index3 ) ;
      }
     
      this.showLoading = true ;
      this._accountService.addUsertoDiveCenter(this.UserToCenterObj).subscribe(res=>{
          this.showLoading = false;
          this.UserToCenterObj.Email = "";
          this.UserToCenterObj.Name = "" ;
          this.showRegisterUserToCenter = false ;
          
          this.presentUserToCenterSuccessAlert();
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

}

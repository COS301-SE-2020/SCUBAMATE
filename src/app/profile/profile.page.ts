import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { AlertController } from '@ionic/angular';
import {ConnectionService} from 'ng-connection-service';
import { Location } from '@angular/common';

import { GlobalService } from "../global.service";

export interface AccountDetails{
  ItemType: string ;
  AccessToken: string;
  ProfilePhoto: string;
  AccountGuid: string ;
  Expires: string ;
  PublicStatus: string ;
  Password: string ;
  DateOfBirth: string ;
  FirstName: string ;
  CompletedCourses: string[] ;
  LastName: string ;
  Email: string ;
  Specialisation: string[];
  Qualification: string;
  DiveCentre: string;
}

export interface DiveType{
  diveType : string ;
}

export interface UnverifiedCourse{
  AccountGuid: string ;
  TimeIn : string;
  TimeOut: string ;
  DiveSite : string ;
  DiveDate : string ;
  DiveID : string ;
  FirstName : string ;
  LastName: string ;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  /*********************************************
                Global Variables
  *********************************************/
  loginLabel:string ;
  AD ;//: AccountDetails ; 
  DiveTypeLst: []; 
  OptionalList : String[];
  EquipmentList : String[];
  UnverifiedLst: UnverifiedCourse[] ;
 
  viewChecklist : Boolean = false ; 
  viewProfile : Boolean;
  editProfile : Boolean; 
  showLoading: Boolean;
  showAD : Boolean = false  ;
  accountType : string;
  viewUnverified : Boolean = false; 

  showAccountVerifiedMessage : Boolean ;

  //Internet Connectivity check
  isConnected = true;  
  noInternetConnection: boolean;

  viewBadges : boolean = false; 
  goalPercentage : number  ; 

  /********************************************/
  constructor(public _globalService: GlobalService,  public alertController : AlertController , private router: Router, private _accountService: accountService,  private _diveService: diveService, private connectionService: ConnectionService, private location: Location) {
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
    
  }

  
  ngOnInit() {
    this.viewProfile = true;
    this.editProfile = false;
    this.loginLabel ="Login";
    this.showLoading = true;
    this.showAD = false; 

    if(!localStorage.getItem("accessToken"))
    {
      this.router.navigate(['login']);
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
      this.accountType = this._globalService.accountRole; 

        this._accountService.getUser().subscribe(res => {

          this.goalPercentage = res.GoalProgress / res.Goal ; 
         

          this.AD = res;
          if (res.PublicStatus == true){
            this.AD.PublicStatus = "Public";
          }else{
            this.AD.PublicStatus = "Private";
          }

          if(res.EmailVerified){
            this.showAccountVerifiedMessage = false ;
          }else{
            this.showAccountVerifiedMessage = true ;
          }

          this.showLoading = false;
          this.showAD = true;
          
          
      

          if( this.accountType == "01"){
            this.loadUnverifiedCourses();
          }
          
        }, err =>{
          if(err.error == "Invalid Access Token"){
            localStorage.removeItem("accessToken");
            this.router.navigate(['login']);
          }
        });

      }
    
  }


  ionViewWillEnter(){
    this.viewProfile = true;
    this.editProfile = false;
    this.loginLabel ="Login";
    this.showLoading = true;
    this.showAD = false; 

    if(!localStorage.getItem("accessToken"))
    {
      this.router.navigate(['login']);
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
      this.accountType = this._globalService.accountRole; 

        this._accountService.getUser().subscribe(res => {
          // console.log("res");
          // console.log(res);
          this.AD = res;
          if (res.PublicStatus == true){
            this.AD.PublicStatus = "Public";
          }else{
            this.AD.PublicStatus = "Private";
          }

          if(res.EmailVerified){
            this.showAccountVerifiedMessage = false ;
          }else{
            this.showAccountVerifiedMessage = true ;
          }

          this.showLoading = false;
          this.showAD = true;
          
          
          
        

          this.showLoading = false;
          this.showAD = true; 
          
        }) ;



      }
  }

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken");
      this.accountType = "*Diver";
      this.router.navigate(['login']);
      location.reload();
    }else{
      this.router.navigate(['login']);
    }
  }


  goToEdit(){
    //console.log("in edit func");
    this.router.navigate(["/edit-profile"]);
  }

  

  sendEmail(){
     
    this.showLoading = true;
   /** this._accountService.sendValidationEmail(this.AD.Email).subscribe( res=>
      {
        //console.log("Email Sent");
        localStorage.setItem("otp", res.OTP);
        this.showLoading = false;
        this.presentOTPPrompt();
      });

      */
     var reqBody ={
      "Email" : this.AD.Email ,
      "Type" : "Email"
    }

    this._accountService.sendRelatedEmail(reqBody).subscribe(res =>{

      this.showLoading = false;
      localStorage.setItem("otp", res.OTP);
        this.showLoading = false;
        this.presentOTPPrompt();
    }, err=>{
      this.showLoading = false;
      this.presentAlertGeneral("Could Not Send OTP Email to "+ this.AD.Email  , err.error);

    })


  }

  sendVerifiedEmail(){
     
    this.showLoading = true;
     this._accountService.confirmEmailValidation(this.AD.Email).subscribe( res=>
      {
        //console.log("Validated Email Sent");
        this.showLoading = false;
        location.reload();
      }, err=>{
        this.showLoading = false;
        this.presentAlertGeneral("Could Validate Email For "+ this.AD.Email  , err.error);
      
      });

    

   


  }

  async presentAlertOtpOk( ) {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: 'Validation Complete',
      subHeader: 'Account Email Verified: ',
      message:  this.AD.Email,
      buttons: ['Done']
    });
  
    await alert.present();
    this.sendVerifiedEmail();
  }

  async presentAlertOtpWrong( ) {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: 'Validation Failed',
      subHeader: 'Account Email Not Validated',
      message: 'Invalid OTP provided' ,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        }, {
          text: 'Retry',
          handler: () => {
            //console.log("Retry OTP" );
            this.sendEmail();
            

          }
        }
      ]
    });
  
    await alert.present();
  }



  async presentOTPPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Email Verification',
      subHeader: 'A new OTP has been sent to: ',
      message:  this.AD.Email,
      inputs: [
        {
          name: 'otpEntered',
          type: 'text',
          placeholder: 'OTP Here'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
           // console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: data => {
           // console.log(data);
           // console.log("OTP Entered:" + data['otpEntered']);

            if(localStorage.getItem("otp")!= data['otpEntered']){
              this.presentAlertOtpWrong();
            }else{
              this.presentAlertOtpOk();
            }

          }
        }
      ]
    });

    await alert.present();
  }

  setEmail(){
    this.AD.Email = "teamav301@gmail.com";
  }
  
  loadUnverifiedCourses(){
    this.showLoading = true ;

    this._diveService.getUnverifiedCourses().subscribe( res =>{

      this.UnverifiedLst = res.UnverifiedCourses;
      this.viewUnverified = true ; 
      this.showLoading = false ;

    }, err=>{
      this.viewUnverified = false ; 
      this.showLoading = false ;

    });

  }

  confirmUnverifiedCourse( diveID : string, accGUID : string ){

    var confirm ={
      "AccessToken" : localStorage.getItem("accessToken") ,
      "DiveID" : diveID,
      "AccountGuid" : accGUID,
      "Approved" : true 
    };

    this.showLoading = true;
    this._diveService.VerifyCourse(confirm).subscribe(res =>{
      this.showLoading = false ;

     for(var x = 0; x < this.UnverifiedLst.length ; x++){
       if(this.UnverifiedLst[x].DiveID == diveID){
          this.UnverifiedLst.splice(x, 1);
          break;
       }
     }


    }, err=>{

      this.showLoading = false ;
      alert("Unable to verify dive");

    });

  }

  toggleUnverified(){
    this.viewUnverified = !this.viewUnverified ;
  }

  toggleBadgeView(){
    this.viewBadges = !this.viewBadges;
  }


  async presentAlertRemoveAccount( ) {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: 'Delete Account',
      subHeader: 'Account Removal',
      message: 'Confirm deleting of account' ,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: () => {
            this.deleteAccount();
            

          }
        }
      ]
    });
  
    await alert.present();
  }

  deleteAccount(){

    var usr ={
      "AccessToken" : localStorage.getItem("accessToken")
    };

    this.showLoading = true; 
    this._accountService.deleteAccount(usr).subscribe( res => {
        this.presentAlertGeneral("Success", "Account Deleted");
        this.showLoading = false; 
        localStorage.removeItem("accessToken");
        this.router.navigate(['login']);
    },err=> {
      this.presentAlertGeneral("Failed", "Could not delete account");
      this.showLoading = false; 
    });


  }

  async presentAlertGeneral( head : string , msg : string) {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: head,
      message: msg ,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
           // console.log('Confirm Cancel');
          }
        }
      ]
    });
  
    await alert.present();
  }

}

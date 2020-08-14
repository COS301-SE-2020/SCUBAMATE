import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { AlertController } from '@ionic/angular';


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

  /********************************************/

  constructor( public alertController : AlertController , private router: Router, private _accountService: accountService,  private _diveService: diveService) {}
  
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
    

        this._accountService.getUser().subscribe(res => {
          console.log("res");
          console.log(res);
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
          
          
          if(localStorage.getItem("accessToken").substring(36, 38) == "01"){
            this.accountType = "Instructor"
          }else if (localStorage.getItem("accessToken").substring(36, 38) == "00"){
            this.accountType = "Diver"
          }else if(localStorage.getItem("accessToken").substring(36, 38) == "10"){
            this.accountType = "Admin"
          }else if(localStorage.getItem("accessToken").substring(36, 38) == "11"){
            this.accountType = "SuperAdmin"
          }else{
            this.accountType = "*Diver"
          }


          if( this.accountType == "Instructor"){
            this.loadUnverifiedCourses();
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
    

        this._accountService.getUser().subscribe(res => {
          console.log("res");
          console.log(res);
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
          
          
          if(localStorage.getItem("accessToken").substring(36, 38) == "01"){
            this.accountType = "Instructor"
          }else if (localStorage.getItem("accessToken").substring(36, 38) == "00"){
            this.accountType = "Diver"
          }else if(localStorage.getItem("accessToken").substring(36, 38) == "10"){
            this.accountType = "Admin"
          }else if(localStorage.getItem("accessToken").substring(36, 38) == "11"){
            this.accountType = "SuperAdmin"
          }else{
            this.accountType = "*Diver"
          }
          
        

          this.showLoading = false;
          this.showAD = true; 
          
        }) ;



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


  goToEdit(){
    console.log("in edit func");
    this.router.navigate(["/edit-profile"]);
  }

  

  sendEmail(){
     
    this.showLoading = true;
    this._accountService.sendValidationEmail(this.AD.Email).subscribe( res=>
      {
        console.log("Email Sent");
        localStorage.setItem("otp", res.OTP);
        this.showLoading = false;
        this.presentOTPPrompt();
      });
  }

  sendVerifiedEmail(){
     
    this.showLoading = true;
    this._accountService.confirmEmailValidation(this.AD.Email).subscribe( res=>
      {
        console.log("Validated Email Sent");
        this.showLoading = false;
        location.reload();
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
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Retry',
          handler: () => {
            console.log("Retry OTP" );
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
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: data => {
            console.log(data);
            console.log("OTP Entered:" + data['otpEntered']);

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

}

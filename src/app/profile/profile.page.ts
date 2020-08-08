import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { AlertController } from '@ionic/angular';
import {ConnectionService} from 'ng-connection-service';
import { Location } from '@angular/common';

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
  AccountType: string ;
  LastName: string ;
  Email: string ;
  Specialisation: string[];
  Qualification: string;
}

export interface DiveType{
  diveType : string ;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  loginLabel:string ;
  AD ;//: AccountDetails ; 
  DiveTypeLst: []; 
  OptionalList : String[];
  EquipmentList : String[];
 
  viewChecklist : Boolean = false ; 
  viewProfile : Boolean;
  editProfile : Boolean; 
  showLoading: Boolean;
  showAD : Boolean = false  ;

  showAccountVerifiedMessage : Boolean ;

  //Internet Connectivity check
  isConnected = true;  
  noInternetConnection: boolean;

  constructor( public alertController : AlertController , private router: Router, private _accountService: accountService,  private _diveService: diveService, private connectionService: ConnectionService, private location: Location) {
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
      this.loginLabel = "Sign Out";
    

        this._accountService.getUser().subscribe(res => {
          console.log("res");
          console.log(res);
          this.AD = res;
          if (res.PublicStatus == true){
            this.AD.PublicStatus = "Public";
          }else{
            this.AD.PublicStatus = "Private";
          }

          if(res.VerifiedEmail){
            this.showAccountVerifiedMessage = false ;
          }else{
            this.showAccountVerifiedMessage = true ;
          }

          this.showLoading = false;
          this.showAD = true; 
          
        }) 

        this._diveService.getDiveTypes("*").subscribe(
          data => {
              console.log(data);
              this.DiveTypeLst = data.ReturnedList ; 
              console.log("In type");
              this.showLoading = false;

          }
        ); //end DiveType req


      }
    
  }


  ionViewWillEnter(){
    this.viewProfile = true;
    this.editProfile = false;
    if(!localStorage.getItem("accessToken"))
    {
      this.router.navigate(['login']);
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }

    

    this._accountService.getUser().subscribe(res => {
      console.log(res);
      this.AD = res;
      if (res.PublicStatus == true){
        this.AD.PublicStatus = "Public";
      }else{
        this.AD.PublicStatus = "Private";
      }
      
      if(res.VerifiedEmail){
        this.showAccountVerifiedMessage = false ;
      }else{
        this.showAccountVerifiedMessage = true ;
      }
    })
    this._diveService.getDiveTypes("*").subscribe(
      data => {
          console.log(data);
          this.DiveTypeLst = data.ReturnedList ; 
          console.log("In type");
          this.showLoading = false;
      }
    ); //end DiveType req
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

  onChooseDive( DT: string , event: Event  )
  {
    this.showLoading= true;
    var RequestData = {
      "DiveType" : DT
    }

    console.log(RequestData);

    this.showLoading= true;
    this._diveService.getCheckList(RequestData).subscribe( res =>{
      this.viewChecklist = false ; 
      this.OptionalList = res.Optional;
      this.EquipmentList = res.Equipment;
      this.viewChecklist = true ; 
      this.showLoading= false;
    });


  }

  goToEdit(){
    console.log("in edit func");
    this.router.navigate(["/edit-profile"]);
  }

  async presentAlertEmailSent( userEmail ) {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: 'Validation Email Sent',
      subHeader: 'Please validate your Email',
      message: 'An OTP has been sent to: <br>' + userEmail ,
      buttons: ['OK']
    });
  
    await alert.present();
  }
  

  sendEmail(){
    this.showLoading = true;
    this._accountService.sendValidationEmail(this.AD.Email).subscribe( res=>
      {
        this.showLoading = false;
        this.presentAlertEmailSent(this.AD.Email);
      });
  }


}

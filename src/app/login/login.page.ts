import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';
import * as CryptoJS from 'crypto-js';  
import {ConnectionService} from 'ng-connection-service';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { GlobalService } from "../global.service";

export interface LoginClass {
  Email: string;
  Password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})


export class LoginPage implements OnInit {

  /*********************************************
                Global Variables
  *********************************************/
  
  accountType : string;

  //Internet Connectivity check
  isConnected = true;  
  noInternetConnection: boolean;
  showLoading: boolean = false;

  constructor(public _globalService: GlobalService, public alertController : AlertController, private _accountService : accountService, private router: Router, private connectionService: ConnectionService, private location: Location) {
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

    if(localStorage.getItem("accessToken")){
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
    }
    
   }



 // session : any;
 // showError: false;
 // msgErro: string ;
  loginLabel:string ;
  passwordType : string = 'password'; 
  showPassword : boolean = false; 

  ngOnInit() {
    this.passwordType = 'password'; 
    this.showPassword  = false;


    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.router.navigate(['home']);
    }
    if(localStorage.getItem("accessToken")){
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
    }
    
  }

  ionViewWillEnter(){
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }
    if(localStorage.getItem("accessToken")){
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
    }
    
  }

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken");
      location.reload();
    }else{
      this.router.navigate(['login']);
    }
  }

  onSubmit(iEmail: any , iPass: any , event : Event) {
     var attemptLogin = {Email: iEmail.trim(), Password: iPass} as LoginClass; 
     

     //request

    this._accountService.logUser(attemptLogin).subscribe( res =>{

      localStorage.setItem("accessToken", res.Data[0].AccessToken) ; 
      location.reload();
 
    }, err=>{
      this.presentLoginFailAlert();
    });

    
  }
isUndefined(val): boolean { 
      return typeof val === 'undefined'; 
    };


  async presentLoginFailAlert() {
    const alert = await this.alertController.create({
      header: 'Could not log in',
      message: 'Please enter a valid password and email.',
      buttons: ['OK']
    });
  
    await alert.present();
  }


  togglePassword(){

    if(this.passwordType == 'password'){
      this.showPassword = true ;
      this.passwordType = 'text';
    }else if( this.passwordType == 'text'){
      this.showPassword = false ;
      this.passwordType = 'password';
    }


  }

  emailReset(){
    this.presentEmailPasswordPrompt();
  
  }


  async presentEmailPasswordPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Forgot Your Password',
      message:  'Provide Email Of Account To Receive Temporary Password',
      inputs: [
        {
          name: 'emailEntered',
          type: 'text',
          placeholder: 'example@mail.com'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Confirm',
          handler: data => {

              this.step2EmailReset(data.emailEntered);

          }
        }
      ]
    });

    await alert.present();
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
          }
        }
      ]
    });
  
    await alert.present();
  }


  step2EmailReset(accEmail){

      var step1Req ={
        "Email" : accEmail 
      }


      this.showLoading = true ; 

      this._accountService.receiveNewPassword(step1Req).subscribe(res =>{
        this.showLoading = false ; 
            console.log(res);

          var step2Req ={
            "Email" : accEmail ,
            "Type" : res.new 
          } 

          this.showLoading = true ; 

          this._accountService.sendRelatedEmail(step2Req).subscribe(res =>{
            this.showLoading = false ; 
            console.log(res);
            this.presentAlertGeneral("Temporary Password Send To " + accEmail , "Log in using new temporary password then proceed to your profile page to reset your password.");


          }, err =>{
            this.showLoading = false ; 
            this.presentAlertGeneral("Could Not Send Temporary Password To " + accEmail , err.error);

          });


      },err => {
        this.showLoading = false ; 
          this.presentAlertGeneral("Could Not Create Temporary Password for " + accEmail , err.error);
      }); 



  }



}

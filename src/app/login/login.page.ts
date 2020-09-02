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

  //Internet Connectivity check
  isConnected = true;  
  noInternetConnection: boolean;

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
      location.reload();
    }else{
      this.router.navigate(['login']);
    }
  }

  onSubmit(iEmail: string, iPass: string , event : Event) {
     var attemptLogin = {Email: iEmail, Password: iPass} as LoginClass; 
     

     //request

    this._accountService.logUser(attemptLogin).subscribe( res =>{

      localStorage.setItem("accessToken", res.Data[0].AccessToken) ; 
      location.reload();
 
    }, err=>{
      this.presentLoginFailAlert();
    });


  }



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



}

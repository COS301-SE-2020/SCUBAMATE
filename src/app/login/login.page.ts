import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';
import * as CryptoJS from 'crypto-js';  
import { AlertController } from '@ionic/angular';

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

  constructor(public alertController : AlertController , private _accountService : accountService, private router: Router) { }


 // session : any;
 // showError: false;
 // msgErro: string ;
  loginLabel:string ;

  ngOnInit() {
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
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
    //event.preventDefault();

    //encode password
    // let conversionEncryptOutput = CryptoJS.AES.encrypt( iEmail.trim(), iPass.trim()).toString();

     //create object
     var attemptLogin = {Email: iEmail, Password: iPass} as LoginClass; 
     

     //request

    this._accountService.logUser(attemptLogin).subscribe( res =>{
      console.log("in res");
      console.log(res);
      console.log(res.Data[0].AccessToken)
      localStorage.setItem("accessToken", res.Data[0].AccessToken) ; 
     // localStorage.setItem("accountType", res.Data[1].AccountType)  ;
      this.router.navigate(['home']);
      //console.log(res.body.AccessToken); 
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

}

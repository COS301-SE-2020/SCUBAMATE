import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';
import * as CryptoJS from 'crypto-js';  


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

  constructor(private _accountService : accountService, private router: Router) { }


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
    event.preventDefault();

    //encode password
     let conversionEncryptOutput = CryptoJS.AES.encrypt( iEmail.trim(), iPass.trim()).toString();

     //create object
     var attemptLogin = {Email: iEmail, Password: conversionEncryptOutput} as LoginClass; 
     console.log(attemptLogin);

     //localStorage.setItem('accessToken' , "meep meep");
     //this.router.navigate(['home']);
     
    //token-> 570490f416471aaa6a1513603312b6e3cda0e386ab791fa8e4bd73b32f143de7
     //request
     //this._accountService.logUser(attemptLogin) ;
    this._accountService.logUser(attemptLogin).subscribe( res =>{
      console.log(res); 
    })


   /**  this._accountService.logUser(attemptLogin).subscribe( (res:any) =>{
      console.log(res);
        if(res.Error){
          //show error message
          //this.errorMessage = res;
          //this.showError = true ;
        }else{
            localStorage.setItem('accessToken' , res.SessionID);
            this.router.navigate(['home']);
        }
    } ) */


  }

}

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
    // let conversionEncryptOutput = CryptoJS.AES.encrypt( iEmail.trim(), iPass.trim()).toString();

     //create object
     var attemptLogin = {Email: iEmail, Password: iPass} as LoginClass; 
     console.log(attemptLogin);


     //request

    this._accountService.logUser(attemptLogin).subscribe( res =>{
      console.log("in res");
      console.log(res);
      //console.log(res.body.AccessToken); 
    });


  }

}

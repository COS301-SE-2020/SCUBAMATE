import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';


export interface LoginClass {
  email: string;
  password: string;
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

     var attemptLogin = {email: iEmail, password: iPass} as LoginClass; 
     console.log(attemptLogin);

     localStorage.setItem('accessToken' , "meep meep");
     this.router.navigate(['home']);

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

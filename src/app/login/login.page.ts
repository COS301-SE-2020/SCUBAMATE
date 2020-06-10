import { Component, OnInit } from '@angular/core';


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

  constructor() { }

  ngOnInit() {
  }

  onSubmit(iEmail: string, iPass: string , event : Event) {
    event.preventDefault();

     var attemptLogin = {email: iEmail, password: iPass} as LoginClass; 
     console.log(attemptLogin);

   // this._sbrandService.deleteBrand(t);
  }

}

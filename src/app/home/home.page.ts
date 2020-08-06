import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';


export interface DiveSite{
  diveSite: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  siteLst: DiveSite[] ;
  loginLabel:string ;
  constructor(private router: Router,private _accountService: accountService) {}
  
  ngOnInit() {
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
    }

  }

  ionViewWillEnter(){
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
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

  sendEmail(){
    this._accountService.sendValidationEmail("").subscribe( res =>{
      console.log("In res");
      console.log(res);
    }) 
  }



}

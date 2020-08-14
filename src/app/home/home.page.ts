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

   /*********************************************
                Global Variables
  *********************************************/
  siteLst: DiveSite[] ;
  loginLabel:string ;
  accountType : string;

  /********************************************/

  constructor(private router: Router,private _accountService: accountService) {}
  
  ngOnInit() {
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
    }

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




}

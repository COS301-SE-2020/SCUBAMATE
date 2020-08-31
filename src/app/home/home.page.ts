import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';
import {ConnectionService} from 'ng-connection-service';
import { Location } from '@angular/common';

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

  //Internet Connectivity check
  isConnected = true;  
  noInternetConnection: boolean;

  accountType : string;

  //Animations
  buttonSignUpMarginLeft : string = "10px" ; 
  buttonLoginMarginLeft  : string = "10px" ; 

  constructor(private router: Router,private _accountService: accountService, private connectionService: ConnectionService, private location: Location) {
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

        //console.log(this.accountType);
   }
  }
  /********************************************/
  ngOnInit() {
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";

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
      this.loginLabel = "Log Out";

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
      this.accountType = "*Diver";
      location.reload();
    }else{
      this.router.navigate(['login']);
    }
  }

  isUndefined(val): boolean { 
    return typeof val === 'undefined'; 
  };

  moveArrowRightSignUp(){
    this.buttonSignUpMarginLeft = "30px" ; 
  }

  moveArrowLeftSignUp(){
    this.buttonSignUpMarginLeft = "10px" ; 
  }

  moveArrowRightLogin(){
    this.buttonLoginMarginLeft = "30px" ; 
  }

  moveArrowLeftLogin(){
    this.buttonLoginMarginLeft = "10px" ; 
  }


}

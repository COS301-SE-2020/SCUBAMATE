import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';
import {ConnectionService} from 'ng-connection-service';
import { Location } from '@angular/common';
import { GlobalService } from "../global.service";
import { Animation, AnimationController } from '@ionic/angular';




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

  constructor(public _globalService: GlobalService, private animationCtrl: AnimationController , private router: Router,private _accountService: accountService, private connectionService: ConnectionService, private location: Location) {
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
      this.loginLabel = "Log In";
      this._globalService.activeLabel =  "Log In";
    }else{
      //this.loginLabel = "Log Out";
      this._globalService.accountRole = localStorage.getItem("accessToken").substring(36, 38) ;
      this._globalService.activeLabel =  "Log Out";
      this.accountType = this._globalService.accountRole; 


     
    }

    this.loginLabel = this._globalService.activeLabel ;


    //animation
    const animation = this.animationCtrl.create()
  .addElement(document.querySelectorAll('.flyInIcon'))
  .delay(1000)
  .duration(1200)
  .direction('alternate')
  .iterations(1)
  .fromTo('transform', 'translateX(-100px)', 'translateX(0px)')
  .fromTo('opacity', '0.1', '1');
  ;

animation.play();
   

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

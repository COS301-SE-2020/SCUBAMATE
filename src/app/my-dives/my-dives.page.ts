import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';
import {ConnectionService} from 'ng-connection-service';
import { Location } from '@angular/common';

export interface Dive{
  Buddy : string;
  TimeIn: string;
  DiveDate: string ;
  DiveSite: string ;
 /* TimeOut: string;
  DiveDate: string ;
  Weather: string[] ; */
}

@Component({
  selector: 'app-my-dives',
  templateUrl: './my-dives.page.html',
  styleUrls: ['./my-dives.page.scss'],
})
export class MyDivesPage implements OnInit {
//{Location: "Here" , DateOf: "07/03/2019", Weather: "Sunny 70% Visibility", TimeIn: "10:00", TimeOut:"10:45", Buddy: "Gerorge Flint"} 
  
  diveLst:[]; //Dive[] ;
  loginLabel:string ;
  showLoading: Boolean ;
  showDiveList : Boolean ;
  accountType : string;

  //Internet Connectivity check
  isConnected = true;  
  noInternetConnection: boolean;

  constructor(private router: Router, private _diveService: diveService, private connectionService: ConnectionService, private location: Location) {
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
    }
  }
  
  ngOnInit() {
    this.showDiveList = false;
    this.loginLabel ="Login";
    this.showLoading= true;
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
    }
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
    }

    console.log("Do a Private search:");
    
      //get private dives
      if(localStorage.getItem("accessToken") != null)//check logged in
      {
        this._diveService.getPrivateDive().subscribe( res =>{
            
            if( res.PrivateDiveLogs){
              this.diveLst = res.PrivateDiveLogs;
            }else{
              this.diveLst = [];
            }

            this.showDiveList = true;
            this.showLoading= false;

        }, err =>{
          this.showLoading= false;
          this.showDiveList = false;
          console.log(err.error)
        });
         
      }else{
        this.router.navigate(['login']);
        this.showLoading= false;
        this.diveLst = [];
      }
      


  }

  ionViewWillEnter(){
    this.showDiveList = false;
    this.loginLabel ="Login";
    this.showLoading= true;
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
    }
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
    }
    if(localStorage.getItem("DiveID") !== undefined){
      localStorage.removeItem("DiveID");
    }
    console.log("Do a Private search:");
    
      //get private dives
      if(localStorage.getItem("accessToken") != null)//check logged in
      {
        this._diveService.getPrivateDive().subscribe( res =>{
            
            if( res.PrivateDiveLogs){
              this.diveLst = res.PrivateDiveLogs;
            }else{
              this.diveLst = [];
            }

            this.showDiveList = true;
            console.log(res);
            this.showLoading= false;

        }, err =>{
          this.showLoading= false;
          this.showDiveList = false;
          console.log(err.error)
        });
         
      }else{
        this.router.navigate(['login']);
        this.showLoading= false;
        this.diveLst = [];
      }
    
  }

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken");
      this.accountType = "*Diver";
      this.router.navigate(['home']);
    }else{
      this.router.navigate(['login']);
    }
  }

  goToEdit(diveID : string ){
    console.log("DIVE: " + diveID);
    localStorage.setItem("DiveID", diveID);
    console.log("in edit func");
    this.router.navigate(["/edit-dive"]);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';

export interface Dive{
  FirstName : string ;
  LastName : string ;
  DiveSite : string ;
  DiveType : string;
  DiveDate : string ;
  TimeIn : string ;
  TimeOut : string ;
  Buddy : string;
  Weather : []  ;
}

export interface DiveSite{
  diveSite: string;
}

export interface DiveCenter{
  diveCenter : string ;
}

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {

  //variables
  siteLst: DiveSite[] ;
  centerLst: DiveCenter[] ;
  showSites : boolean ;
  showCenters : boolean ;
  showFeed  : boolean ;
  showLoading : boolean;
  pubLst: Dive[] ; 
  loginLabel:string ;



  
  constructor(private router: Router, private _diveService: diveService) { }

 


  ngOnInit() {
    //setup what gets displayed
    this.showFeed = true;
    this.showSites = false;
    this.showCenters = false;

    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }

    this.showLoading = true ; 
    this._diveService.getPublicDives().subscribe(res =>{
      this.pubLst = res;
      this.showLoading = false ;
    });

  }

  ionViewWillEnter(){
    //setup what gets displayed
    this.showFeed = true;
    this.showSites = false;
    this.showCenters = false;

    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }

    this.showLoading = true ; 
    this._diveService.getPublicDives().subscribe(res =>{
      console.log(res);
      this.pubLst = res.PublicDiveLogs;
      this.showLoading = false ;
    });
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



  /// code to edit what gets displayed
  displayDiveSites(){
    this.showLoading = true;
    //setup what gets displayed
    this.showFeed =  false;
    this.showSites = true;
    this.showCenters = false;

    this._diveService.getDiveSites("*").subscribe(
      data => {
          console.log(data);
          this.siteLst = data.ReturnedList ; 
          this.showLoading = false;
      }
    ); //end DiveSite req
    
  }

  displayDiveCenters(){
    this.showLoading = true;
    this.showFeed =  false;
    this.showSites = false;
    this.showCenters= true;

    this._diveService.getDiveCenters("*").subscribe(
      data => {
          console.log(data);
          this.centerLst = data.ReturnedList ; 
          this.showLoading = false;
      }
    ); //end DiveType req
  }

  displayFeed(){
    this.showFeed =  true;
    this.showSites = false;
    this.showCenters = false;
  }





}

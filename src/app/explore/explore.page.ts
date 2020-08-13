import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';
//import { FlashCardComponent } from '../components/flash-card/flash-card.component';

export interface Dive{
  FirstName : string ;
  LastName : string ;
  DiveSite : string ;
  DiveType : string;
  DiveDate : string ;
  TimeIn : string ;
  TimeOut : string ;
  Buddy : string;
  Weather : string[]  ;
}

export interface DiveSite{
  diveSite: string;
}

export interface DiveCenter{
  Name : string ;
  Description: string ;
  Coords: string;
  LogoPhoto: string ;
}

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {

  /*********************************************
                Global Variables
  *********************************************/
  siteLst: DiveSite[] ;
  centerLst: DiveCenter[] ;
  showSites : boolean ;
  showCenters : boolean ;
  showFeed  : boolean ;
  showLoading : boolean;
  pubLst: Dive[] ; 
  loginLabel:string ;

  //Page Indicators
  CentersPage : number = 1;
  SitesPage: number = 1 ;
  FeedPage : number = 1; 


  /*********************************************/

  
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
      this.loginLabel = "Log Out";
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
      this.loginLabel = "Log Out";
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

    this._diveService.getExtendedDiveCenters("*", 1).subscribe(
      data => {
          console.log(data);
          this.centerLst = data.ReturnedList ; 
          //this.CentersPage++ ;


          for(var y=0; y < this.centerLst.length ; y++ ){
            if( this.centerLst[y].Description.length > 300  ){
              this.centerLst[y].Description = this.centerLst[y].Description.substr(0, 300) + " ...";
            }
          }

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

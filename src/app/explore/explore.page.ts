import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';
//import { FlashCardComponent } from '../components/flash-card/flash-card.component';
import {ConnectionService} from 'ng-connection-service';
import { Location } from '@angular/common';
import { GlobalService } from "../global.service";
import { AlertController } from '@ionic/angular';

import { IonInfiniteScroll } from '@ionic/angular';

export interface Dive{
  FirstName : string ;
  LastName : string ;
  DiveSite : string ;
  DiveTypeLink : string;
  DiveDate : string ;
  TimeIn : string ; 
  TimeOut : string ;
  Buddy : string;
  Weather : string[]  ;
  DiveImage : string;
}

export interface DiveSite{
  Name : string ;
  Description: string ;
  Coords: string;
  LogoPhoto: string ;
  Location: string ; 
}

export interface DiveCenter{
  Name : string ;
  Description: string ;
  Coords: string;
  LogoPhoto: string ;
  Location: string ; 
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
 
  siteLst: DiveSite[] = new Array() ;
  centerLst: DiveCenter[] = new Array() ;
  showSites : boolean ;
  showCenters : boolean ;
  showFeed  : boolean ;
  showLoading : boolean;
  showMoreFeed : boolean = true ;
  showMoreCenters : boolean = true ;
  showMoreSites: boolean = true ;
  pubLst: Dive[] = []; 
  loginLabel:string ;
  accountType : string;

  showFeedLoaded : boolean = false ; 

  //Internet Connectivity check
  isConnected = true;  
  noInternetConnection: boolean;
  //Page Indicators
  CentersPage : number = 1;
  SitesPage: number = 1 ;
  FeedPage : number = 1; 

  //infoViews
  viewFeedInfo: boolean = false; 


  /*********************************************/

  
  constructor(public alertController : AlertController , public _globalService: GlobalService, private router: Router, private _diveService: diveService, private connectionService: ConnectionService, private location: Location) { 
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
   
  } 
 
  ngOnInit() {
    //setup what gets displayed
   /* this.showFeed = true;
    this.showSites = false;
    this.showCenters = false;
    this.centerLst = [];
    this.siteLst = [] ;
    this.showFeedLoaded = false;*/

    this.centerLst = [];
    this.siteLst = [] ;

    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
      this.accountType = this._globalService.accountRole;
      //this.displayFeed();
      
    }
  }

  ionViewWillEnter(){
    //setup what gets displayed
     
    this.showFeedLoaded = false;

    

    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
    }
    if(localStorage.getItem("accessToken")){
      this._globalService.activeLabel =  "Log Out";
      this.accountType = this._globalService.accountRole;
      
      //this.displayFeed();
      if(this._globalService.activeExploreFeed == "sites"){
        this.showFeed = false;
        this.showSites = true;
        this.showCenters = false;
        this.displayDiveSites();

      }else if(this._globalService.activeExploreFeed == "feed"){
        this.showFeed = true;
        this.showSites = false;
        this.showCenters = false;
        this.displayFeed();

      }else{
        this.showFeed = false;
        this.showSites = false;
        this.showCenters = true;
        this.displayDiveCenters();

      }


    }
   
  }

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken");
      this.accountType = "*Diver";
      this.router.navigate(['login']);
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
    this.showFeedLoaded = false;

    this.viewFeedInfo = false; 

    this._globalService.activeExploreFeed = "sites";
    this.loadSites();
    
  }

  displayDiveCenters(){
    this.showFeed =  false;
    this.showSites = false;
    this.showCenters= true;
    this.viewFeedInfo = false; 
    
    this.showFeedLoaded = false;
    this._globalService.activeExploreFeed = "centers";
    this.loadCenters();
  }
  displayFeed(){
    this.showFeed =  true;
    this.showSites = false;
    this.showCenters = false;
    this.viewFeedInfo = false; 
    
    this.showFeedLoaded = true;
    this._globalService.activeExploreFeed = "feed";
    this.loadFeed();
  }
  loadFeed(){
    this.showLoading = true;
    this._diveService.getPublicDives(this.FeedPage).subscribe(res =>{
      //console.log(res);
      res.forEach(element => {
        if(JSON.stringify(this.pubLst).indexOf(JSON.stringify(element)) === -1){
          this.pubLst.push(element);
        }
        
      });
      this.FeedPage++;
      this.showFeedLoaded = true;
      this.showLoading = false ;
    }, err=>{
      if(err.error){
        this.showLoading = false;

        if(err.error == "No more dives found")
        {
          this.showMoreFeed = false;
          this.FeedPage = 1;
        }
      }
    });
  }

  loadCenters(){
    this.showLoading = true;
    this._diveService.getExtendedDiveCenters("*", this.CentersPage).subscribe(
      data => {

            this.centerLst.push(...data.ReturnedList);
          
            //console.log("Loading for Page " + this.CentersPage );
            //console.log("Current List");
            console.log( this.centerLst);

          this.CentersPage++ ;
          for(var y=0; y < this.centerLst.length ; y++ ){
            if( this.centerLst[y].Description.length > 300  ){
              this.centerLst[y].Description = this.centerLst[y].Description.substr(0, 300) + " ...";
            }
          }

          this.showLoading = false;
      }, err =>{
        if(err.error){
          this.showLoading = false;

          if(err.error == "No Results Found For: *")
          {
            this.showMoreCenters = false;
          }
        }
      }
    ); //end ExtendedDiveCenters req

  }
  
  ViewMoreDiveCenter( DC : string){
    localStorage.setItem("ViewDiveCenter", DC) ;
    this.router.navigate(['dive-center-information']);
  }

  loadSites(){
    this.showLoading = true;
    this._diveService.getExtendedDiveSites("*", this.SitesPage).subscribe(
      data => {

            this.siteLst.push(...data.ReturnedList);
          
            //console.log("Loading for Page " + this.SitesPage );
            //console.log("Current List");
            //console.log( this.siteLst);

          this.SitesPage++ ;


          for(var y=0; y < this.siteLst.length ; y++ ){
            if( this.siteLst[y].Description.length > 300  ){
              this.siteLst[y].Description = this.siteLst[y].Description.substr(0, 300) + " ...";
            }
          }

          this.showLoading = false;
      }, err =>{
        if(err.error){
          this.showLoading = false;

          if(err.error == "No Results Found For: *")
          {
            this.showMoreSites = false;
          }
        }
      }
    ); //end ExtendedDiveCenters req



  }


  ViewMoreDiveSite( DS : string){
    localStorage.setItem("ViewDiveSite", DS) ;
    this.router.navigate(['dive-site-information']);
  }


  async presentGeneralAlert(hd, msg) {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: hd,
      message: msg ,
      buttons: ['OK']
    });
  
    await alert.present();
  }



 

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';
//import { FlashCardComponent } from '../components/flash-card/flash-card.component';
import {ConnectionService} from 'ng-connection-service';
import { Location } from '@angular/common';

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
  Name : string ;
  Description: string ;
  Coords: string;
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
  siteLst: DiveSite[] = new Array() ;
  centerLst: DiveCenter[] = new Array() ;
  showSites : boolean ;
  showCenters : boolean ;
  showFeed  : boolean = true;
  showLoading : boolean;
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


  /*********************************************/

  
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
    //setup what gets displayed
    this.showFeed = true;
    this.showSites = false;
    this.showCenters = false;
    this.centerLst = [];
    this.siteLst = [] ;
    this.showFeedLoaded = false;

    this.loginLabel ="Login";
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
    this.showLoading = true ; 
    this._diveService.getPublicDives().subscribe(res =>{
      this.pubLst = res;
      this.showFeedLoaded = true;
      this.showLoading = false ;
    }, err=>{
      if(err.error == "Invalid Access Token"){
        localStorage.removeItem("accessToken");
        this.router.navigate(['login']);
      }
    });

  }

  ionViewWillEnter(){
    //setup what gets displayed
   /**  this.showFeed = true;
    this.showSites = false;
    this.showCenters = false; */
    this.showFeedLoaded = false;

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
    this.showLoading = true ; 
    this._diveService.getPublicDives().subscribe(res =>{
      //console.log(res);
      this.pubLst = res.PublicDiveLogs;
      this.showFeedLoaded = true;
      this.showLoading = false ;
    });
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


  checkURL(name): boolean{ 
      //console.log(num)
      let url = "../../assets/images/Weather/"+name.toLowerCase()+".png";
      let img = new Image();
      img.src = url;
      if(img.width == 0){
        //console.log("not found "+url)
        return false;
      }
      else{
        //console.log(" found "+url)
        return true;
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
    this.loadSites();
    
  }

  displayDiveCenters(){
    this.showFeed =  false;
    this.showSites = false;
    this.showCenters= true;
    this.showFeedLoaded = false;
    this.loadCenters();
  }

  displayFeed(){
    this.showFeed =  true;
    this.showSites = false;
    this.showCenters = false;
    this.showFeedLoaded = true;
  }

  loadCenters(){
    this.showLoading = true;
    this._diveService.getExtendedDiveCenters("*", this.CentersPage).subscribe(
      data => {

            this.centerLst.push(...data.ReturnedList);
          
            //console.log("Loading for Page " + this.CentersPage );
            //console.log("Current List");
            //console.log( this.centerLst);

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
          
            console.log("Loading for Page " + this.SitesPage );
            console.log("Current List");
            console.log( this.siteLst);

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





}

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
  centerLst: DiveCenter[] = new Array() ;
  showSites : boolean ;
  showCenters : boolean ;
  showFeed  : boolean = true;
  showLoading : boolean;
  showMoreCenters : boolean = true ;
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
    this.centerLst = [];

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
    

    this.showFeed =  false;
    this.showSites = false;
    this.showCenters= true;

    this.loadCenters();
  }

  displayFeed(){
    this.showFeed =  true;
    this.showSites = false;
    this.showCenters = false;
  }

  loadCenters(){
    this.showLoading = true;



    this._diveService.getExtendedDiveCenters("*", this.CentersPage).subscribe(
      data => {

            this.centerLst.push(...data.ReturnedList);
          
            console.log("Loading for Page " + this.CentersPage );
            console.log("Current List");
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





}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';

export interface Dive{
  Diver : string; 
  Location : string ;
  DateOf : string   ;
  Weather : string ;
  Buddy: string   ; 
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


  //hardcoded public feed -> remove later
  pubLst: Dive[] = [{Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"},
                    {Diver: "Melissa Greg" , Location: "Shelly Beacg", DateOf:"02/02/2020", Weather:"20% Visibility Sunny", Buddy:"Andrew Michaels"}
                  ];

  constructor(private router: Router, private _diveService: diveService) { }

  loginLabel:string ;

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
    //setup what gets displayed
    this.showFeed =  false;
    this.showSites = true;
    this.showCenters = false;

    this._diveService.getDiveSites("*").subscribe(
      data => {
          console.log(data);
          this.siteLst = data.ReturnedList ; 
      }
    ); //end DiveSite req
    
  }

  displayDiveCenters(){
    this.showFeed =  false;
    this.showSites = false;
    this.showCenters= true;

    this._diveService.getDiveCenters("*").subscribe(
      data => {
          console.log(data);
          this.centerLst = data.ReturnedList ; 
      }
    ); //end DiveType req
  }

  displayFeed(){
    this.showFeed =  true;
    this.showSites = false;
    this.showCenters = false;
  }





}

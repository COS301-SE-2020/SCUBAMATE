import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface Dive{
  Diver : string; 
  Location : string ;
  DateOf : string   ;
  Weather : string ;
  Buddy: string   ; 
}

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {

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

  constructor(private router: Router) { }

  loginLabel:string ;

  ngOnInit() {
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }
  }

  ionViewWillEnter(){
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

}

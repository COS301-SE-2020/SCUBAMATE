import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';


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




  constructor(private router: Router, private _diveService: diveService) {}
  
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

    console.log("Do a Private search:");
    
      //get private dives
      if(localStorage.getItem("accessToken") != null)//check logged in
      {
        this._diveService.getPrivateDive().subscribe( res =>{
            
            if( res.Items){
              this.diveLst = res.Items;
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

    console.log("Do a Private search:");
    
      //get private dives
      if(localStorage.getItem("accessToken") != null)//check logged in
      {
        this._diveService.getPrivateDive().subscribe( res =>{
            
            if( res.Items){
              this.diveLst = res.Items;
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

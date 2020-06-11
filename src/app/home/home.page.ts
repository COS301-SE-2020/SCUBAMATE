import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';


export interface DiveSite{
  diveSite: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  siteLst: DiveSite[] ;
  loginLabel:string ;
  constructor(private router: Router,private _diveService: diveService) {}
  
  ngOnInit() {
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }


    this._diveService.getDiveSites().subscribe(
      data => {
          console.log(data);
          this.siteLst = data.DiveSiteList ; 
      }
    ); //end DiveSite req
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

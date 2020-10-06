import { Component, OnInit } from '@angular/core';
import { GlobalService } from "../global.service";
import { Router } from '@angular/router';

//import {OrganizationChartModule} from 'primeng/organizationchart';

@Component({
  selector: 'app-technical',
  templateUrl: './technical.page.html',
  styleUrls: ['./technical.page.scss'],
})
export class TechnicalPage implements OnInit {

  constructor( public _globalService: GlobalService , private router: Router) { }

  loginLabel:string ;
  accountType : string;
  showLoading: boolean = false ;

  ngOnInit() {
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
      this.accountType = this._globalService.accountRole; 
    }

  }

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken");
      this.accountType = "*Diver";
      //location.reload();
      this.router.navigate(['login']);
    }else{
      this.router.navigate(['login']);
    }
  }

}

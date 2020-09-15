import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private router: Router) { }

  public accountRole : string;
  public activeLabel : string ;
  public activeExploreFeed : string  = "feed" ; 

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken"); 
      this.activeLabel = "Login";  
      this.accountRole = "*Diver";
      location.reload();
    }else{
      this.router.navigate(['login']);
    }
  } 

  changeExploreView( feedType : string ){
    this.activeExploreFeed = feedType ; 
  }

}

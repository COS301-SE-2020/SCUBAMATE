import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private router: Router) { }

  public accountRole : string;
  public activeLabel : string ;

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken"); 
      this.activeLabel = "Log Out";  
      this.accountRole = "*Diver";
      location.reload();
    }else{
      this.router.navigate(['login']);
    }
  } 

}

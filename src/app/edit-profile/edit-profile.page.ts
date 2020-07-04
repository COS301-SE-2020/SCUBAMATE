import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';


export interface EditAccountClass {
  AccessToken: string;
  DateOfBirth : string ;
  ProfilePhoto: string,
  FirstName: string;
  LastName: string;
  PublicStatus: boolean;
}

export interface AccountDetails{
  ItemType: string ;
  AccessToken: string;
  ProfilePhoto: string;
  AccountGuid: string ;
  Expires: string ;
  PublicStatus: string ;
  Password: string ;
  DateOfBirth: string ;
  FirstName: string ;
  AccountType: string ;
  LastName: string ;
  Email: string ;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  AD : AccountDetails ;
  loginLabel:string ; 
  showData : Boolean = false;

  constructor(private _accountService : accountService, private router: Router) { }

  ngOnInit() {
    this.loginLabel ="Login";
    this.showData = false;
    if(!localStorage.getItem("accessToken"))
    {
      this.router.navigate(['login']);
      this.loginLabel = "Login";
    }else{
      
      this.loginLabel = "Sign Out";
      this._accountService.getUser().subscribe(res => {
        this.AD = res;
        this.showData = true;
      })
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


  onSubmit(bDay:string,  FName: string , LName: string, pub: boolean, event : Event) {

     if(  (FName =="") ||  (LName ==="") ){  //test empty fields
      alert("Empty fields provided. \nPlease fill in all the fields");
    }else{
      //create object to send
      var attemptUpdate = { 
        AccessToken: localStorage.getItem("accessToken"),
        FirstName: FName,
        LastName: LName,
        ProfilePhoto: "meep.jpg",
        DateOfBirth : bDay ,  
        PublicStatus: pub //pStat 
      } as EditAccountClass; 
        //send to API service 
        console.log(attemptUpdate);

        this._accountService.editUser( attemptUpdate ).subscribe( res =>{
          console.log("in res");
          console.log(res);
         this.router.navigate(['/profile']);
        }); 
    }

     
  }

}

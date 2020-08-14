import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { AlertController } from '@ionic/angular';

export interface UC{
  AccessToken: string;
  Email: string ;
  Name: string ;
}


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.page.html',
  styleUrls: ['./admin-page.page.scss'],
})
export class AdminPagePage implements OnInit {

  /*********************************************
                Global Variables
  *********************************************/
  loginLabel:string ;
  accountType : string;

  //lookahead Lists
  BuddyLst : string [];
  CenterLst : string[];

  //Viewable Content
  showRegisterUserToCenter: boolean ;
  showRegisterNewCenter : boolean ; 
  showLoading: boolean ; 

  //Form Objects
  UserToCenterObj : UC ;

  //Forms


  /********************************************/

  constructor( public alertController : AlertController , private _diveService: diveService,private router: Router,private _accountService: accountService) {
    this.UserToCenterObj ={
      AccessToken : localStorage.getItem("accessToken"),
      Email : "",
      Name : "" 
    }
  }

  ngOnInit() {
    //Setup page load variables
    this.showRegisterUserToCenter = false; 
    this.showRegisterNewCenter = false ;
    this.showLoading = false;

    //Setup Login Label
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
    }

    //Setup User Role
    if(localStorage.getItem("accessToken").substring(36, 38) == "01"){
      this.accountType = "Instructor"
    }else if (localStorage.getItem("accessToken").substring(36, 38) == "00"){
      this.accountType = "Diver"
    }else if(localStorage.getItem("accessToken").substring(36, 38) == "10"){
      this.accountType = "Admin"
    }else if(localStorage.getItem("accessToken").substring(36, 38) == "11"){
      this.accountType = "SuperAdmin"
    }else{
      this.accountType = "*Diver"
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

  //Toggle Viewable Content Functions
  viewRegisterUserToCenter(){
    this.showRegisterUserToCenter = true; 
    this.showRegisterNewCenter = false ;


  }

  viewRegisterNewCenter(){
    this.showRegisterUserToCenter = false; 
    this.showRegisterNewCenter = true ;
  }


  //Lookahead Functions
  buddyListFinder( entry : string ){

    if(entry.length >= 2)
   {
       this.showLoading = true;
       this._accountService.lookAheadBuddy(entry).subscribe(
         data => {
             this.BuddyLst = data.ReturnedList ; 
             this.showLoading = false;
         }, err =>{
           this.showLoading = false;
         }
       ); //end Buddy req
   }

 }

 CenterListFinder(eventValue: string){

  if(eventValue.length >= 2)
 {
     this.showLoading = true;
     this._diveService.getDiveCenters(eventValue).subscribe(
       data => {
           this.CenterLst = data.ReturnedList ; 
           this.showLoading = false;
       }
     ); //end Buddy req
 }
 
 }

 //Submit functions
 UserToCenterSubmit(){

    if(this.UserToCenterObj.Name != "" && this.UserToCenterObj.Email != ""){
      var index1 = this.UserToCenterObj.Email.indexOf("(")+1 ;
      if(index1 != -1)
      {
        var index2 = this.UserToCenterObj.Email.length;
        this.UserToCenterObj.Email = this.UserToCenterObj.Email.substr( index1,index2 ) ;
  
        var index3 = this.UserToCenterObj.Email.length -1 ; 
        this.UserToCenterObj.Email = this.UserToCenterObj.Email.substr( 0,index3 ) ;
      }
     
      this.showLoading = true ;
      this._accountService.addUsertoDiveCenter(this.UserToCenterObj).subscribe(res=>{
          this.showLoading = false;
          this.UserToCenterObj.Email = "";
          this.UserToCenterObj.Name = "" ;
          this.showRegisterUserToCenter = false ;
          
          this.presentUserToCenterSuccessAlert();
      }, err=>{
        this.showLoading = false;
        this.presentUserToCenterFailAlert();
      });

      
    }

 }


 //alerts
 async presentUserToCenterSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'User Registered to Center',
      message: 'User has now been given Admin privileges',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentUserToCenterFailAlert() {
    const alert = await this.alertController.create({
      header: 'User Registered Not to Center',
      message: 'Registration failed. Please try again',
      buttons: ['OK']
    });

    await alert.present();
  }

}

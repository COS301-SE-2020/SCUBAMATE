import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';



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

export interface DiveType{
  diveType : string ;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  loginLabel:string ;
  AD : AccountDetails ; 
  DiveTypeLst: []; 
  OptionalList : String[];
  EquipmentList : String[];
 
  viewChecklist : Boolean = false ; 
  viewProfile : Boolean;
  editProfile : Boolean; 
  showLoading: Boolean;

  constructor( private router: Router, private _accountService: accountService,  private _diveService: diveService) {}
  
  ngOnInit() {
    this.viewProfile = true;
    this.editProfile = false;
    this.loginLabel ="Login";
    this.showLoading = true;
    if(!localStorage.getItem("accessToken"))
    {
      this.router.navigate(['login']);
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    

        this._accountService.getUser().subscribe(res => {
          this.AD = res;
          if (res.PublicStatus == true){
            this.AD.PublicStatus = "Public";
          }else{
            this.AD.PublicStatus = "Private";
          }

          this.showLoading = false;

        }) 

        this._diveService.getDiveTypes("*").subscribe(
          data => {
              console.log(data);
              this.DiveTypeLst = data.ReturnedList ; 
              console.log("In type");
              this.showLoading = false;
          }
        ); //end DiveType req


      }
    
  }


  ionViewWillEnter(){
    this.viewProfile = true;
    this.editProfile = false;
    if(!localStorage.getItem("accessToken"))
    {
      this.router.navigate(['login']);
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }

    this._accountService.getUser().subscribe(res => {
      this.AD = res;
    })
    this._diveService.getDiveTypes("*").subscribe(
      data => {
          console.log(data);
          this.DiveTypeLst = data.ReturnedList ; 
          console.log("In type");
          this.showLoading = false;
      }
    ); //end DiveType req
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

  onChooseDive( DT: string , event: Event  )
  {
    var RequestData = {
      "DiveType" : DT
    }

    console.log(RequestData);


    this._diveService.getCheckList(RequestData).subscribe( res =>{
      this.viewChecklist = false ; 
      this.OptionalList = res.Optional;
      this.EquipmentList = res.Equipment;
      this.viewChecklist = true ; 
    });


  }

  goToEdit(){
    console.log("in edit func");
    this.router.navigate(["/edit-profile"]);
  }


}

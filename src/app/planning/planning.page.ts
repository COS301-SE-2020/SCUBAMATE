import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
})
export class PlanningPage implements OnInit {

  // Global Variables
  DiveTypeLst: []; 
  OptionalList : String[];
  EquipmentList : String[];

  viewChecklist : Boolean = false ;
  showLoading: Boolean;

  ////

  loginLabel:string ;

  constructor(public alertController : AlertController ,private router: Router, private _accountService: accountService,  private _diveService: diveService) { }

  ngOnInit() {
    this.showLoading = false;
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }

    this._diveService.getDiveTypes("*").subscribe(
      data => {
          console.log(data);
          this.DiveTypeLst = data.ReturnedList ; 
          console.log("In type");
          this.showLoading = false;

      }
    ); //end DiveType req

  }

  ionViewWillEnter(){
    this.showLoading = false;
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

  onChooseDive( DT: string , event: Event  )
  {
    this.showLoading= true;
    var RequestData = {
      "DiveType" : DT
    }

    console.log(RequestData);

    this.showLoading= true;
    this._diveService.getCheckList(RequestData).subscribe( res =>{
      this.viewChecklist = false ; 
      this.OptionalList = res.Optional;
      this.EquipmentList = res.Equipment;
      this.viewChecklist = true ; 
      this.showLoading= false;
    });


  }



}

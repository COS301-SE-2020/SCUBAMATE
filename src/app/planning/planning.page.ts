import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { AlertController } from '@ionic/angular';



export interface CkeckListItemObj {
  Val : String ;
  Checked : Boolean; 
}

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
})
export class PlanningPage implements OnInit {

  // Global Variables
  DiveTypeLst: []; 
  OptionalReceived : String[];
  EquipmentReceived : String[];

  EquipmentList : CkeckListItemObj[] = new Array(); 
  OptionalList : CkeckListItemObj[] = new Array(); 

  viewChecklist : Boolean = false ;
  showLoading: Boolean;

  SearchDiveCheckList : String;

  viewAddInput : Boolean = false; 
  viewPersonalAdded : Boolean = false ; 
  PersonalList :  CkeckListItemObj[] = new Array(); 
  itemToAdd : String ; 

  ////

  loginLabel:string ;

  constructor(public alertController : AlertController ,private router: Router, private _accountService: accountService,  private _diveService: diveService) { }

  ngOnInit() {
  this.itemToAdd = "";
  this.SearchDiveCheckList = "" ;
    this.showLoading = false;
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }

   

  }

  ionViewWillEnter(){
    this.itemToAdd = "" ;
    this.SearchDiveCheckList = "" ;
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
      "DiveType" : this.SearchDiveCheckList
    }

    console.log(RequestData);

    this.showLoading= true;
    this._diveService.getCheckList(RequestData).subscribe( res =>{
    console.log(res);
      this.viewChecklist = false ; 
      this.OptionalReceived= res.Optional;
      this.EquipmentReceived = res.Equipment;


      //setup checklist object
      this.OptionalList.length = this.OptionalReceived.length;
      for( var x = 0 ; x < this.OptionalReceived.length ; x++){
        this.OptionalList[x] = {
          Val : this.OptionalReceived[x],
          Checked : false
        } as CkeckListItemObj ;
      }

      this.EquipmentList.length = this.EquipmentReceived.length;
      for( var x = 0 ; x < this.EquipmentList.length ; x++){
        this.EquipmentList[x] = {
          Val : this.EquipmentReceived[x],
          Checked : false
        } as CkeckListItemObj ;
      }

      ///



      this.viewChecklist = true ; 
      this.showLoading= false;
    });


  }

  divetypeListFinder( inText : string){
    console.log(inText);
    if(inText.length >= 3){
      this.showLoading = true;
      this._diveService.getDiveTypes(inText).subscribe(
        data => {
            console.log(data);
            this.DiveTypeLst = data.ReturnedList ; 
            this.showLoading = false;
  
        }
      ); //end DiveType req
    }
  }

  ShowCurrentList(){
    console.log("In");
    console.log(this.OptionalList);
  }

  toggleCheckList(){
    this.viewChecklist = !this.viewChecklist ; 
  }

  showAddInput(){
    this.viewAddInput = true ; 
  }

  addItem(){
    this.showLoading = true ;

    if(this.itemToAdd.length > 0)
    {
        var len = this.PersonalList.length;

          this.PersonalList[len] = {
            Val : this.itemToAdd ,
            Checked : false
          } as CkeckListItemObj;
        
        
        this.viewPersonalAdded = true ;
        this.viewAddInput = false ;
        this.itemToAdd = ""; 
        this.viewChecklist = true;
    }

   
    this.showLoading = false ;

  }

}

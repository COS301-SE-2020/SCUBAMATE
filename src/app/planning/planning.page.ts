import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { AlertController } from '@ionic/angular';



export interface CkeckListItemObj {
  Val : String ;
  Checked : Boolean; 
}

export interface CourseObj {
  MinAgeRequired: number,
  RequiredCourses: string[],
  CourseType: string,
  QualificationType: string,
  Name: string,
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

  suggestedCourseFullList: CourseObj[] = new Array(); 
  suggestedCourseThreeList: CourseObj[] = new Array(); 

  showCourses : boolean ;

  ////

  loginLabel:string ;

  constructor(public alertController : AlertController ,private router: Router, private _accountService: accountService,  private _diveService: diveService) { }

  ngOnInit() {
  this.showCourses = false ;
  this.itemToAdd = "";
  this.SearchDiveCheckList = "" ;
    this.showLoading = false;
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
    }


    //get Suggested Courses
    this._diveService.getSuggestedCourses().subscribe(res =>{
      console.log("Suggestions Received")
      this.suggestedCourseFullList = res.Courses;

      this.getRandomThreeCourses();
      
    });


    //get Custom CheckList If it exists
    this._accountService.getCustomChecklist().subscribe(res =>{
      
      console.log(res);
      
      if(res.Equipment){
        console.log("Custom List Received");


        this.EquipmentList = res.Equipment ; 
        this.OptionalList = res.Optional ;

        if(res.Custom.length > 0 ){
          this.PersonalList = res.Custom ;
          this.viewPersonalAdded = true; 

        }else{
          this.viewPersonalAdded = false; 

        }

        this.viewChecklist = true;
      }else{
        console.log("No Custom List Yet");
        this.viewChecklist = false;
      }
      

    }, err =>{
      this.viewChecklist = false;
      this.viewPersonalAdded = false; 
    });
  
    

  }

  ionViewWillEnter(){
    this.itemToAdd = "" ;
    this.SearchDiveCheckList = "" ;
    this.showLoading = false;
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
    }

    //get Suggested Courses
    this._diveService.getSuggestedCourses().subscribe(res =>{
      console.log("Suggestions Received")
      this.suggestedCourseFullList = res;
    });

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

  divetypeListFinder( ){
  
    if(this.SearchDiveCheckList.length >= 3){
      this.showLoading = true;
      this._diveService.getDiveTypes(this.SearchDiveCheckList).subscribe(
        data => {
            console.log(data);
            this.DiveTypeLst = data.ReturnedList ; 
            this.showLoading = false;
  
        }
      ); //end DiveType req
    }
  }


  toggleCheckList(){
    this.viewChecklist = !this.viewChecklist ; 
  }

  showAddInput(){
    this.viewAddInput = !this.viewAddInput  ; 
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

  
   

  generateRandom(max : number){
    return Math.floor(Math.random()*(max-1)+1);
  }

  getRandomThreeCourses(){
    this.showCourses = false ;
      var l1 = this.generateRandom(this.suggestedCourseFullList.length);
      var l2 = this.generateRandom(this.suggestedCourseFullList.length);
      var l3 = this.generateRandom(this.suggestedCourseFullList.length);

      if((l3 == l1) || (l3 == l2) || (l1 == l2))
      {
        while((l3 == l1) || (l3 == l2) || (l1 == l2) ){
          if(l3 == l1){
            l3 = this.generateRandom(this.suggestedCourseFullList.length);
          }else if( l3 == l2 ){
            l2 = this.generateRandom(this.suggestedCourseFullList.length);
          }else{
            l1 = this.generateRandom(this.suggestedCourseFullList.length);
          }
        }
      }



     
      this.suggestedCourseThreeList[0] = this.suggestedCourseFullList[l1];
      this.suggestedCourseThreeList[1] = this.suggestedCourseFullList[l2];
      this.suggestedCourseThreeList[2] = this.suggestedCourseFullList[l3];

    this.showCourses = true ;
  }


  async presentAlertOk( ) {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: 'Checklist Saved',
      message:  'Checklist saved for future use',
      buttons: ['Done']
    });
  
    await alert.present();

  }


  async presentAlertFail( ) {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: 'Checklist Not Saved',
      subHeader: 'Oops! Something went wrong' ,
      message:  'Please retry saving checklist',
      buttons: ['Continue']
    });
  
    await alert.present();

  }

  saveChecklist(){

    if(!this.viewPersonalAdded){
      this.PersonalList = []; 
    }

    var customList = {
      "AccessToken": localStorage.getItem("accessToken"),
      "Equipment": this.EquipmentList ,
      "Optional": this.OptionalList , 
      "Custom" : this.PersonalList
    } ;

    console.log(customList);


    this._accountService.storeCustomChecklist(customList).subscribe( res => {
        console.log(res);
        this.presentAlertOk();
    }, err =>{
        this.presentAlertFail();
    });



  }

  

}

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
  accountType : string;

  //SurveyAnswers
  surveyAnswers : string[] = new Array();

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
    if(localStorage.getItem("accessToken")){
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

    //get Suggested Courses
    this._diveService.getSuggestedCourses().subscribe(res =>{
      console.log("Suggestions Received")
      this.suggestedCourseFullList = res.Courses;

      this.getRandomThreeCourses();
      
    }, err=>{
      if(err.error == "Invalid Access Token"){
        localStorage.removeItem("accessToken");
        this.router.navigate(['login']);
      }
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
      if(err.error == "Invalid Access Token"){
        localStorage.removeItem("accessToken");
        this.router.navigate(['login']);
      }

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
    if(localStorage.getItem("accessToken")){
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
      this.accountType = "*Diver";
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

  async presentSurveyQ1() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Survey.',
      subHeader: 'Question 1 of 5',
      message: ' What do you love most about diving?',
      inputs: [
        {
          name: 'Q1A',
          type: 'radio',
          label: 'A: Underwater breathing',
          value: 'a' ,
          checked: true
        },
        {
          name: 'Q1B',
          type: 'radio',
          label: 'B: Making new friends ',
          value: 'b'
        },
        {
          name: 'Q1C',
          type: 'radio',
          label: 'C: Seeing a new world ',
          value: 'c'
        },
        {
          name: 'Q1D',
          type: 'radio',
          label: 'D: The cool scuba gear',
          value: 'd'
        },
        {
          name: 'Q1E',
          type: 'radio',
          label: 'E: Neutral buoyancy  ',
          value: 'e'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel Survey');
          }
        }, {
          text: 'Next',
          handler: data => {
            console.log(data);
            this.surveyAnswers.push(data); 
            this.presentSurveyQ2();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentSurveyQ2() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Survey.',
      subHeader: 'Question 2 of 5',
      message: 'What are you thinking while diving a Shipwreck?',
      inputs: [
        {
          name: 'Q1A',
          type: 'radio',
          label: 'A: Let’s explore below deck!',
          value: 'a' ,
          checked: true
        },
        {
          name: 'Q1B',
          type: 'radio',
          label: 'B: I can’t stand the pollution down here',
          value: 'b'
        },
        {
          name: 'Q1C',
          type: 'radio',
          label: 'C: I wonder what this looked like before it sank?',
          value: 'c'
        },
        {
          name: 'Q1D',
          type: 'radio',
          label: 'D: This tech is awesome!',
          value: 'd'
        },
        {
          name: 'Q1E',
          type: 'radio',
          label: 'E: Time to practice my wreck diving skills',
          value: 'e'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel Survey');
          }
        }, {
          text: 'Next',
          handler: data => {
            console.log(data);
            this.surveyAnswers.push(data); 
            this.presentSurveyQ3();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentSurveyQ3() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Survey.',
      subHeader: 'Question 3 of 5',
      message: 'What’s your preference for your next trip?',
      inputs: [
        {
          name: 'Q1A',
          type: 'radio',
          label: 'A: I want excitement',
          value: 'a' ,
          checked: true
        },
        {
          name: 'Q1B',
          type: 'radio',
          label: 'B: Somewhere with underwater creatures',
          value: 'b'
        },
        {
          name: 'Q1C',
          type: 'radio',
          label: 'C: The scenery is most important',
          value: 'c'
        },
        {
          name: 'Q1D',
          type: 'radio',
          label: 'D: All I need is Wifi',
          value: 'd'
        },
        {
          name: 'Q1E',
          type: 'radio',
          label: 'E: I want to learn something new',
          value: 'e'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel Survey');
          }
        }, {
          text: 'Next',
          handler: data => {
            console.log(data);
            this.surveyAnswers.push(data); 
            this.presentSurveyQ4();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentSurveyQ4() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Survey.',
      subHeader: 'Question 4 of 5',
      message: 'What’s your favourite dive activity?',
      inputs: [
        {
          name: 'Q1A',
          type: 'radio',
          label: 'A: Planning the next trip',
          value: 'a' ,
          checked: true
        },
        {
          name: 'Q1B',
          type: 'radio',
          label: 'B: Sharing my experiences',
          value: 'b'
        },
        {
          name: 'Q1C',
          type: 'radio',
          label: 'C: The thrill of exploration',
          value: 'c'
        },
        {
          name: 'Q1D',
          type: 'radio',
          label: 'D: Uploading my dive profile',
          value: 'd'
        },
        {
          name: 'Q1E',
          type: 'radio',
          label: 'E: Reminiscing about past experiences',
          value: 'e'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel Survey');
          }
        }, {
          text: 'Next',
          handler: data => {
            console.log(data);
            this.surveyAnswers.push(data); 
            this.presentSurveyQ5();
          }
        }
      ]
    });

    await alert.present();
  }


  async presentSurveyQ5() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Survey.',
      subHeader: 'Question 5 of 5',
      message: 'Which scuba career appeals most?',
      inputs: [
        {
          name: 'Q1A',
          type: 'radio',
          label: 'A: Stunt diver',
          value: 'a' ,
          checked: true
        },
        {
          name: 'Q1B',
          type: 'radio',
          label: 'B: Underwater conservationist',
          value: 'b'
        },
        {
          name: 'Q1C',
          type: 'radio',
          label: 'C: Expedition diver',
          value: 'c'
        },
        {
          name: 'Q1D',
          type: 'radio',
          label: 'D: Gear testing',
          value: 'd'
        },
        {
          name: 'Q1E',
          type: 'radio',
          label: 'E: PADI Instructor',
          value: 'e'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel Survey');
          }
        }, {
          text: 'Done',
          handler: data => {
            console.log(data);
            this.surveyAnswers.push(data); 
            this.completeSurvey();
          }
        }
      ]
    });

    await alert.present();
  }

  completeSurvey(){

      var answers ={
        "AccessToken": localStorage.getItem("accessToken"),
        "Q1" : this.surveyAnswers[0],
        "Q2" : this.surveyAnswers[1],
        "Q3" : this.surveyAnswers[2],
        "Q4" : this.surveyAnswers[3],
        "Q5" : this.surveyAnswers[4]
      }

      console.log(answers);


      this.showLoading = true;

      this._diveService.sendCourseSurveyAnswers(answers).subscribe(res=> {
        console.log(res);
        this.showLoading= false;

        this.presentAlertSuggestedCourse(res.Items[0].CourseType, res.Items[0].Name ,res.Items[0].QualificationType );

      }, err =>{
        this.showLoading= false;
      });

  }

  async presentAlertSuggestedCourse( CT : string, CN: string, QT: string ) {
    const alert = await this.alertController.create({
      header: CT,
      subHeader: 'Qualification Needed: ' + QT  ,
      message: CN ,
      buttons: ['Done']
    });
  
    await alert.present();

  }

  

}

import { Component, OnInit } from '@angular/core';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import * as CryptoJS from 'crypto-js';  
import { UUID } from 'angular2-uuid';
import { Binary } from '@angular/compiler';
import { Router } from '@angular/router';


//forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';

export interface SignUpDiver {
  AccountGuid: string;
  DateOfBirth : string ;
  Email: string ;
  FirstName: string;
  LastName: string;
  Password: string;
  ProfilePhoto: string;
  PublicStatus: boolean;
  Courses: string[];
}

export interface SignInstructor {
  AccountGuid: string;
  DateOfBirth : string ;
  Email: string ;
  FirstName: string;
  LastName: string;
  Password: string;
  ProfilePhoto: string;
  PublicStatus: boolean;
  InstructorNumber: string;
  DiveCentre: string;
  Courses: string[];
}


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

 /*********************************************
                Global Variables
  *********************************************/
 uuidValue:string;
 base64textString : string;
 showLoading : Boolean = false; 
 showSpecialization: Boolean = false;
 SpecializationLst : string[];
 QualificationLst: string[];
 CenterLst : string[];
 userSpecialisation : string[];
 specialisationInputField: string = "";

  //which type of account
  signUpDiver: Boolean = false;
  signUpInstructor: Boolean = false ; 
  ShowAccountChoice : Boolean = true;

   //Form Groups
  diverForm;
  instructorForm;

  //Signup Objects 
  diverObj: SignUpDiver;
  instructorObj  : SignInstructor;
  
  //Page navigation
  DiverFirstPageVisible : boolean ;
  DiverSecondPageVisible: boolean;
  DiverThirdPageVisible: boolean;
  DiverFourthPageVisible: boolean;

  InstructorFirstPageVisible : boolean ;
  InstructorSecondPageVisible: boolean;
  InstructorThirdPageVisible: boolean;
  InstructorFourthPageVisible: boolean;

  //course 
  CourseLst : string[];
  showCourses: Boolean = false;
  userCourses : string[];
  courseInputField: string = "";
  courseValid: Boolean;

  /********************************************/

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string ) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
    }
  }

  constructor(private _diveService: diveService,  private _accountService : accountService,  private router: Router, public formBuilder: FormBuilder, public alertController : AlertController) {

    
    //generate GUID
    this.uuidValue=UUID.UUID();


    //Diver Form
    this.diverObj ={
      AccountGuid: this.uuidValue, 
      DateOfBirth : "",
      Email: "",
      FirstName: "",
      LastName: "",
      Password: "",
      ProfilePhoto: "../assets/images/STDuser.jpg",
      PublicStatus: false ,
      Courses: []
    }

    this.diverForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.minLength(2), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.minLength(2), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.email , Validators.pattern('[A-Za-z0-9._%+-]{2,}@[a-zA-Z-_.]{2,}[.]{1}[a-zA-Z]{2,}'), Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')])],
      confirmPassword: ['', Validators.required],
      birthday: ['', Validators.required],
      profile: [],
      publicStatus: [] ,
      courses: [],
    }, {validator: this.matchingPasswords('password', 'confirmPassword')}); 


    //Instructor Form
    this.instructorObj ={
      AccountGuid: this.uuidValue, 
      DateOfBirth : "",
      Email: "",
      FirstName: "",
      LastName: "",
      Password: "",
      ProfilePhoto:  "../assets/images/STDuser.jpg",
      PublicStatus: false ,
      InstructorNumber: "",
      DiveCentre: "",
      Courses: []
    }

    this.instructorForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.minLength(2), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.minLength(2), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.email , Validators.pattern('[A-Za-z0-9._%+-]{2,}@[a-zA-Z-_.]{2,}[.]{1}[a-zA-Z]{2,}'), Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')])],
      confirmPassword: ['', Validators.required],
      birthday: ['', Validators.required],
      profile: [],
      publicStatus: [] ,
      courses: [],
      instructorNumber: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      diveCenter: ['', Validators.required]
    }, {validator: this.matchingPasswords('password', 'confirmPassword')}); 


  } //End of Constructor


  ngOnInit() {
    this.showSpecialization = false;
    this.userSpecialisation = new Array();
    this.signUpDiver = false;
    this.signUpInstructor = false;
    this.ShowAccountChoice = true;

    this.DiverFirstPageVisible = true;
    this.DiverSecondPageVisible = false;
    this.DiverThirdPageVisible = false;
    this.DiverFourthPageVisible = false;

    this.InstructorFirstPageVisible = true;
    this.InstructorSecondPageVisible = false;
    this.InstructorThirdPageVisible = false;
    this.InstructorFourthPageVisible = false;

    this.showCourses = false;
    this.userCourses = new Array();
    this.courseValid = false;
  }

  

  ShowRelatedForm(targetValue : string){
  console.log(targetValue);

  if(targetValue == "Diver"){
    this.signUpDiver = true;
    this.signUpInstructor = false;
  }else{
    this.signUpInstructor = true;
    this.signUpDiver = false;
  }
}

SpecializationListFinder(){

 if(this.specialisationInputField.length >= 2)
{
    this.showLoading = true;
    this._accountService.getSpecializations(this.specialisationInputField).subscribe(
      data => {
        console.log("Specialisation search for: " + this.specialisationInputField);
          console.log(data);
          this.SpecializationLst = data.ReturnedList ; 
          this.showLoading = false;
      }
    ); //end Buddy req
}

}

QualificationListFinder(eventValue: string){

if(eventValue.length >= 2)
{
  this.showLoading = true;
  this._accountService.getQualifications(eventValue).subscribe(
    data => {
      console.log(eventValue);
        console.log(data);
        this.QualificationLst = data.ReturnedList ; 
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
        console.log(eventValue);
          console.log(data);
          this.CenterLst = data.ReturnedList ; 
          this.showLoading = false;
      }
    ); //end Buddy req
}

}

addSpecialisation(s : string){
 if(s != "")
 {
  const index: number = this.userSpecialisation.indexOf(s);
  if (index == -1) {
    this.userSpecialisation.push(s);
    this.showSpecialization = true;
  }
   this.specialisationInputField = "";
 }

 console.log("Specialisation Added: ");
 console.log(this.userSpecialisation);
 
}

removeSpecialisation(s : string){
  const index: number = this.userSpecialisation.indexOf(s);
  if (index !== -1) {
    this.userSpecialisation.splice(index, 1);
  }  

  this.SpecializationLst = [] ;
}

async presentAlert() {
  const alert = await this.alertController.create({
    cssClass: 'errorAlert',
    header: 'Invalid Signup',
    message: 'Please provide all required information to complete the signup',
    buttons: ['OK']
  });

  await alert.present();
}

async presentAlertEmail() {
  const alert = await this.alertController.create({
    cssClass: 'errorAlert',
    header: 'Invalid Signup',
    message: 'Email is already in use. <br> Please provide a different Email',
    buttons: ['OK']
  });

  await alert.present();
}

async presentAlertEmailSent( userEmail ) {
  const alert = await this.alertController.create({
    cssClass: 'errorAlert',
    header: 'Signup Successful',
    subHeader: 'Please validate Email',
    message: 'An OTP has been sent to: <br>' + userEmail ,
    buttons: ['OK']
  });

  await alert.present();
}


DiverSubmit(){
  this.diverObj.Courses = this.userCourses;
  console.log(this.diverObj);

  if(!this.diverForm.valid ){
    this.presentAlert();
  }else{
   
    this.diverObj.Courses = this.userCourses;
    this._accountService.insertUserDiver( this.diverObj ).subscribe( res =>{
      console.log("Sending Diver Info");
      
      this.showLoading = true;
      this._accountService.sendValidationEmail(this.diverObj.Email).subscribe( res => {
        this.showLoading = false;
        this.presentAlertEmailSent(this.diverObj.Email);

        this.router.navigate(['login']);
      });
    },  err => this.presentAlertEmail()); 


  }


}


InstructorSubmit(){
  this.instructorObj.Courses = this.userCourses;
console.log(this.instructorObj);
  if(!this.instructorForm.valid){
    this.presentAlert();
  }else{
    
    
    
    this._accountService.insertUserInstructor( this.instructorObj ).subscribe( res =>{
      console.log("Sending Instructor Info");
      
      this.showLoading = true;
      this._accountService.sendValidationEmail(this.instructorObj.Email).subscribe( res => {
        this.showLoading = false;
        this.presentAlertEmailSent(this.instructorObj.Email);

        this.router.navigate(['login']);
      });
    },  err => this.presentAlertEmail()); 


  }
}



///new code
nextPage(){
  
  if(this.signUpDiver)
  {
    if(this.DiverFirstPageVisible){
     
      this.DiverFirstPageVisible = false;
      this.DiverSecondPageVisible = true;
      this.DiverThirdPageVisible = false;
    }else if(this.DiverSecondPageVisible){
      this.DiverFirstPageVisible = false;
      this.DiverSecondPageVisible = false;
      this.DiverThirdPageVisible = true;
    }else if (this.DiverThirdPageVisible){
      this.DiverFirstPageVisible = false;
      this.DiverSecondPageVisible = false;
      this.DiverThirdPageVisible = true;
    }


  }else{  //Instructor Pages

    if(this.InstructorFirstPageVisible){
     
      this.InstructorFirstPageVisible = false;
      this.InstructorSecondPageVisible = true;
      this.InstructorThirdPageVisible = false;
      this.InstructorFourthPageVisible = false;
    }else if(this.InstructorSecondPageVisible){
      this.InstructorFirstPageVisible = false;
      this.InstructorSecondPageVisible = false;
      this.InstructorThirdPageVisible = true;
      this.InstructorFourthPageVisible = false;
    }else if (this.InstructorThirdPageVisible){
      this.InstructorFirstPageVisible = false;
      this.InstructorSecondPageVisible = false;
      this.InstructorThirdPageVisible = false;
      this.InstructorFourthPageVisible = true;
    }
    



  }
    
}

previousPage(){
  

  if(this.signUpDiver)
  {
      if(this.DiverFirstPageVisible){
        this.DiverFirstPageVisible = true;
        this.DiverSecondPageVisible = false;
        this.DiverThirdPageVisible = false;
      }else if(this.DiverSecondPageVisible){
        this.DiverFirstPageVisible = true;
        this.DiverSecondPageVisible = false;
        this.DiverThirdPageVisible = false;
      }else if (this.DiverThirdPageVisible){
        this.DiverFirstPageVisible = false;
        this.DiverSecondPageVisible = true;
        this.DiverThirdPageVisible = false;
      }
   }else{ //instructor pages
    if(this.InstructorFirstPageVisible){
      this.InstructorFirstPageVisible = true;
      this.InstructorSecondPageVisible = false;
      this.InstructorThirdPageVisible = false;
      this.InstructorFourthPageVisible = false;
    }else if(this.InstructorSecondPageVisible){
      this.InstructorFirstPageVisible = true;
      this.InstructorSecondPageVisible = false;
      this.InstructorThirdPageVisible = false;
      this.InstructorFourthPageVisible = false;
    }else if (this.InstructorThirdPageVisible){
      this.InstructorFirstPageVisible = false;
      this.InstructorSecondPageVisible = true;
      this.InstructorThirdPageVisible = false;
      this.InstructorFourthPageVisible = false;
    }else if (this.InstructorFourthPageVisible){
      this.InstructorFirstPageVisible = false;
      this.InstructorSecondPageVisible = false;
      this.InstructorThirdPageVisible = true;
      this.InstructorFourthPageVisible = false;
    }
   }
}

onFileSelected(event) {
  let me = this;
  let file = event.target.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    //console.log(reader.result);
    let s = reader.result ; 
    me.base64textString = reader.result.toString() ;

    console.log(me.diverObj.ProfilePhoto);
    if(me.signUpDiver){
      me.diverObj.ProfilePhoto = me.base64textString;
    }else{
      me.instructorObj.ProfilePhoto = me.base64textString;
    }
    
    console.log(me.diverObj.ProfilePhoto);
   
    
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

CourseListFinder(){

  if(this.courseInputField.length >= 2)
 {
     this.showLoading = true;
     this._diveService.getDiveCourses(this.courseInputField).subscribe(
       data => {
         console.log("Course search for: " + this.courseInputField);
           console.log(data);
           this.CourseLst = data.ReturnedList ; 
           this.showLoading = false;
       }
     ); //end Buddy req
 }
 
 }

 addCourse(){
  if(this.courseInputField.length >= 2)
  {
   const index: number = this.userCourses.indexOf(this.courseInputField);
   if (index == -1) {
     this.userCourses.push(this.courseInputField);
     this.showCourses = true;
   }
    this.courseInputField = "";
    this.courseValid = true;
  }
 
  console.log("Course Added: ");
  console.log(this.userCourses);
  
 }

 removeCourse(s : string){
  const index: number = this.userCourses.indexOf(s);
  if (index !== -1) {
    this.userCourses.splice(index, 1);

    if (this.userCourses.length == 0){
      this.courseValid = false;
    }
  }  

  this.CourseLst = [] ;
}


  

}

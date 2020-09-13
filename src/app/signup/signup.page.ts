import { Component, OnInit } from '@angular/core';

import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import * as CryptoJS from 'crypto-js';  
import { UUID } from 'angular2-uuid';
import { Binary } from '@angular/compiler';
import { Router } from '@angular/router';
import {ConnectionService} from 'ng-connection-service';
import { Location } from '@angular/common';


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
  CompletedCourses: string[];
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
  CompletedCourses: string[];
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {


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

  //Internet Connectivity check
  isConnected = true;  
  noInternetConnection: boolean;
  loginLabel:string = "Log In";

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

  constructor(private _diveService: diveService,  private _accountService : accountService,  private router: Router, public formBuilder: FormBuilder, public alertController : AlertController, private connectionService: ConnectionService, private location: Location) {

    
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
      CompletedCourses: []
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
      courses: []
    }, {validator: this.matchingPasswords('password', 'confirmPassword')}); 


    //Instructor Form
    this.instructorObj ={
      AccountGuid: this.uuidValue, 
      DateOfBirth : "",
      Email: "",
      FirstName: "",
      LastName: "",
      Password: "",
      ProfilePhoto: "../assets/images/STDuser.jpg",
      PublicStatus: false ,
      InstructorNumber: "",
      DiveCentre: "",
      CompletedCourses: [] 
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

    this.connectionService.monitor().subscribe(isConnected => {  
      this.isConnected = isConnected;  
      if (this.isConnected) {  
        this.noInternetConnection=false;
      }  
      else {  
        this.noInternetConnection=true;
        this.router.navigate(['no-internet']);
      }  
    });
  } //End of Constructor

  loginClick(){
    
      this.router.navigate(['login']);
    
  }


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
      
      //console.log(me.diverObj.ProfilePhoto);s
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  ShowRelatedForm(targetValue : string){
  //console.log(targetValue);

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
        //console.log(eventValue);
          //console.log(data);
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

 //console.log("Specialisation Added: ");
 //console.log(this.userSpecialisation);
 
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
    header: 'Signup Failed',
    message: 'Something went wrong. Please try again..',
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

async presentGeneralAlert(hd, msg) {
  const alert = await this.alertController.create({
    cssClass: 'errorAlert',
    header: hd,
    message: msg ,
    buttons: ['OK']
  });

  await alert.present();
}


DiverSubmit(){
  console.log(this.diverObj);

  if(!this.diverForm.valid  ){
    this.presentAlert();
  }else{
    this.showLoading = true;
    this.diverObj.CompletedCourses = this.userCourses ;
    
    this._accountService.insertUserDiver( this.diverObj ).subscribe( res =>{
      //console.log(res);
      localStorage.setItem("accessToken", res.AccessToken) ; 
      
      //console.log("Sending Diver Email");

      this.sendEmail(this.diverObj.Email);

    },  err =>{

      //this.presentAlertEmail() ;
      if(err.error){
        this.presentGeneralAlert("Failed Signup", err.error);
      }else{
        this.presentGeneralAlert("Failed Signup", "Signup request failed. Please try again later.");
      }
      this.showLoading = false;

    } ); 
  }


}


InstructorSubmit(){

  if(!this.instructorForm.valid  ){
    this.presentAlert();
  }else{
    this.instructorObj.CompletedCourses = this.userCourses ;
    console.log(this.instructorObj);
    
    this._accountService.insertUserInstructor( this.instructorObj ).subscribe( res =>{
      console.log(res);
      localStorage.setItem("accessToken", res.AccessToken) ; 

      console.log("Sending Instructor Info");
      
      this.showLoading = true;
     /* this._accountService.sendValidationEmail(this.instructorObj.Email).subscribe( res => {

        localStorage.setItem("otp", res.OTP) ; 
        this.showLoading = false;
        this.presentAlertEmailSent(this.instructorObj.Email);
        this.router.navigate(['home']);

      });*/
      this.sendEmail(this.instructorObj.Email);
    },  err => {
      //this.presentAlertEmail();
      this.showLoading = false;
      if(err.error){
        this.presentGeneralAlert("Failed Signup", err.error);
      }else{
        this.presentGeneralAlert("Failed Signup", "Signup request failed. Please try again later.");
      }
    }); 


  }
}

//Navigation of Pages
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

//Course List Operations
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


sendEmail( e : string){
     
  this.showLoading = true;
  this._accountService.sendValidationEmail(e).subscribe( res=>
    {
      console.log("Email Sent");
      localStorage.setItem("otp", res.OTP);
      this.showLoading = false;
      this.presentOTPPrompt(e);
    }, err =>{
      if(err.error){
        this.presentGeneralAlert("Failed to send OTP", err.error);
      }else{
        this.presentGeneralAlert("Failed to send OTP", "Could not send Email. Please retry validation on your profile page");
      }
      this.showLoading = false;
      this.router.navigate(['home']);
    });
}

sendVerifiedEmail(e : string ){
     
  this.showLoading = true;
  this._accountService.confirmEmailValidation(e).subscribe( res=>
    {
      console.log("Validated Email Sent");
      this.showLoading = false;
      this.router.navigate(['home']);
    });
}

async presentAlertOtpOk( e : string ) {
  const alert = await this.alertController.create({
    cssClass: 'errorAlert',
    header: 'Validation Complete',
    subHeader: 'Account Email Verified: ',
    message:  e,
    buttons: ['Done']
  });

  await alert.present();
  this.sendVerifiedEmail(e);
}

async presentAlertOtpWrong( e : string) {
  const alert = await this.alertController.create({
    cssClass: 'errorAlert',
    header: 'Validation Failed',
    subHeader: 'Account Email Not Validated',
    message: 'Invalid OTP provided' ,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Retry',
        handler: () => {
          console.log("Retry OTP" );
          this.sendEmail(e);
          

        }
      }
    ]
  });

  await alert.present();
}



async presentOTPPrompt(e : string) {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Email Verification',
    subHeader: 'A new OTP has been sent to: ',
    message:  e,
    inputs: [
      {
        name: 'otpEntered',
        type: 'text',
        placeholder: 'OTP Here'
      }
    ],
    buttons: [
      {
        text: 'Remind me Later',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
          this.router.navigate(['home']);
        }
      }, {
        text: 'Confirm',
        handler: data => {
          console.log(data);
          console.log("OTP Entered:" + data['otpEntered']);

          if(localStorage.getItem("otp")!= data['otpEntered']){
            this.presentAlertOtpWrong(e);
          }else{
            this.presentAlertOtpOk(e);
          }

        }
      }
    ]
  });

  await alert.present();
}


}

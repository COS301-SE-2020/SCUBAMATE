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
  Specialisation: string[];
  Qualification: string;
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
  Specialisation: string[];
  Qualification: string;
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
      ProfilePhoto: "",
      PublicStatus: false ,
      Specialisation: [],
      Qualification: "" 
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
      qualification: ['', Validators.required],
      specialisation: []
    }, {validator: this.matchingPasswords('password', 'confirmPassword')}); 


    //Instructor Form
    this.instructorObj ={
      AccountGuid: this.uuidValue, 
      DateOfBirth : "",
      Email: "",
      FirstName: "",
      LastName: "",
      Password: "",
      ProfilePhoto: "",
      PublicStatus: false ,
      InstructorNumber: "",
      DiveCentre: "",
      Specialisation: [],
      Qualification: "" 
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
      qualification: ['', Validators.required],
      specialisation: [],
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

      if(me.signUpDiver)
      {
        me.diverObj.ProfilePhoto = me.base64textString;
      }else{
        me.instructorObj.ProfilePhoto = me.base64textString;
      }
      
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
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
  console.log(this.diverObj);

  if(!this.diverForm.valid || this.userSpecialisation.length == 0 ){
    this.presentAlert();
  }else{
    this.diverObj.Specialisation = this.userSpecialisation ;
    
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

  if(!this.instructorForm.valid || this.userSpecialisation.length == 0 ){
    this.presentAlert();
  }else{
    this.instructorObj.Specialisation = this.userSpecialisation ;
    console.log(this.instructorObj);
    
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

  

}

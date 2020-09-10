import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';
import {ConnectionService} from 'ng-connection-service';
import { Location } from '@angular/common';
import { GlobalService } from "../global.service";

//forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';

export interface EditAccountClass {
  AccessToken: string;
  DateOfBirth : string ;
  ProfilePhoto: string,
  FirstName: string;
  LastName: string;
  PublicStatus: boolean;
}

export interface EditPasswordClass{
  AccessToken: string;
  Password : string ;
  Email : string ; 
}


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  /*********************************************
                Global Variables
  *********************************************/
  AD ;
  loginLabel:string ; 
  base64textString : string;

  //Forms
  userForm;
  userObj: EditAccountClass;

  passForm;
  passObj: EditPasswordClass ;

  //Viewable Content
  showData : Boolean = false;
  showLoading: Boolean = false;
  accountType : string;

  showUserAccount : Boolean = true ;
  showChangePassWord: Boolean = false ; 
 
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

   //Internet Connectivity check
  isConnected = true;  
  noInternetConnection: boolean;

  constructor(public _globalService: GlobalService, private _accountService : accountService, private router: Router, public formBuilder: FormBuilder, public alertController : AlertController, private connectionService: ConnectionService, private location: Location) {

    this.showLoading = true;
    this._accountService.getUser().subscribe(res => {


      this.passObj ={
        Password : "",
        AccessToken: localStorage.getItem("accessToken"),
        Email : res.Email 
      }

      this.AD = res;
      
          //User Form
          this.userObj ={
            AccessToken: localStorage.getItem("accessToken"),
            DateOfBirth : this.AD.DateOfBirth ,
            ProfilePhoto: this.AD.ProfilePhoto ,
            FirstName: this.AD.FirstName ,
            LastName: this.AD.LastName ,
            PublicStatus: this.AD.PublicStatus 
          }

          this.userForm = formBuilder.group({
            firstName: ['', Validators.compose([Validators.minLength(2), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            lastName: ['', Validators.compose([Validators.minLength(2), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            birthday: ['', Validators.required],
            profile: [],
            publicStatus: [] ,
          }); 

          
          this.showData = true;
          this.showLoading = false;
    
    });

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

    this.passForm = formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')])],
      confirmPassword: ['', Validators.required],
    }, {validator: this.matchingPasswords('password', 'confirmPassword')}); 


  }

  ngOnInit() {
    this.showUserAccount = true ;
    this.showChangePassWord = false;


    this.loginLabel ="Login";
    this.showData = false;
    if(!localStorage.getItem("accessToken"))
    {
      this.router.navigate(['login']);
      this.loginLabel = "Login";
    }else{
      
      this.loginLabel = "Log Out";
      this.accountType = this._globalService.accountRole; 
      
    }
    
  }

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken");
      this.accountType = "*Diver";
      this.router.navigate(['home']);
    }else{
      this.router.navigate(['login']);
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

      console.log(me.userObj.ProfilePhoto);
      me.userObj.ProfilePhoto = me.base64textString;
      console.log(me.userObj.ProfilePhoto);
     
      
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
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

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      cssClass: 'successAlert',
      header: 'Update Successful',
      message: 'All changes have been successfully applied',
      buttons: ['OK']
    });
  
    await alert.present();
  }

  UpdateSubmit(){
    if(!this.userForm.valid ){
      this.presentAlert();
    }else{
      console.log(this.userObj);
      this.showLoading = true;
      console.log(this.userObj.ProfilePhoto);
      this._accountService.editUser( this.userObj ).subscribe( res =>{
        
        this.showLoading = false;
        this.presentSuccessAlert();
        this.router.navigate(['profile']);
        
      });
  
  
    }
  }

  PasswordSubmit(){

    console.log(this.passObj);

    this._accountService.updateNewPassword(this.passObj).subscribe(res=>{
      this.presentPasswordSuccessAlert();
      this.router.navigate(['profile']);
    },err=>{
      this.presentPasswordFailAlert();
    });



  }


  async presentPasswordSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Password Changed',
      message: 'Successfully changed Password',
      buttons: ['OK']
    });
  
    await alert.present();
  }

  async presentPasswordFailAlert() {
    const alert = await this.alertController.create({
      header: 'Password Not Changed',
      message: 'Failed to update password. Please try again.',
      buttons: ['OK']
    });
  
    await alert.present();
  }

}

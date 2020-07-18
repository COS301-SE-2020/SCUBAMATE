import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';



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
  showData : Boolean = false;
  showLoading: Boolean = false;
  base64textString : string;

  userForm;
  userObj: EditAccountClass;
 
   /********************************************/

  constructor(private _accountService : accountService, private router: Router, public formBuilder: FormBuilder, public alertController : AlertController) {

    this.showLoading = true;
    this._accountService.getUser().subscribe(res => {
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
  }

  ngOnInit() {
    this.loginLabel ="Login";
    this.showData = false;
    if(!localStorage.getItem("accessToken"))
    {
      this.router.navigate(['login']);
      this.loginLabel = "Login";
    }else{
      
      this.loginLabel = "Sign Out";
      
    }
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

}

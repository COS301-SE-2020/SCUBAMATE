import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AgeValidator } from '../validators/age';
import { AlertController } from '@ionic/angular';
import { PRIMARY_OUTLET } from '@angular/router';


export interface UserValues{
  firstName: string
}

@Component({
  selector: 'app-temp',
  templateUrl: './temp.page.html',
  styleUrls: ['./temp.page.scss'],
})
export class TempPage implements OnInit {

  //Global Variables
  //myInput: string ;
  myForm; 



  inputValues: UserValues  ; 



  matchingPasswords(passwordKey: string, passwordConfirmationKey: string ) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
    }
  }

  constructor(public formBuilder: FormBuilder, public alertController : AlertController) { 

    this.inputValues = {
      firstName : ""
    }

    this.myForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      age: ['', AgeValidator.isValid], 
      email: ['', Validators.compose([Validators.email , Validators.pattern('[A-Za-z0-9._%+-]{2,}@[a-zA-Z-_.]{2,}[.]{1}[a-zA-Z]{2,}'), Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')])],
      confirmPassword: ['', Validators.required]},
      {validator: this.matchingPasswords('password', 'confirmPassword')}); 
    
    
    }/** End of Constructor */


  

  ngOnInit() {
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

  onSubmit(){

    if(!this.myForm.valid){
        this.presentAlert();
    }

  }

 

 


}


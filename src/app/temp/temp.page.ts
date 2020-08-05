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
  firstPageVisible : boolean ;
  secondPageVisible: boolean;
  thirdPageVisible: boolean;

  ProgressColor : string; 


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
    this.ProgressColor = "success"; 
    this.firstPageVisible = true;
    this.secondPageVisible = false;
    this.thirdPageVisible = false;

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
      this.ProgressColor = "danger";
        this.presentAlert();
        
    }

  }

  nextPage(){
    console.log("Next");

      if(this.firstPageVisible){
       
          this.firstPageVisible = false;
          this.secondPageVisible = true;
          this.thirdPageVisible = false;
        
        
      }else if(this.secondPageVisible){
        this.firstPageVisible = false;
        this.secondPageVisible = false;
        this.thirdPageVisible = true;
      }else if (this.thirdPageVisible){
        this.firstPageVisible = false;
        this.secondPageVisible = false;
        this.thirdPageVisible = true;
      }
  }

  previousPage(){
    console.log("Prev");
    if(this.firstPageVisible){
      this.firstPageVisible = true;
      this.secondPageVisible = false;
      this.thirdPageVisible = false;
    }else if(this.secondPageVisible){
      this.firstPageVisible = true;
      this.secondPageVisible = false;
      this.thirdPageVisible = false;
    }else if (this.thirdPageVisible){
      this.firstPageVisible = false;
      this.secondPageVisible = true;
      this.thirdPageVisible = false;
    }
  }

 


}


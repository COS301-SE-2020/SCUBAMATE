import { Component, OnInit } from '@angular/core';
import { accountService } from '../service/account.service';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';

//forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';



export interface UpgradeClass {
  AccessToken: string;
  InstructorNumber: string ;
  DiveCentre: string;
}

@Component({
  selector: 'app-upgrade-instructor',
  templateUrl: './upgrade-instructor.page.html',
  styleUrls: ['./upgrade-instructor.page.scss'],
})
export class UpgradeInstructorPage implements OnInit {

  /*********************************************
                Global Variables
  *********************************************/
  loginLabel:string ;
  userForm;
  userObj: UpgradeClass;
  CenterLst : string[];
  showLoading: boolean;


  /********************************************/

  constructor(private _diveService: diveService, private _accountService : accountService, private router: Router, public formBuilder: FormBuilder, public alertController : AlertController) { 
       //User Form
    this.userObj ={
      AccessToken: localStorage.getItem("accessToken"),
      InstructorNumber: "" ,
      DiveCentre: ""
    }

    this.userForm = formBuilder.group({
      instructorNumber: ['', Validators.compose([Validators.minLength(2), Validators.required])],
      diveCenter: ['', Validators.compose([Validators.minLength(2), Validators.required])],
    }); 


  }

  ngOnInit() {
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

   async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: 'Invalid Upgrade',
      message: 'Please provide all required information to complete the Upgrade',
      buttons: ['OK']
    });
  
    await alert.present();
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      cssClass: 'successAlert',
      header: 'Upgrade Successful',
      message: 'Pending upgrade validation',
      buttons: ['OK']
    });
  
    await alert.present();
  }


  UpgradeSubmit(){

    if(!this.userForm.valid){
      this.presentAlert();
    }else{

      this.showLoading = true ;


      this._accountService.upgradeToInstructor(this.userObj).subscribe( res =>{

        console.log(res);
        this.showLoading = false;
        this.presentSuccessAlert();
        this.router.navigate(['profile']);
      })


    }

  }

}

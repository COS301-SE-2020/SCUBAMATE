import { Component, OnInit } from '@angular/core';

import { accountService } from '../service/account.service';
import * as CryptoJS from 'crypto-js';  
import { UUID } from 'angular2-uuid';
import { Binary } from '@angular/compiler';
import { Router } from '@angular/router';



export interface SignUpClass {
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

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(private _accountService : accountService, private router: Router) { }

  uuidValue:string;
  base64textString : string;
  showLoading : Boolean = false; 
  showSpecialization: Boolean = false;
  SpecializationLst : string[];
  QualificationLst: string[];

  userSpecialisation : string[];

  //form control


  ngOnInit() {
    this.showSpecialization = false;
    this.userSpecialisation = new Array();
  }

  SpecializationListFinder(eventValue: string){

    if(eventValue.length >= 2)
   {
       this.showLoading = true;
       this._accountService.getSpecializations(eventValue).subscribe(
         data => {
           console.log(eventValue);
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

  addSpecialisation(s : string){
    this.userSpecialisation.push(s);
    this.showSpecialization = true;
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
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }


  onSubmit(Qual: string, Spec: string , bDay:string,  FName: string , LName: string, pub: boolean, emailI: string, Pass: string, cPass: string, event : Event) {

    if( Pass != cPass ) //test that passwords match
    {
      alert("Passwords do not match");
    }else if(  (FName =="") ||  (LName ==="") || (emailI=="") || (Pass=="") || (cPass=="") ){  //test empty fields
      alert("Empty fields provided. \nPlease fill in all the fields");
    }else{
      //generate GUID
      this.uuidValue=UUID.UUID();
      
      //create object to send
      var attemptLogin = {
        AccountGuid : this.uuidValue,  
        FirstName: FName,
        LastName: LName,
        Email: emailI,
        DateOfBirth : bDay ,
        Password: Pass,  
        ProfilePhoto: this.base64textString,   //"meep.jpg",
        PublicStatus: pub ,
        Specialisation: this.userSpecialisation , 
        Qualification: Qual 
      } as SignUpClass; 
        //send to API service 
        console.log(attemptLogin);

        this._accountService.insertUser( attemptLogin ).subscribe( res =>{
          console.log("in res");
          console.log(res);
          this.router.navigate(['login']);
        }); 
    }

     
  }






}

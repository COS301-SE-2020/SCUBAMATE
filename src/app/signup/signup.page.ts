import { Component, OnInit } from '@angular/core';

import { accountService } from '../service/account.service';
import * as CryptoJS from 'crypto-js';  
import { UUID } from 'angular2-uuid';
import { Binary } from '@angular/compiler';


export interface SignUpClass {
  ItemType: string ;
  AccountGuid: string;
  AccountType: string ;
  DateOfBirth : string ;
  Email: string ;
  FirstName: string;
  LastName: string;
  Password: string;
  ProfilePhoto: string; //File ;
  PublicStatus: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(private _accountService : accountService) { }

  uuidValue:string;
  selectedFile:File = null;

  ngOnInit() {
    
  }

  onFileSelected(event){
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile);
  }


  onSubmit(bDay:string, aType : string, FName: string , LName: string, pub: boolean, emailI: string, Pass: string, cPass: string, event : Event) {
   // event.preventDefault();


    if( Pass != cPass ) //test that passwords match
    {
      alert("Passwords do not match");
    }else if( (aType=="") || (FName =="") ||  (LName ==="") || (emailI=="") || (Pass=="") || (cPass=="") ){  //test empty fields
      alert("Empty fields provided. \nPlease fill in all the fields");
    }else{


      // Set status to a string value
      let pStat: string ;
      if( pub == true){
         pStat = "true";
      }else{
         pStat = "false" ; 
      }

      //encyrpt password
      let conversionEncryptOutput = CryptoJS.AES.encrypt( emailI.trim(), Pass.trim()).toString();

      //generate GUID
      this.uuidValue=UUID.UUID();
      console.log("GUID: " + this.uuidValue);
      
      //create object to send
      var attemptLogin = {
        ItemType: "A"+this.uuidValue , 
        AccountGuid : this.uuidValue,  
        AccountType:  aType ,
        FirstName: FName,
        LastName: LName,
        Email: emailI,
        DateOfBirth : bDay ,
        Password: conversionEncryptOutput,  
        ProfilePhoto: "test.jpg", //this.selectedFile ,
        PublicStatus: pStat 
      } as SignUpClass; 
        //send to API service 
        console.log(attemptLogin);
        this._accountService.insertUser( attemptLogin );  
    }

     
  }

}

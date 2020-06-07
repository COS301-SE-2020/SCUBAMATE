import { Component, OnInit } from '@angular/core';


export interface SignUpClass {
  AccountType: string ;
  FirstName: string;
  LastName: string;
  Password: string;
  Email: string ;
  PublicStats: boolean;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  onSubmit(aType : string, FName: string , LName: string, pub: boolean, emailI: string, Pass: string, cPass: string, event : Event) {
    event.preventDefault();

    if( Pass != cPass )
    {
      alert("Passwords do not match");
    }else if( (aType=="") || (FName =="") ||  (LName ==="") || (emailI=="") || (Pass=="") || (cPass=="") ){
      alert("Empty fields provided. \nPlease fill in all the fields");
    }else{
      var attemptLogin = {
        AccountType: aType ,
        FirstName: FName,
        LastName: LName,
        Password:Pass ,
        Email: emailI,
        PublicStats: pub } as SignUpClass; 
       console.log(attemptLogin);
  
     // this._sbrandService.deleteBrand(t);
    }

     
  }

}

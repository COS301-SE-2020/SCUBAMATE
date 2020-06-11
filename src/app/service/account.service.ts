import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class accountService
{
    constructor(private httpClient : HttpClient , private router: Router){}


    insertUser(postData){
        //console.log(postData);

      const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
          };

        this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/UpdatedSignup/user', postData, options ).toPromise().then( 
        data =>{
           console.log(data);
           this.router.navigate(['login']);
       }); 
    }


    logUser(postData): Observable<any>{
      console.log(postData);
      //localStorage.setItem('accessToken', 'meep');
      

   const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }) 
        };
      
        return this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/LoginPenultimate/login', postData, options );

      }
}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class accountService
{
    constructor(private httpClient : HttpClient , private router: Router){}


    insertUser(postData): Observable<any>{
        //console.log(postData);

      const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
          };

          //SignUp works
        //return this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/UserAccountFull/user', postData, options );
    
          var response = this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/UserAccountFull/user', postData, options );
        return response;
          /**  if (HttpErrorResponse){
            alert("Email already in use");
            location.reload();
          }else{
            return response;
          }*/
    
      }


    logUser(postData): Observable<any>{
    
   const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }) 
        };
      
        return this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/LoginPenultimate/login', postData, options );

      }


    getUser(): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }) 
      };

      let lS =  localStorage.getItem("accessToken") ;
      var PostData = {
        "AccessToken" : lS
      }
      return this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/getUser/getuser', PostData, options );
 
    }

    editUser(PostData): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }) 
      };


      return this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/getUser/edituser', PostData, options );
 
    }

    lookAheadBuddy(entry : String): Observable<any>{

      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          })
        };

      var  body= {
          "ItemType" : "A" ,
          "UserEntry" : entry
        } ;
        console.log("Buddy Req");
        console.log(body);

       return this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/getUser/lookbuddy',body, options);
    }

}
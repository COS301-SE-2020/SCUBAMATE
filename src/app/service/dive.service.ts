import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class diveService
{
    constructor(private httpClient : HttpClient , private router: Router){}

    getDiveSites(): Observable<any>{

        const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
          };

        var  body= {
            "ItemType" : "DiveSites" 
          } ;

         return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/DiveTypesAndSitesAdded/divelist',body, options);
    }

    getDiveTypes(): Observable<any>{

        const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
          };

        var  body= {
            "ItemType" : "DiveTypes" 
          } ;

         return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/DiveTypesAndSitesAdded/divelist',body, options);
    }


    logDive(PostData): Observable<any>{
      	console.log("in req");
        const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
          };
        
          //https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/UpdatedModel/divelog
          //https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/DiveLogs/
         return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/DiveLogs/divelog', PostData , options); 


    }

    getPrivateDive(): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
    
        let lS =  localStorage.getItem("accessToken") ;
      var PostData = {
        "AccessToken" : lS
      }

      console.log(PostData);
        //https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/FixedDiveHistory/getpersonaldivelogs
        //
     return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/DiveLogs/getpersonaldivelogs', PostData , options); 

    }

}
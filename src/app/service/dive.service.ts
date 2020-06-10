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

}
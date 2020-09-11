import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable()
export class chartService
{
    constructor(private httpClient : HttpClient , private router: Router){}

    numberDivesAtSiteChartData(postData): Observable<any>{
    
        const options = {
               headers: new HttpHeaders({
                 'Content-Type': 'application/json',
               }) 
             };
           
    return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/LatestAPI/getdivestats', postData, options );
     
    }

    peakTimesDivesAtSiteChartData(postData): Observable<any>{
    
      const options = {
             headers: new HttpHeaders({
               'Content-Type': 'application/json',
             }) 
           };
         
    return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/LatestAPI/getpeektimes', postData, options );
   
  }

    ratingAtDiveSiteChartData(postData): Observable<any>{
    
      const options = {
             headers: new HttpHeaders({
               'Content-Type': 'application/json',
             }) 
           };
         
  return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/LatestAPI/getdivesiteratings', postData, options );
   
  }


  ageGroupChartData(postData): Observable<any>{
    
    const options = {
           headers: new HttpHeaders({
             'Content-Type': 'application/json',
           }) 
         };
       
return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/LatestAPI/getagegroups', postData, options );
 
}

  numberUsersInRoles(postData): Observable<any>{
    
    const options = {
           headers: new HttpHeaders({
             'Content-Type': 'application/json',
           }) 
         };
       
    return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/LatestAPI/getuserrolestats', postData, options );
 
}


}
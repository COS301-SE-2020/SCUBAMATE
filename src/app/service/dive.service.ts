import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class diveService
{
    constructor(private httpClient : HttpClient , private router: Router){}



    getDiveTypes(entry : String): Observable<any>{

      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
        };

      var  body= {
          "ItemType" : "DT" ,
          "UserEntry" : entry
        } ;

       return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/LatestDiveAPI/divelist',body, options);
    }

    getDiveSites(entry : String): Observable<any>{

      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
        };

      var  body= {
          "ItemType" : "DS" ,
          "UserEntry" : entry
        } ;

       return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/LatestDiveAPI/divelist',body, options);
    }

    getExtendedDiveSites(entry : String, pageNumber: number): Observable<any>{

      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
        };

      var  body= {
          "ItemType" : "DS"  ,
          "UserEntry" : entry ,
          "PageNum" : pageNumber
        } ;

    return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/LatestDiveAPI/getdivecentres',body, options);
    }

    getSingleDiveSite(name : String): Observable<any>{

      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
        };

      var  body= {
          "ItemType" : "DS"  ,
          "Name" : name ,
        } ;

        console.log(body);

        return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/LatestAPI/getsingledivecentreorsite',body, options);
    }

    getDiveCourses(entry : String): Observable<any>{

      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
        };

      var  body= {
          "ItemType" : "C" ,
          "UserEntry" : entry
        } ;

       return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/LatestDiveAPI/divelist',body, options);
    }



    getDiveCenters(entry : String): Observable<any>{

      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
        };

      var  body= {
          "ItemType" : "DC"  ,
          "UserEntry" : entry
        } ;
        return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/DiveTypesAndSitesAdded/divelist',body, options);
    }

    getExtendedDiveCenters(entry : String, pageNumber: number): Observable<any>{

          const options = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              })
            };

          var  body= {
              "ItemType" : "DC"  ,
              "UserEntry" : entry ,
              "PageNum" : pageNumber
            } ;

        return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/LatestDiveAPI/getdivecentres',body, options);
    }

    getAdminDiveCenter(PostData): Observable<any>{
      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
        };
      
       return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/LatestAPI/getadmindc', PostData , options); 
  }
    
    getSingleDiveCenter(name : String): Observable<any>{

      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
        };

      var  body= {
          "ItemType" : "DC"  ,
          "Name" : name ,
        } ;

    return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/LatestAPI/getsingledivecentreorsite',body, options);
}


    logDive(PostData): Observable<any>{
      	console.log("in req");
        const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            })
          };
        
         return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/LatestDiveAPI/divelog', PostData , options); 


    }

    getPrivateDive(): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      };
    
        let lS =  localStorage.getItem("accessToken") ;
      var PostData = {
        "AccessToken" : lS
      }

      console.log(PostData);
        //https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/FixedDiveHistory/getpersonaldivelogs
        //
     return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/LatestDiveAPI/getpersonaldivelogs', PostData , options); 

    }

    getCheckList(PostData): Observable<any>{
      console.log("in req");
      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
        };
      
       return this.httpClient.post('https://a8dptkt6md.execute-api.af-south-1.amazonaws.com/ChecklistPen/checklist', PostData , options); 


    }

    getIndividualDive(PostData): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      };

     return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/LatestDiveAPI/getsingledive', PostData , options); 
   
    }

    updateDive(PostData): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      };

     return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/LatestDiveAPI/editdives', PostData , options); 
   
    }

    getPublicDives(pageNumber: number): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      };
    
      var PostData = {
        "AccessToken" : localStorage.getItem("accessToken"),
        "PageNum" : pageNumber
      }
      return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/LatestDiveAPI/getpublicdives', PostData , options); 

    }

    getSuggestedCourses(): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      };
    
      var PostData = {
        "AccessToken" : localStorage.getItem("accessToken")
      }

      return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/LatestDiveAPI/gettodocourselist', PostData , options); 

    }

    getUnverifiedCourses(): Observable<any>{

      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      };
    
      var PostData = {
        "AccessToken" : localStorage.getItem("accessToken")
      }

      return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/LatestAPI/getunverifiedcourses', PostData , options); 

    }

    VerifyCourse(PostData): Observable<any>{

      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      };
    
     

      return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/LatestAPI/confirmcourse', PostData , options); 



    }

    sendCourseSurveyAnswers(PostData):Observable<any>{

      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      };
      return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/LatestDiveAPI/coursesurvey', PostData , options); 

    }

    editBasicDiveCentre(PostData):Observable<any>{

      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      };
      return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/DiveCentre/editdivecentreinfo', PostData , options); 

    }

    addCoursesToDiveCentre(PostData):Observable<any>{

      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      };
      return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/DiveCentre/addcoursetodivecentre', PostData , options); 

    }

    addDiveSitesToCentre(PostData):Observable<any>{

      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      };
      return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/DiveCentre/adddivesitetodivecentre', PostData , options); 

    }

    createNewCourse(PostData):Observable<any>{

      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      };
      return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/LatestAPI/addcourse', PostData , options); 

    }

    createNewSite(PostData):Observable<any>{

      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      };
      return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/LatestAPI/adddivesite', PostData , options); 

    }

}
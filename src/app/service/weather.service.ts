import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable()
export class weatherService
{
    constructor(private httpClient : HttpClient , private router: Router){}

    getLogWeather(locationKey): Observable<any>{
        const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          })
        };
       return this.httpClient.get('http://dataservice.accuweather.com/forecasts/v1/daily/1day/'+locationKey.key+'?apikey=uF3LU0UljaHxJrAP3QkEthAD3Pdjwh3g&language=en-US&details=true&metric=true');
  }

  getLocationKey(Coordinates): Observable<any>{
     const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.httpClient.get('http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=uF3LU0UljaHxJrAP3QkEthAD3Pdjwh3g&q='+Coordinates.Latitude+','+Coordinates.Longitude+'&language=en-US&details=false&toplevel=true');
}
}
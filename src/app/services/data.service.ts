import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * @ignore
 */
@Injectable({
  providedIn: 'root'
})


export class DataService {


  /**
   * 
   * @param http inject the HTTPClient Dependency
   */
  constructor(private http: HttpClient) {
  }

  /**
   * 
   * @param endPoint this dual function method can accept endPoint in format of endpoint OR endpoint/{id}
   * @returns the retrieved data
   */
  processData(endPoint:string){
    return this.http.get(environment.baseURL + endPoint);
  }
}

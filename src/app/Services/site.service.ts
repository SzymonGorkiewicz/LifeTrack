import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(private http:HttpClient, private auth: AuthService) { }
  api_url = 'http://localhost:8000/api/'


  getDays(){
    let user = this.auth.getUser();

    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    return this.http.get(`${this.api_url}week/`,{headers})
  }

  getMealsForDay(dayId: number){
    let user = this.auth.getUser();

    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    return this.http.get(`${this.api_url}meals/${dayId}/`,{headers});
  }
}

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

  getProductsForMeal(mealId: number){
    let user = this.auth.getUser();

    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    return this.http.get(`${this.api_url}meals/${mealId}/products`,{headers});

  }

  AddProductForMeal(product_name:string, mealID:number){
    let user = this.auth.getUser();

    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    return this.http.post(`${this.api_url}product/${product_name}/${mealID}/`,null,{headers});
  }

  saveGramature(product_id: number, gramature: number, mealID: number){
    let user = this.auth.getUser();
    
    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    return this.http.post(`${this.api_url}meal/${product_id}/${mealID}/`,{gramature},{headers});
  }

  getGramature(product_id: number, mealID: number){
    let user = this.auth.getUser();
    
    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    return this.http.get(`${this.api_url}meal/${product_id}/${mealID}/`,{headers});
  }

  deleteProductFromMeal(product_id: number, mealID: number){
    let user = this.auth.getUser();
    
    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    return this.http.delete(`${this.api_url}meal/${product_id}/${mealID}/`,{headers});
  }

  getUserBodyStats(user_id:number){
    let user = this.auth.getUser();
    
    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    return this.http.get(`${this.api_url}graphs/${user_id}/`,{headers});
  }

  AddBodyStatistic(data:any, user_id:number){
    let user = this.auth.getUser();
    
    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });
    
    return this.http.post(`${this.api_url}graphs/${user_id}/`, data, {headers})

  }

  DeleteBodyStatistic(stat_ID:number){
    let user = this.auth.getUser();
  

    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });
    
    return this.http.delete(`${this.api_url}stats/${stat_ID}/`, {headers})

  }

  ActualizeDays(date:string){
    let user = this.auth.getUser();
    

    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    return this.http.post(`${this.api_url}actualize/${date}/`, {}, {headers})


  }
}

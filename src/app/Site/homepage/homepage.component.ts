import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { SiteService } from '../../Services/site.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  constructor(private authservice: AuthService,private router: Router,private site: SiteService){}
  days:any[] = [];
  meals: any[] = [];
  meals_products: any[] = [];
  gramatures: any[]= [];
  merged_products_list: any[] = [];
  clickedDayId: number | null = null;
  clickedMeal: number | null = null;
  productName:string = "";
  
  mergedList:any[]= [];
  ngOnInit(){
    this.getDaysForHomePage();
    this.restoreClickedDayAndMeal();
  }


  Logout(){
    this.authservice.Logout().subscribe((data:any) =>{
      
      localStorage.removeItem('user');
     
      this.router.navigate(['login']).then(() => {
          location.reload();
      });
      
    },(error:any)=>{
      console.error(error);
      
    })
  }

  restoreClickedDayAndMeal() {
    const storedDayId = localStorage.getItem('clickedDayId');
    const storedMealId = localStorage.getItem('clickedMealId');

    if (storedDayId) {
      this.clickedDayId = +storedDayId; 
      this.getMealsForDay(this.clickedDayId);
    }

    if (storedMealId) {
      this.clickedMeal = +storedMealId; 
      this.onMealClick(this.clickedMeal);
    }
  }

  getDaysForHomePage(){
    this.site.getDays().subscribe((data:any) =>{
      this.days = data;
      //this.setDefaultClickedDayId();
    },(error:any)=>{
      console.error(error);
      
    })
  }

  // setDefaultClickedDayId() {
  //   const today = new Date().toISOString().split('T')[0]; 
  //   const todayDay = this.days.find(day => day.date === today);
    
  //   if (todayDay) {
  //     this.clickedDayId = todayDay.id;
  //   }
  //   this.getMealsForDay(todayDay.id);
  // }

  onDayClick(id:number){
    this.clickedDayId = id;
    localStorage.setItem('clickedDayId', String(this.clickedDayId));
    this.getMealsForDay(id);
  }
  
  getMealsForDay(dayId: number) {
    this.site.getMealsForDay(dayId).subscribe((data: any) => {
        this.meals = data;
        
      },(error:any)=>{
        console.error(error);
      })
  }


  onMealClick(mealId: number) {
    this.clickedMeal = mealId;
    localStorage.setItem('clickedMealId', String(this.clickedMeal));
    this.site.getProductsForMeal(mealId).pipe(
      switchMap((products: any) => {
        this.meals_products = products.products;
        return this.site.getGramature(1, mealId);
      })
    ).subscribe(
      (gramatures: any) => {
        this.gramatures = gramatures;
        this.mergedList = this.mergeProductList(this.meals_products, this.gramatures);
        console.log(this.mergedList);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  


  

  AddProductToMeal(productname: string, mealID:any){
    if (!mealID) {
      console.error('No meal selected');
      return;
    }
    this.site.AddProductForMeal(productname, mealID).subscribe((data: any) => {
      location.reload();
    },(error:any)=>{
      console.error(error);
    })
  }

  saveGramature(productId: number, gramature: number, mealID:any){
    this.site.saveGramature(productId, gramature, mealID).subscribe((data: any) => {
      
    },(error:any)=>{
      console.error(error);
    })
  }

  
  getGramature(productId: number, mealID: any): Observable<any> {
    return this.site.getGramature(productId, mealID);
  }
  

  mergeProductList(products: any[], gramatures: any[]):any[]{
    return products.map(product => {
      const gramatureRecord = gramatures.find(g => g.product === product.id);
      if (gramatureRecord) {
          return { ...product, gramature: gramatureRecord.gramature };
      }
      return { ...product, gramature: 100 }; 
  });
    

  }
  
  
}

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
  mealClicked: boolean = false;
  mergedList:any[]= [];
  ngOnInit(){
    this.getDaysForHomePage();
    this.restoreClickedDayAndMeal();
  }


  Logout(){
    this.authservice.Logout().subscribe((data:any) =>{
      
      localStorage.removeItem('user');
      localStorage.removeItem('clickedDayId');
      localStorage.removeItem('clickedMealId');
     
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
    this.mealClicked = true;
  }

  getDaysForHomePage(){
    this.site.getDays().subscribe((data:any) =>{
      this.days = data;
      
    },(error:any)=>{
      console.error(error);
      
    })
  }

  onDayClick(id:number){
    this.clickedDayId = id;
    localStorage.setItem('clickedDayId', String(this.clickedDayId));
    this.getMealsForDay(id);
    this.mealClicked = false;
  }
  
  toggleMealClick(mealId: number) {
    if (this.clickedMeal === mealId) {
      this.clickedMeal = null; // Odkliknięcie posiłku
      this.mealClicked = false;
    } else {
      this.clickedMeal = mealId; // Kliknięcie na posiłek
      this.mealClicked = true;
      this.onMealClick(this.clickedMeal);
    }
    localStorage.setItem('clickedMealId', String(this.clickedMeal));
    
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

  calculateTotalNutrients() {
    if (!this.mergedList || this.mergedList.length === 0) {
      return {
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        calories: 0
      };
    }
  
   
    let totalProtein = 0;
    let totalCarbohydrates = 0;
    let totalFat = 0;
    let totalCalories = 0;
  
    
    this.mergedList.forEach(product => {
      totalProtein += (product.protein_per_100g * product.gramature / 100);
      totalCarbohydrates += (product.carbohydrates_per_100g * product.gramature / 100);
      totalFat += (product.fat_per_100g * product.gramature / 100);
      totalCalories += (product.calories_per_100g * product.gramature / 100);
    });
  
    // Zaokrąglenie wyników do 2 miejsc po przecinku
    totalProtein = parseFloat(totalProtein.toFixed(2));
    totalCarbohydrates = parseFloat(totalCarbohydrates.toFixed(2));
    totalFat = parseFloat(totalFat.toFixed(2));
    totalCalories = parseFloat(totalCalories.toFixed(2));
  
    return {
      protein: totalProtein,
      carbohydrates: totalCarbohydrates,
      fat: totalFat,
      calories: totalCalories
    };
  }

  DeleteProductFromMeal(productid:number,mealid:number|null){
    if (mealid){
      this.site.deleteProductFromMeal(productid, mealid).subscribe((data: any) => {
        location.reload()
        
      },(error:any)=>{
        console.error(error);
      })
    }  
  }
}

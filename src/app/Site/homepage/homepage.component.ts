import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { SiteService } from '../../Services/site.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ChartType, registerables} from 'chart.js';
Chart.register(...registerables)

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
  //merged_products_list: any[] = [];
  clickedDayId: number | null = null;
  clickedMeal: number | null = null;
  productName:string = "";
  mealClicked: boolean = false;
  mergedList:any[]= [];
  error_message:string|null = null
  chart:any
  
  ngOnInit(){
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Miesiące są zerowane (0-11)
    const day = String(today.getDate()).padStart(2, '0');

    let formattedDate = `${year}-${month}-${day}`;
    this.ActualizeDays(formattedDate)
    this.getDaysForHomePage();
    this.restoreClickedDayAndMeal();
   
  }

  ActualizeDays(date:string){
    this.site.ActualizeDays(date).subscribe((data:any) =>{
      console.log(data)
      
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
      this.clickedMeal = null; 
      this.mealClicked = false;
    } else {
      this.clickedMeal = mealId; 
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
    if (this.chart){
      this.chart.destroy()
    }
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
        this.GenerateGraph()
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
      this.error_message = null
      //document.getElementById('addproduct').value = '';
      data['gramature'] = 100
      this.mergedList.push(data)
      this.UpdateGraphData()
    },(error:any)=>{
      console.error(error);
      this.error_message = "Product doesnt exist"
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
        this.mergedList = this.mergedList.filter(item => item.id!==productid)
        this.UpdateGraphData()
      },(error:any)=>{
        console.error(error);
      })
    }  
  }

  UpdateGraphData(){
    const nutrients = this.calculateTotalNutrients();

    const data = [nutrients.protein, nutrients.carbohydrates, nutrients.fat];

    this.chart.data.labels = ['Protein', 'Carbohydrates', 'Fat'];
    this.chart.data.datasets[0].data = data;
  
    this.chart.update();
  }



  GenerateGraph(){
    const nutrients = this.calculateTotalNutrients();
    const data: ChartData = {
      labels: ['Protein', 'Carbohydrates', 'Fat'],
      datasets: [{
        data: [nutrients.protein, nutrients.carbohydrates, nutrients.fat],
        backgroundColor: [
          'rgba(7, 0, 219, 0.6)',
          'rgba(219, 0, 0, 0.6)',
          'rgba(252, 246, 58, 0.6)',
          
        ],
        borderColor: [
          'rgba(7, 0, 219, 1)',
          'rgba(219, 0, 0, 1)',
          'rgba(252, 246, 58, 1)',
          
        ],
        borderWidth: 1
      }]
    };

    const options: ChartOptions = {
      responsive: false,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Nutrient Distribution'
        }
      }
    };

    const config: ChartConfiguration = {
      type: 'doughnut', // Use 'pie' for a pie chart instead
      data: data,
      options: options
    };

    const ctx = document.getElementById('myChartCanva') as HTMLCanvasElement;
    this.chart = new Chart(ctx, config);
  }
}

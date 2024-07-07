import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { SiteService } from '../../Services/site.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  constructor(private authservice: AuthService,private router: Router,private site: SiteService){}
  days:any[] = [];
  meals: any[] = [];
  clickedDayId: number | null = null;

  ngOnInit(){
    this.getDaysForHomePage();
    
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

  getDaysForHomePage(){
    this.site.getDays().subscribe((data:any) =>{
      this.days = data;
      this.setDefaultClickedDayId();
      
      
      
    },(error:any)=>{
      console.error(error);
      
    })
  }

  setDefaultClickedDayId() {
    const today = new Date().toISOString().split('T')[0]; 
    const todayDay = this.days.find(day => day.date === today);
    
    if (todayDay) {
      this.clickedDayId = todayDay.id;
    }
    this.getMealsForDay(todayDay.id);
  }

  onDayClick(id:number){
    this.clickedDayId = id;
    this.getMealsForDay(id);
  }
  
  getMealsForDay(dayId: number) {
    this.site.getMealsForDay(dayId).subscribe((data: any) => {
        this.meals = data;
        console.log(data)
      },(error:any)=>{
        console.error(error);
      })
  }
}

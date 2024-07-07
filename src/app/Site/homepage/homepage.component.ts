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
  ngOnInit(){
    console.log("skibidi");
    this.getDays();
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

  getDays(){
    this.site.getWeek().subscribe((data:any) =>{
      this.days = data
      console.log(this.days);
     
      
      
    },(error:any)=>{
      console.error(error);
      
    })
  }
}

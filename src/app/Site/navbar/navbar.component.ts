import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(private authservice: AuthService,private router: Router){}


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
}

import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { delay } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  errorMessage:string = ''
  successMessage:string = ''
  constructor(private authService: AuthService,private router: Router) {}
  onSubmit(form: NgForm) {
    let data = {
      "username" : form.value.username,
      "password" : form.value.password,
      "first_name": form.value.firstname,
      "last_name": form.value.lastname,
      "email": form.value.email,
    };
    
    this.authService.register(data).subscribe((data:any)=>{
      
      this.successMessage = 'Registered successfully';
      this.errorMessage = ''; 
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000); 
      

      
      
    },(error:any) =>{
      this.errorMessage = 'Fill all the fields';
      this.successMessage = ''; 
      console.error(this.errorMessage);
      
      form.reset();
      
      
    });
  }
}

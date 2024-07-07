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
  constructor(private authService: AuthService,private router: Router) {}
  onSubmit(form: NgForm) {
    let data = {
      "username" : form.value.username,
      "password" : form.value.password,
      "first_name": form.value.firstname,
      "last_name": form.value.lastname,
      "email": form.value.email,
    };
    console.log(data)
    this.authService.register(data).subscribe((data:any)=>{
      
      this.errorMessage = "registered succesfully"
      

      this.router.navigate(['/login']);

      
      
    },(error:any) =>{
      this.errorMessage = 'Fill all the fields';
      console.error(this.errorMessage);
      
      form.reset();
      
      
    });
  }
}

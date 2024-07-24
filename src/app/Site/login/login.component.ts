import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
interface User {
  token : string;
  user_id : number;
  firstname: string;
  lastname : string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string='';
  constructor(private authService: AuthService,private router: Router) {}
  user : User = { token: '', user_id: 0 ,firstname: '', lastname:''};
  
  onSubmit(form: NgForm) {
    let data = {
      "username" : form.value.username,
      "password" : form.value.password,
      
    };
    
    this.authService.login(data).subscribe((data:any)=>{
      console.log(data)
      this.user.token = data.token;
      this.user.user_id = data.user_id;
      this.user.firstname = data.firstname;
      this.user.lastname = data.lastname;

      this.successMessage = 'Logged in succesfully!';
      this.errorMessage = '';
      localStorage.setItem('user',JSON.stringify(this.user));
      setTimeout(() => {
        this.router.navigate(['/homepage']);
      }, 2000); 
      
    },(error:any) =>{
      this.errorMessage = 'Invalid credentials!';
      this.successMessage = '';
      console.error(this.errorMessage);
      
      form.reset();
      
      
    });
  }
}

import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Frontend';
  showNavbar: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // List of routes where navbar should be hidden
        const hideNavbarRoutes = ['/login', '/register'];
        this.showNavbar = !hideNavbarRoutes.includes(event.urlAfterRedirects);
      }
    });
  }
}

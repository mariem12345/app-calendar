import { Component } from '@angular/core';
import { Auth, User } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
    isMenuOpen = false;
  
    constructor(public auth: Auth) {}
  
    toggleMenu(): void {
      this.isMenuOpen = !this.isMenuOpen;
    }
  
    logout(): void {
      this.auth.logout();
      this.isMenuOpen = false;
    }
  
    get currentUser(): User | null {
      return this.auth.getCurrentUser();
    }
  
    get isAdmin(): boolean {
      return this.auth.isAdmin();
    }
}

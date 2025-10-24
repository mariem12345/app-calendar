import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from './core/services/auth';
import { Navbar } from './core/components/navbar/navbar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'prueba-tecnica-angular';

  constructor(private authService: Auth) {}

  isAuthenticated(): boolean {
    return this.authService.getCurrentUser() !== null;
  }
}
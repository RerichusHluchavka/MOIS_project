import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonInput,
  IonLabel,
  IonText,
  IonButton,
  IonSpinner
} from '@ionic/angular/standalone';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonInput,
    IonLabel,
    IonText,
    IonButton,
    IonSpinner
  ]
})
export class LoginPage implements OnInit {

  username = '';
  password = '';

  loading = false;
  errorMessage: string | null = null;

  private readonly AUTH_URL = 'http://localhost/api/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {}


  onLogin() {
    this.errorMessage = null;
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password.';
      return;
    }

    this.loading = true;

    this.http.post<any>(this.AUTH_URL, {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
      
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.user.role);
        localStorage.setItem('username', response.user.username);
      
        this.loading = false;
      
        this.router.navigate(['/tabs/dashboard']);
      },
      
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = 'Invalid credentials';
        this.loading = false;
      }
    });
  }
}

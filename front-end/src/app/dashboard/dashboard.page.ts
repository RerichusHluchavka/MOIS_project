import { Component, OnInit } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonNote, IonText,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonSpinner
} from '@ionic/angular/standalone';

import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface TodayMenuItem {
  food_id: number;
  cost: number;
  portions_available: number;
  food_name?: string;
}

interface TodayMenuResponse {
  success: boolean;
  data: TodayMenuItem[];
  count?: number;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonNote, IonText,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonSpinner,
    HttpClientModule
  ]
})
export class DashboardPage implements OnInit {

  private readonly API_URL = 'http://localhost/api/kitchen';

  loadingStorage = false;
  storageError: string | null = null;

  mealsARemaining: number | null = null;
  mealsBRemaining: number | null = null;
  mealsCRemaining: number | null = null;

  cellStats: { cell: string; count: number }[] = [];


  cellMap: Record<number, string> = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F'
  };


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadStorage();
  }
  

  loadStorage() {
    this.loadingStorage = true;
    this.storageError = null;

    const token = localStorage.getItem('access_token') || localStorage.getItem('token');

    if (!token) {
      this.storageError = 'Nejste přihlášen – chybí access token.';
      this.loadingStorage = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<TodayMenuResponse>(`${this.API_URL}/today-menu`, { headers }).subscribe({
      next: (res) => {
        const menu = res.data ?? [];

        this.mealsARemaining = menu[0]?.portions_available ?? 0;
        this.mealsBRemaining = menu[1]?.portions_available ?? 0;
        this.mealsCRemaining = menu[2]?.portions_available ?? 0;

        this.loadingStorage = false;
      },
      error: (err) => {
        console.error(err);
        this.storageError = 'Nepodařilo se načíst data skladu.';
        this.loadingStorage = false;
      }
    });
  }
}

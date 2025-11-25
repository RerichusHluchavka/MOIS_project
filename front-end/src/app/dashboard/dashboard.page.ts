import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonNote, IonText,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonNote, IonText,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle
  ]
})
export class DashboardPage {}

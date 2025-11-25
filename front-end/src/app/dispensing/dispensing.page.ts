import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonLabel, IonInput, IonButton,
  IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dispensing',
  standalone: true,
  templateUrl: './dispensing.page.html',
  styleUrls: ['./dispensing.page.scss'],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonLabel, IonInput, IonButton,
    IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    FormsModule, CommonModule
  ]
})
export class DispensingPage {
  consumerNumber = '';
  status: 'issued' | 'denied' | null = null;
  reason = '';

  checkConsumer() {
    if (this.consumerNumber === '12345') {
      this.status = 'issued';
      this.reason = '';
    } else {
      this.status = 'denied';
      this.reason = 'Consumer not eligible or already served.';
    }
  }
}

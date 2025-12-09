import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonLabel, IonInput, IonButton,
  IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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

  consumerNumber: number | null = null;

  status: 'issued' | 'denied' | null = null;
  reason = '';

  // 🔴 zatím napevno – např. Food menu 1
  foodId = 1;

  private readonly PRISON_API = 'http://localhost/api/prison';
  private readonly KITCHEN_API = 'http://localhost/api/kitchen';

  constructor(private http: HttpClient) {}

  async checkConsumer() {
    this.status = null;
    this.reason = '';

    if (!this.consumerNumber) {
      this.status = 'denied';
      this.reason = 'Consumer number is required';
      return;
    }

    try {
      // 1️⃣ ověření že vězeň existuje
      await this.http.get(
        `${this.PRISON_API}/prisoners/${this.consumerNumber}`
      ).toPromise();

      // 2️⃣ ověření alergií
      const allergyResult: any = await this.http.get(
        `${this.KITCHEN_API}/food/${this.foodId}/prisoner/${this.consumerNumber}`
      ).toPromise();

      if (allergyResult?.isAllergic === true) {
        this.status = 'denied';
        this.reason = 'Consumer is allergic to this meal';
        return;
      }

      // 3️⃣ odečtení porce
      await this.http.patch(
        `${this.KITCHEN_API}/today-menu/${this.foodId}/decrease-portions`,
        { amount: 1 }
      ).toPromise();

      this.status = 'issued';

    } catch (err: any) {
      console.error(err);
      this.status = 'denied';
      this.reason = 'Consumer not eligible or service error';
    }
  }
}

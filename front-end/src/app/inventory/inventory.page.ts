import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton,
  IonSelect, IonSelectOption, IonGrid, IonRow, IonCol
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonButton,
    IonSelect, IonSelectOption, IonGrid, IonRow, IonCol,
    FormsModule
  ]
})
export class InventoryPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton,
  IonSelect, IonSelectOption, IonGrid, IonRow, IonCol,
  IonIcon, IonSpinner
} from '@ionic/angular/standalone';

import { HttpClient } from '@angular/common/http';

export interface InventoryItem {
  item_id: number;
  name: string;
  unit: string;
  quantity: number;
}

interface ItemsResponse {
  success: boolean;
  data: InventoryItem[];
  count: number;
}

interface ItemResponse {
  success: boolean;
  data: InventoryItem;
  message?: string;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonButton,
    IonSelect, IonSelectOption, IonGrid, IonRow, IonCol,
    IonIcon, IonSpinner
  ]
})
export class InventoryPage implements OnInit {

  items: InventoryItem[] = [];
  loading = false;
  saving = false;
  error: string | null = null;
  formError: string | null = null;

  isAddMode = false;
  isEditMode = false;

  formItem: { id?: number; name: string; unit: string; quantity: number } = {
    name: '',
    unit: '',
    quantity: 0
  };

  private readonly API_URL = 'http://localhost/api/inventory';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.error = null;

    this.http.get<ItemsResponse>(`${this.API_URL}/items`).subscribe({
      next: (res) => {
        this.items = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Nepodařilo se načíst inventory.';
        this.loading = false;
      }
    });
  }

  startAddItem() {
    console.log("asdsd");
    this.isAddMode = true;
    this.isEditMode = false;
    this.formError = null;
    this.formItem = {
      name: '',
      unit: '',
      quantity: 0
    };
  }

  startEditItem(item: InventoryItem) {
    this.isEditMode = true;
    this.isAddMode = false;
    this.formError = null;
    this.formItem = {
      id: item.item_id,
      name: item.name,
      unit: item.unit,
      quantity: item.quantity
    };
  }

  cancelForm() {
    this.isAddMode = false;
    this.isEditMode = false;
    this.formError = null;
    this.formItem = {
      name: '',
      unit: '',
      quantity: 0
    };
  }

  onSubmitItem() {
    this.formError = null;

    if (!this.formItem.name || !this.formItem.unit) {
      this.formError = 'Name a Unit jsou povinné.';
      return;
    }

    if (this.formItem.quantity < 0) {
      this.formError = 'Quantity nesmí být záporné.';
      return;
    }

    if (this.isAddMode) {
      this.createItem();
    } else if (this.isEditMode && this.formItem.id != null) {
      this.updateItem(this.formItem.id);
    }
  }

  private createItem() {
    this.saving = true;

    this.http.post<ItemResponse>(`${this.API_URL}/items`, {
      name: this.formItem.name,
      unit: this.formItem.unit,
      quantity: this.formItem.quantity
    }).subscribe({
      next: (res) => {
        this.items.push(res.data);
        this.saving = false;
        this.cancelForm();
      },
      error: (err) => {
        console.error(err);
        this.formError = 'Nepodařilo se vytvořit položku.';
        this.saving = false;
      }
    });
  }

  private updateItem(id: number) {
    this.saving = true;

    this.http.put<ItemResponse>(`${this.API_URL}/items/${id}`, {
      name: this.formItem.name,
      unit: this.formItem.unit,
      quantity: this.formItem.quantity
    }).subscribe({
      next: (res) => {
        const index = this.items.findIndex(i => i.item_id === id);
        if (index !== -1) {
          this.items[index] = res.data;
        }
        this.saving = false;
        this.cancelForm();
      },
      error: (err) => {
        console.error(err);
        this.formError = 'Nepodařilo se upravit položku.';
        this.saving = false;
      }
    });
  }
}

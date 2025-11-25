import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton,
  IonSelect, IonSelectOption, IonGrid, IonRow, IonCol
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

interface Customer {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'excluded';
}

@Component({
  selector: 'app-customers',
  standalone: true,
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonButton,
    IonSelect, IonSelectOption, IonGrid, IonRow, IonCol,
    FormsModule
  ]
})
export class CustomersPage {
  searchTerm = '';
  filter: 'all' | 'active' | 'inactive' | 'excluded' = 'all';

  customers: Customer[] = [
    { id: 101, name: 'John Smith', status: 'active' },
    { id: 102, name: 'Emma Brown', status: 'inactive' },
    { id: 103, name: 'Lucas White', status: 'excluded' },
    { id: 104, name: 'Sarah Johnson', status: 'active' },
  ];

  filteredCustomers = [...this.customers];

  applyFilters() {
    this.filteredCustomers = this.customers.filter(c => {
      const matchesSearch = this.searchTerm
        ? c.id.toString().includes(this.searchTerm)
        : true;
      const matchesFilter = this.filter === 'all' ? true : c.status === this.filter;
      return matchesSearch && matchesFilter;
    });
  }

  addNewCustomer() {
    alert('text!');
  }
}

import { Component, OnInit } from '@angular/core';
import {
  IonContent, IonTitle, IonToolbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton,
  IonSelect, IonSelectOption, IonGrid, IonRow, IonCol,
  IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import { ModalController, IonicModule } from '@ionic/angular';
import { FormModalComponent } from '../components/form-modal.component';
import { options } from 'ionicons/icons';

interface Prisoner {
  prisoner_id: number;
  first_name: string;
  last_name: string;
  credits: number;
  cell_id: number;
  entry_date: Date;
  release_date: Date;
  danger_level: number;
  religion: string;
}

interface PrisonersResponse {
  success: boolean;
  data: Prisoner[];
  count: number;
}

interface CellssResponse {
  success: boolean;
  data: Prisoner[];
  count: number;
}

interface PrisonerResponse {
  success: boolean;
  data: Prisoner;
  count: number;
}

@Component({
  selector: 'app-customers',
  standalone: true,
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormModalComponent,
    IonicModule
  ]
})

export class CustomersPage implements OnInit {
  prisoners: Prisoner[] = [];
  loading = false;
  saving = false;
  error: string | null = null;
  formError: string | null = null;
  cellIds: number[] = [];

  isAddMode = false;
  isEditMode = false;

  formPrisoner: Prisoner = {
    prisoner_id: 0,
    first_name: '',
    last_name: '',
    credits: 0,
    cell_id: 0,
    entry_date: new Date(),
    release_date: new Date(),
    danger_level: 0,
    religion: '',
  };

  private prisonerFormFields = [
    { key: 'first_name', label: 'First Name', type: 'text', required: true },
    { key: 'last_name', label: 'Last Name', type: 'text', required: true },
    { key: 'credits', label: 'Credits', type: 'number', required: true },
    { key: 'cell_id', label: 'Cell ID', type: 'select', required: true, options: this.cellIds},
    { key: 'entry_date', label: 'Entry Date', type: 'date', required: true },
    { key: 'release_date', label: 'Release Date', type: 'date', required: false },
    { key: 'danger_level', label: 'Danger Level', type: 'number', required: true },
    { key: 'religion', label: 'Religion', type: 'text', required: false }
  ];

  private readonly API_URL = 'http://localhost/api/prison';

  constructor(
    private http: HttpClient,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.loadPrisoners();
    this.loadCells();
  }

  loadCells() {
    this.loading = true;
    this.error = null;

    this.http.get<CellssResponse>(`${this.API_URL}/cells`).subscribe({
      next: (res) => {
        res.data.forEach(cell => {
          this.cellIds.push(cell.cell_id)
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Nepodařilo se načíst vězně.';
        this.loading = false;
      }
    });
  }

  loadPrisoners() {
    this.loading = true;
    this.error = null;

    this.http.get<PrisonersResponse>(`${this.API_URL}/prisoners`).subscribe({
      next: (res) => {
        this.prisoners = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Nepodařilo se načíst vězně.';
        this.loading = false;
      }
    });
  }

  startEditPrisoner(item: Prisoner) {
    this.isEditMode = true;
    this.isAddMode = false;
    this.formError = null;
    this.formPrisoner = {
      prisoner_id: 0,
      first_name: '',
      last_name: '',
      credits: 0,
      cell_id: 0,
      entry_date: new Date(),
      release_date: new Date(),
      danger_level: 0,
      religion: '',
    };
  }

  searchTerm = '';
  filter: 'all' | 'Muslim' | 'Christian' | 'Atheist' | 'Buddhist' | 'Jewish' | 'Hindu' = 'all';


  filteredPrisoners = [...this.prisoners];

  applyFilters() {
    this.filteredPrisoners = this.prisoners.filter(c => {
      const matchesSearch = this.searchTerm
        ? c.prisoner_id.toString().includes(this.searchTerm)
        : true;
      const matchesFilter = this.filter === 'all' ? true : c.religion === this.filter;
      return matchesSearch && matchesFilter;
    });
  }


  // Metoda pro otevření modalu
  async openItemModal(prisonerToEdit?: Prisoner) {

    // Nastavení dat (prázdná pro přidání, existující pro úpravu)
    const initialData: Prisoner = prisonerToEdit
      ? prisonerToEdit
      : {
        prisoner_id: 0,
        first_name: '',
        last_name: '',
        credits: 0,
        cell_id: 0,
        entry_date: new Date(),
        release_date: new Date(),
        danger_level: 0,
        religion: '',
      };

    const title = prisonerToEdit ? 'Edit Prisoner' : 'Add New Prisoner';

    const modal = await this.modalController.create({
      component: FormModalComponent,
      componentProps: {
        // DŮLEŽITÉ: Předáváme obě Input hodnoty
        formData: initialData,        // Původní data (naplnění formuláře)
        formFields: this.prisonerFormFields, // SCHÉMA POLÍ
        formTitle: title
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm' && data) {
      console.log('Form submitted with data:', data);

      // Zde implementujte logiku pro uložení dat:
      if (prisonerToEdit) {
        this.updatePrisoner(data);
      } else {
        this.createItem(data);
      }
    }
  }

  // Příklad, jak zavolat modal pro úpravu
  startEditItem(item: Prisoner) {
    this.openItemModal(item);
  }

  // Příklad, jak zavolat modal pro přidání
  startAddItem() {
    this.openItemModal();
  }

  deletePrisoner(id: number) {
    this.http.delete<PrisonerResponse>(`${this.API_URL}/prisoners/${id}`, {
    }).subscribe({
      next: (res) => {
        const index = this.prisoners.findIndex(i => i.prisoner_id === id);
        if (index !== -1) {
          this.prisoners.splice(index, 1);
        }
      },
      error: (err) => {
        console.error(err);
        this.formError = 'Nepodařilo se smazat položku.';
        this.saving = false;
      }
    });
  }

  private createItem(data: any) {
    this.saving = true;

    this.http.post<PrisonerResponse>(`${this.API_URL}/prisoners`, {
      first_name: data.first_name,
      last_name: data.last_name,
      credits: data.credits,
      cell_id: data.cell_id,
      entry_date: data.entry_date,
      release_date: data.release_date,
      danger_level: data.danger_level,
      religion: data.religion
    }).subscribe({
      next: (res) => {
        this.prisoners.push(res.data);
        this.saving = false;
      },
      error: (err) => {
        console.error(err);
        this.formError = 'Nepodařilo se vytvořit položku.';
        this.saving = false;
      }
    });
  }

  private updatePrisoner(data: any) {
    this.saving = true;


    this.http.put<PrisonerResponse>(`${this.API_URL}/prisoners/${data.prisoner_id}`, {
      first_name: data.first_name,
      last_name: data.last_name,
      credits: data.credits,
      cell_id: data.cell_id,
      entry_date: data.entry_date,
      release_date: data.release_date,
      danger_level: data.danger_level,
      religion: data.religion
    }).subscribe({
      next: (res) => {
        const index = this.prisoners.findIndex(i => i.prisoner_id === data.prisoner_id);
        if (index !== -1) {
          this.prisoners[index] = res.data;
        }
        this.saving = false;
      },
      error: (err) => {
        console.error(err);
        this.formError = 'Nepodařilo se upravit položku.';
        this.saving = false;
      }
    });
  }
  
}

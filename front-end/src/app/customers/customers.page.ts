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

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ModalController, IonicModule } from '@ionic/angular';
import { FormModalComponent } from '../components/form-modal.component';
import { options } from 'ionicons/icons';
import { CreditChargeModalComponent } from '../components/credit-charge-modal.component';
import { GenericTableModalComponent } from '../components/data-modal.component';
import { TableColumn } from '../components/data-modal.interface';
import { lastValueFrom } from 'rxjs';

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

interface Cell {
  cell_id: number;
}

interface CellsResponse {
  success: boolean;
  data: Cell[];
  count: number;
}

interface PrisonerResponse {
  success: boolean;
  data: Prisoner;
  count: number;
}

interface Allergen {
  allergen_id: number;
  allergen_name: string;
  severity: string;
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

  filteredPrisoners: Prisoner[] = [];

  loading = false;
  saving = false;
  error: string | null = null;
  formError: string | null = null;
  cellIds: number[] = [];

  isAddMode = false;
  isEditMode = false;

  searchTerm = '';
  selectedCell: 'all' | string = 'all';
  cellLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

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

  cellMap: Record<number, string> = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F'
  };

  private prisonerFormFields = [
    { key: 'first_name', label: 'First Name', type: 'text', required: true },
    { key: 'last_name', label: 'Last Name', type: 'text', required: true },
    { key: 'credits', label: 'Credits', type: 'number', required: true },
    { key: 'cell_id', label: 'Cell ID', type: 'select', required: true, options: this.cellIds },
    { key: 'entry_date', label: 'Entry Date', type: 'date', required: true },
    { key: 'release_date', label: 'Release Date', type: 'date', required: false },
    { key: 'danger_level', label: 'Danger Level', type: 'number', required: true },
    { key: 'religion', label: 'Religion', type: 'text', required: false }
  ];

  private readonly API_URL = 'http://localhost/api/prison';

  constructor(
    private http: HttpClient,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadPrisoners();
    this.loadCells();
  }

  private getAuthOptions() {
    const token =
      localStorage.getItem('access_token') ||
      localStorage.getItem('token');

    if (!token) {
      console.warn('Chybí access token – request může skončit 401.');
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  loadCells() {
    this.loading = true;
    this.error = null;

    this.http.get<CellsResponse>(`${this.API_URL}/cells`, this.getAuthOptions())
      .subscribe({
        next: (res) => {
          res.data.forEach(cell => {
            this.cellIds.push(cell.cell_id);
          });
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Nepodařilo se načíst cely.';
          this.loading = false;
        }
      });
  }

  loadPrisoners() {
    this.loading = true;
    this.error = null;

    this.http.get<PrisonersResponse>(`${this.API_URL}/prisoners`, this.getAuthOptions())
      .subscribe({
        next: (res) => {
          this.prisoners = res.data || [];
          this.applyFilters();
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
    this.formPrisoner = { ...item };
  }

  applyFilters() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredPrisoners = this.prisoners.filter(p => {
      const matchesSearch =
        !term ||
        p.prisoner_id.toString().includes(term) ||
        p.first_name.toLowerCase().includes(term) ||
        p.last_name.toLowerCase().includes(term);

      const prisonerCell = this.cellMap[p.cell_id];
      const matchesCell =
        this.selectedCell === 'all' ||
        prisonerCell === this.selectedCell;

      return matchesSearch && matchesCell;
    });
  }

  async openItemModal(prisonerToEdit?: Prisoner) {

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
        formData: initialData,
        formFields: this.prisonerFormFields,
        formTitle: title
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm' && data) {
      console.log('Form submitted with data:', data);

      if (prisonerToEdit) {
        this.updatePrisoner(data);
      } else {
        this.createItem(data);
      }
    }
  }

  startEditItem(item: Prisoner) {
    this.openItemModal(item);
  }

  startAddItem() {
    this.openItemModal();
  }

  deletePrisoner(id: number) {
    this.saving = true;
    this.http.delete<PrisonerResponse>(
      `${this.API_URL}/prisoners/${id}`,
      this.getAuthOptions()
    ).subscribe({
      next: () => {
        const index = this.prisoners.findIndex(i => i.prisoner_id === id);
        if (index !== -1) {
          this.prisoners.splice(index, 1);
          this.applyFilters();
        }
        this.saving = false;
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

    this.http.post<PrisonerResponse>(
      `${this.API_URL}/prisoners`,
      {
        first_name: data.first_name,
        last_name: data.last_name,
        credits: data.credits,
        cell_id: data.cell_id,
        entry_date: data.entry_date,
        release_date: data.release_date,
        danger_level: data.danger_level,
        religion: data.religion
      },
      this.getAuthOptions()
    ).subscribe({
      next: (res) => {
        this.prisoners.push(res.data);
        this.applyFilters();
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

    this.http.put<PrisonerResponse>(
      `${this.API_URL}/prisoners/${data.prisoner_id}`,
      {
        first_name: data.first_name,
        last_name: data.last_name,
        credits: data.credits,
        cell_id: data.cell_id,
        entry_date: data.entry_date,
        release_date: data.release_date,
        danger_level: data.danger_level,
        religion: data.religion
      },
      this.getAuthOptions()
    ).subscribe({
      next: (res) => {
        const index = this.prisoners.findIndex(i => i.prisoner_id === data.prisoner_id);
        if (index !== -1) {
          this.prisoners[index] = res.data;
          this.applyFilters();
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

  async startCreditCharge(prisonerId: number) {
    const modal = await this.modalController.create({
      component: CreditChargeModalComponent,
      componentProps: {
        prisonerId: prisonerId
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'success' && data.success) {
      console.log(`Dobito ${data.amount} kreditů pro vězně ID ${prisonerId}.`);
      const index = this.prisoners.findIndex(i => i.prisoner_id === prisonerId);
      if (index !== -1) {
        this.prisoners[index].credits += data.amount;
        this.applyFilters();
      }
    }
  }

  async getPrisonerAllergens(prisonerId: number): Promise<Allergen[]> {
    try {
      const response = await lastValueFrom(
        this.http.get<any>(
          `${this.API_URL}/prisoners/${prisonerId}/allergens`,
          this.getAuthOptions()
        )
      );
      return response.data;
    } catch (err) {
      console.error('Chyba při načítání alergenů:', err);
      throw err;
    }
  }

  async showAllergens(prisonerId: number) {
    const allergens = await this.getPrisonerAllergens(prisonerId);

    const columns: TableColumn[] = [
      { key: 'allergen_id', label: 'Allergen number' },
      { key: 'allergen_name', label: 'Allergen name' },
      { key: 'severity', label: 'Severity' },
    ];

    const modal = await this.modalController.create({
      component: GenericTableModalComponent,
      componentProps: {
        title: 'Prisoner allergens',
        data: allergens,
        columns: columns
      },
      cssClass: 'auto-height-modal compact-modal'
    });

    await modal.present();
  }
}

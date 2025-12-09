import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';

import {
  FormBuilder, FormGroup, Validators, FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  imports: [
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CommonModule
  ]
})

//Modal na univerzální formulář

export class FormModalComponent implements OnInit {

  // 1. Zavedení FormGroups
  // Zde definujeme proměnnou, kterou požaduje TS
  public universalForm!: FormGroup;

  // 2. INPUT pro dynamické schéma
  @Input() formData: any; // Data (např. { name: 'Apple', storage_minimum: 5 })
  @Input() formFields: any[] = []; // Schéma (např. [{ key: 'name', type: 'text' }])
  @Input() formTitle: string = 'Form';

  // 3. Injektování FormBuilderu
  constructor(
    private modalController: ModalController,
    private fb: FormBuilder // <--- Injektujeme FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }

  // 4. Metoda pro dynamické vytvoření FormGroup
  createForm() {
    const formControls: any = {};

    // Projdeme pole schématu (formFields) a vytvoříme FormGroup
    this.formFields.forEach(field => {
      // Získáme aktuální hodnotu z formData, pokud existuje, jinak null

      const initialValue = this.formData ? this.formData[field.key] : '';
      console.log(initialValue);
      // Nastavení validátorů (základní je required, můžete přidat další)
      const validators = [];
      if (field.required) {
        //validators.push(Validators.required);
      }

      formControls[field.key] = [initialValue, validators];
    });

    // Vytvoříme instanci FormGroup s dynamicky vytvořenými kontrolami
    this.universalForm = this.fb.group(formControls);
  }

  // 5. Odeslání formuláře
  onSubmit() {
    if (this.universalForm.valid) {
      // Vracíme sloučená původní data s novými hodnotami formuláře
      const resultData = {
        ...this.formData, // Původní data (např. ID, které není ve formuláři)
        ...this.universalForm.value
      };

      this.modalController.dismiss(resultData, 'confirm');
    } else {
      // Volitelně můžete zobrazit chybovou zprávu
      console.error('Form is invalid.');
    }
  }

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }
}
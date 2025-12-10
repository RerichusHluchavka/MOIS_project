import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { TableColumn, GenericTableData } from '../dataModal/data-modal.interface';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-generic-table-modal',
  templateUrl: './data-modal.component.html',
  imports: [
    IonicModule,
    CommonModule
  ]
})

export class GenericTableModalComponent {

  // Vstupy, které se plní při vytváření modalu
  @Input() title: string = 'Data';
  @Input() data: GenericTableData[] = [];
  @Input() columns: TableColumn[] = [];

  ngOnInit() {
    console.log('Přišla data do modalu:', this.data);
    console.log('Přišly definice sloupců:', this.columns);

    if (this.data && this.data.length > 0) {
      console.log('První řádek dat:', this.data[0]);
    }
  }

  constructor(private modalCtrl: ModalController) { }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
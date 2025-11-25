import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonToggle,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  IonInput,
  IonModal,
  IonList,
  IonButtons,
  IonIcon,
  IonText
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonToggle,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonNote,
    IonInput,
    IonModal,
    IonList,
    IonButtons,
    IonIcon,
    IonText
  ]
})
export class SettingsPage implements OnInit, OnDestroy {
  darkMode = false;
  followSystem = false;

  hasAdminPermission = false;
  addUserOpen = false;

  users = [
    { name: 'Alice', canAddUsers: true },
    { name: 'Bob', canAddUsers: false },
    { name: 'Charlie', canAddUsers: false }
  ];

  newUser = { name: '', password: '', canAddUsers: false };

  private prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  private prefersDarkHandler = (e: MediaQueryListEvent) => {
    if (this.followSystem) {
      this.darkMode = e.matches;
      this.applyTheme(this.darkMode);
    }
  };

  ngOnInit() {
    const savedDark = localStorage.getItem('darkMode');
    const savedFollowSystem = localStorage.getItem('followSystem');

    this.followSystem = savedFollowSystem ? JSON.parse(savedFollowSystem) : false;

    if (this.followSystem) {
      this.darkMode = this.prefersDark.matches;
      this.prefersDark.addEventListener('change', this.prefersDarkHandler);
    } else {
      this.darkMode = savedDark ? JSON.parse(savedDark) : false;
    }

    this.applyTheme(this.darkMode);
  }

  ngOnDestroy() {
    this.prefersDark.removeEventListener('change', this.prefersDarkHandler);
  }

  onSystemToggle(enabled: boolean) {
    this.followSystem = enabled;
    localStorage.setItem('followSystem', JSON.stringify(enabled));

    if (enabled) {
      this.darkMode = this.prefersDark.matches;
      this.applyTheme(this.darkMode);
      this.prefersDark.addEventListener('change', this.prefersDarkHandler);
    } else {
      this.prefersDark.removeEventListener('change', this.prefersDarkHandler);
      localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
    }
  }

  onToggleTheme(enabled: boolean) {
    if (this.followSystem){
      return;
    }

    this.darkMode = enabled;
    localStorage.setItem('darkMode', JSON.stringify(enabled));
    this.applyTheme(enabled);
  }

  // 🎨 Apply theme – přepíná i <html>
  private applyTheme(enabled: boolean) {
    document.body.classList.toggle('dark', enabled);
    document.documentElement.classList.toggle('dark', enabled);
  }

  // 👥 User management
  openAddUserModal() {
    this.addUserOpen = true;
  }

  confirmAddUser() {
    if (!this.newUser.name || !this.newUser.password) return;

    this.users.push({
      name: this.newUser.name,
      canAddUsers: this.newUser.canAddUsers
    });

    this.newUser = { name: '', password: '', canAddUsers: false };
    this.addUserOpen = false;
  }

  deleteUser(u: any) {
    this.users = this.users.filter(x => x !== u);
  }

  onToggleUserPermission(u: any) {
    console.log(`User ${u.name} permission changed:`, u.canAddUsers);
  }
}

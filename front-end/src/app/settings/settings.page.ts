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
  IonList,
  IonIcon,
  IonText,
  IonSpinner,
  IonNote,
  IonButton,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';

import {
  HttpClient,
  HttpClientModule,
  HttpHeaders
} from '@angular/common/http';

interface CurrentUser {
  id: number;
  username: string;
  role: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    IonNote,
    CommonModule,
    FormsModule,
    HttpClientModule,

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
    IonList,
    IonIcon,
    IonText,
    IonSpinner,

    IonButton,
    IonSelect,
    IonSelectOption
  ],
})
export class SettingsPage implements OnInit, OnDestroy {

  darkMode = false;
  followSystem = false;

  currentUser: CurrentUser | null = null;
  userLoading = false;
  userError: string | null = null;

  roleSaving = false;
  roleError: string | null = null;

  private readonly AUTH_API = 'http://localhost/api/auth';

  private prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  private prefersDarkHandler = (e: MediaQueryListEvent) => {
    if (this.followSystem) {
      this.darkMode = e.matches;
      this.applyTheme(this.darkMode);
    }
  };

  constructor(private http: HttpClient) {}

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
    this.loadCurrentUser();
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
    if (this.followSystem) return;

    this.darkMode = enabled;
    localStorage.setItem('darkMode', JSON.stringify(enabled));
    this.applyTheme(enabled);
  }

  private applyTheme(enabled: boolean) {
    document.body.classList.toggle('dark', enabled);
    document.documentElement.classList.toggle('dark', enabled);
  }

  // =============== UŽIVATEL ===============
  private loadCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.currentUser = null;
      return;
    }

    this.userLoading = true;
    this.userError = null;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post<any>(`${this.AUTH_API}/verify`, {}, { headers }).subscribe({
      next: (res) => {
        if (res?.user) {
          this.currentUser = {
            id: res.user.userId,
            username: res.user.username,
            role: res.user.role,
          };
        } else {
          this.currentUser = null;
        }
        this.userLoading = false;
      },
      error: (err) => {
        console.error('Verify error', err);
        this.userError = 'Failed to load user info.';
        this.userLoading = false;
      },
    });
  }

  // =============== ZMĚNA ROLE (jen admin) ===============
  changeRole() {
    if (!this.currentUser) return;

    const token = localStorage.getItem('token');
    if (!token) {
      this.roleError = 'Not authenticated.';
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.roleSaving = true;
    this.roleError = null;

    this.http
      .patch(
        `${this.AUTH_API}/users/${this.currentUser.id}/role`,
        { role: this.currentUser.role },
        { headers }
      )
      .subscribe({
        next: () => {
          this.roleSaving = false;
        },
        error: (err) => {
          console.error('Change role error', err);
          this.roleError = 'Failed to update role.';
          this.roleSaving = false;
        },
      });
  }
}

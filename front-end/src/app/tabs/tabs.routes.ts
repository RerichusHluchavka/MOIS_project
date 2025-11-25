import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'dispensing',
        loadComponent: () =>
          import('../dispensing/dispensing.page').then((m) => m.DispensingPage),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('../customers/customers.page').then((m) => m.CustomersPage),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('../inventory/inventory.page').then((m) => m.InventoryPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'settings',
    loadComponent: () => import('../settings/settings.page').then(m => m.SettingsPage)
  },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'palpite',
    // Removemos o ".component" do caminho do import
    loadComponent: () => import('./Paginas/palpite/palpite').then(m => m.PalpiteComponent)
  },
  {
    path: 'boloes',
    // Removemos o ".component" do caminho do import
    loadComponent: () => import('./Paginas/boloes/boloes').then(m => m.BoloesComponent)
  },
  {
    path: '',
    redirectTo: 'palpite',
    pathMatch: 'full'
  }
];
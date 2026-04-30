import { Routes } from '@angular/router';
import { ShellLayoutComponent } from '../layout/shell-layout/shell-layout.component';
// Importe seus outros componentes aqui: TabelaComponent, AdminComponent...
import { TabelaComponent } from './pages/tabela/tabela';
import { AdminComponent } from './pages/admin/admin';

export const routes: Routes = [
  // Rota principal que carrega o menu
  {
    path: '',
    component: ShellLayoutComponent,
    children: [
      { path: '', redirectTo: 'tabela', pathMatch: 'full' },
      { path: 'tabela', component: TabelaComponent }, // Sua tabela
      { path: 'admin', component: AdminComponent },   // Seu admin
      // Adicione as outras rotas aqui depois (Dashboard, Ranking, etc)
    ]
  }
];
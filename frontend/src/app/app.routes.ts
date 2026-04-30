import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { ShellLayoutComponent } from './shared/shell-layout/shell-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TabelaComponent } from './pages/tabela/tabela'; 
import { AdminComponent } from './pages/admin/admin';
// import { PalpitesComponent } from './features/palpites/palpites.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  {
    path: '',
    component: ShellLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      // { path: 'palpites/:jogoId', component: PalpitesComponent },
      { path: 'ranking', component: DashboardComponent },
      { path: 'jogos', component: TabelaComponent },
      { path: 'tabela', component: TabelaComponent },
      { path: 'admin', component: AdminComponent }
    ]
  }
];

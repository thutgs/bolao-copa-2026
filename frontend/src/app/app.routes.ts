import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { ShellLayoutComponent } from './shared/shell-layout/shell-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TabelaComponent } from './pages/tabela/tabela';
import { AdminComponent } from './pages/admin/admin';
import { PalpiteComponent } from './Paginas/palpite/palpite';
import { BoloesComponent } from './Paginas/boloes/boloes';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  {
    path: '',
    component: ShellLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'palpites', component: PalpiteComponent },
      { path: 'boloes', component: BoloesComponent },
      { path: 'jogos', component: TabelaComponent },
      { path: 'tabela', component: TabelaComponent },
      { path: 'admin', component: AdminComponent }
    ]
  }
];

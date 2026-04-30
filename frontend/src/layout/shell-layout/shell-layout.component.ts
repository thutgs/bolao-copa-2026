import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

// ATENÇÃO: Ajuste o caminho do AuthService para o do seu projeto, 
// ou comente as linhas relacionadas a ele se ainda não existir.
// import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell-layout.component.html',
  styleUrls: ['./shell-layout.component.scss']
})
export class ShellLayoutComponent {
  private router = inject(Router);
  
  // Se não tiver AuthService, você pode mockar o usuário temporariamente assim:
  currentUser = computed(() => ({ nome: 'Admin', email: 'admin@bolao.com', avatar: 'masculino' }));
  
  // private authService = inject(AuthService);
  // currentUser = computed(() => this.authService.getUser());

  logout(): void {
    // this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
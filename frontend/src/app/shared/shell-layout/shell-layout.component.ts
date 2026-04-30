import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell-layout.component.html',
  styleUrls: ['./shell-layout.component.scss']
})
export class ShellLayoutComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser = computed(() => this.authService.getUser());

  // Verifica se o usuário logado possui a flag is_global_admin como verdadeira
  isAdmin = computed(() => {
    const user = this.currentUser();
    return user?.is_global_admin === true; 
  });
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  title = 'frontend';
  private http = inject(HttpClient);
  
  // Use a simple property that acts like a signal/function for the template
  currentUser = () => ({ nome: 'Arthur', email: 'eotuzzz@gmail.com', avatar: 'masculino' });

  ngOnInit() {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tIiwiaWF0IjoxNzc3NTE1OTIxLCJleHAiOjE3Nzc1NTkxMjF9.ow-3LMFq_iHK6mhfp871WfVEPtF7NB6l4x4WQhXVXNw';
    localStorage.setItem('token', token);
    localStorage.setItem('userId', '1');
    console.log('Mock login with hardcoded token injected!');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // window.location.href = '/login';
    console.log('Logout clicked');
  }
}

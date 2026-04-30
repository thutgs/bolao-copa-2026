import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const router = inject(Router);

  let headers = req.headers;
  
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const authReq = req.clone({ headers });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('Não autorizado! Redirecionando para login.');
        // router.navigate(['/auth']); // Descomentar se existir a tela de auth
      } else if (error.status === 403) {
        console.error('Acesso negado: ', error.error?.message);
      }
      return throwError(() => error);
    })
  );
};

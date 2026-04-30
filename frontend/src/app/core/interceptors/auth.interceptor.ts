import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Pega o token salvo no localStorage (que será criado na tela de Login)
  const token = localStorage.getItem('access_token');

  // Se houver token, clona a requisição e injeta o cabeçalho Bearer
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Se não houver, segue a vida normalmente (ex: rota de login/cadastro)
  return next(req);
};
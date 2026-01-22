import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // armazena o token de autenticação do localStorage
  const token = localStorage.getItem('auth_Token');

  // se o token existir, clona a requisição e adiciona o cabeçalho Authorization
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    //  encaminha a requisição clonada com o cabeçalho adicionado
    return next(authReq);
  }

  // se o token não existir, encaminha a requisição original
  return next(req);
};

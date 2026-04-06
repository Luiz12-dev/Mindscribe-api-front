import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  console.log('INTERCEPTOR RODOU! Token encontrado:', token);

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    console.log('INTERCEPTOR: Crachá anexado e requisição enviada!');
    return next(authReq);
  }

  return next(req);
};

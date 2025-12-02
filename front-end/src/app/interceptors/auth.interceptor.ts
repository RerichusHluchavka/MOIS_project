import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  // přidáváme token jen k našim backendům
  const isApiUrl =
    req.url.startsWith('http://localhost:3000') ||
    req.url.startsWith('http://localhost:3001') ||
    req.url.startsWith('http://localhost:3002') ||
    req.url.startsWith('http://localhost:3003');

  if (!isApiUrl) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};

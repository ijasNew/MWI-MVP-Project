import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // Requests such as admin APIs may already provide their own
  // Authorization header. Never overwrite it with the user token.
  if (req.headers.has('Authorization')) {
    return next(req);
  }

  const token = localStorage.getItem('mwi_token');

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};

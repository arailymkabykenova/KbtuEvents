import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const publicApiUrls = [
    `${req.url.startsWith('http') ? req.url.split('/api/')[0] : ''}/api/login/`, 
    `${req.url.startsWith('http') ? req.url.split('/api/')[0] : ''}/api/refresh/`,
    `${req.url.startsWith('http') ? req.url.split('/api/')[0] : ''}/api/registration/`,
    `${req.url.startsWith('http') ? req.url.split('/api/')[0] : ''}/api/events/` 
  ];

  const isPublicGetEvent = req.method === 'GET' && req.url.startsWith(`${req.url.startsWith('http') ? req.url.split('/api/')[0] : ''}/api/events/`);
  const isExactPublicMatch = publicApiUrls.includes(req.url);

  if (isExactPublicMatch || isPublicGetEvent) {
     console.log('Interceptor: Public URL or GET events, skipping token for:', req.url);
     return next(req);
  }


  const token = localStorage.getItem('access');
  if (token) {
    console.log('Interceptor: Attaching token for:', req.url);
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  console.log('Interceptor: No token found, passing original request for:', req.url);
  return next(req);
};
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface LoginRequest {
  email: string;
  password: string;
}

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/api/auth/login') && req.method === 'POST') {
    const body = req.body as LoginRequest;
    const { email, password } = body;
    
    if (email && password) {
      const role = email.endsWith('@sdi.es') ? 'admin' : 'user';
      const user = { email, name: email.split('@')[0], role };
      const token = btoa(JSON.stringify(user));
      
      return of(new HttpResponse({
        status: 200,
        body: { user, token }
      })).pipe(delay(500));
    } else {
      return of(new HttpResponse({
        status: 401,
        body: { error: 'Invalid credentials' }
      })).pipe(delay(500));
    }
  }

  if (req.url.includes('/api/sessions')) {
    console.log('Intercepted sessions API call:', req.url);
  }

  return next(req);
};
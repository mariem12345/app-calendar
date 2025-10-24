import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Mock login endpoint
    if (request.url.includes('/api/auth/login') && request.method === 'POST') {
      const { email, password } = request.body;
      
      // Simple mock validation
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

    return next.handle(request);
  }
}
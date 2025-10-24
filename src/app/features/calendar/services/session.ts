import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Session, SessionCategory, SessionStatus } from '../models/session';

@Injectable({
  providedIn: 'root'
})

export class sessionService{
  private sessions: Session[] = [
    {
      id: '1',
      title: 'Angular Training',
      description: 'Learn Angular fundamentals',
      category: 'Formación',
      city: 'Madrid',
      date: new Date('2025-01-15T10:00:00'),
      status: 'published',
      image: 'assets/angular-training.jpg'
    },
    {
      id: '2',
      title: 'Project Planning',
      description: 'Quarterly project planning meeting',
      category: 'Reunión',
      city: 'Barcelona',
      date: new Date('2025-01-20T14:00:00'),
      status: 'published'
    }
  ];

  getSessions(): Observable<Session[]> {
    return of(this.sessions).pipe(delay(500));
  }

  getSessionById(id: string): Observable<Session | undefined> {
    const session = this.sessions.find(s => s.id === id);
    return of(session).pipe(delay(300));
  }

  createSession(session: Omit<Session, 'id'>): Observable<Session> {
    const newSession: Session = {
      ...session,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.sessions.push(newSession);
    return of(newSession).pipe(delay(500));
  }

  updateSession(id: string, session: Partial<Session>): Observable<Session> {
    const index = this.sessions.findIndex(s => s.id === id);
    if (index !== -1) {
      this.sessions[index] = { ...this.sessions[index], ...session };
      return of(this.sessions[index]).pipe(delay(500));
    }
    throw new Error('Session not found');
  }

  deleteSession(id: string): Observable<boolean> {
    const index = this.sessions.findIndex(s => s.id === id);
    if (index !== -1) {
      this.sessions.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  getCategories(): SessionCategory[] {
    return ['Formación', 'Reunión', 'Demo', 'Taller'];
  }

  getCities(): string[] {
    return ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao'];
  }
}
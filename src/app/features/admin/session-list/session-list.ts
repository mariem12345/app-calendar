import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Session } from '../../calendar/models/session';
import { sessionService } from '../../calendar/services/session';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.html',
  styleUrl: './session-list.scss',
  standalone: true,
  imports: [CommonModule, RouterModule]
})

export class SessionList implements OnInit {
    sessions: Session[] = [];
  
    constructor(
      private sessionService: sessionService,
      private router: Router
    ) {}
  
    ngOnInit(): void {
      this.loadSessions();
    }
  
    loadSessions(): void {
      this.sessionService.getSessions().subscribe(sessions => {
        this.sessions = sessions;
      });
    }
  
    createSession(): void {
      this.router.navigate(['/admin/session/new']);
    }
  
    editSession(session: Session): void {
      this.router.navigate(['/admin/session/edit', session.id]);
    }
  
    deleteSession(session: Session): void {
      if (confirm(`Are you sure you want to delete "${session.title}"?`)) {
        this.sessionService.deleteSession(session.id).subscribe(() => {
          this.loadSessions();
        });
      }
    }
  }
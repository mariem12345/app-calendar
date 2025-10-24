import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { sessionService } from '../../../features/calendar/services/session';
import { SessionCategory, SessionStatus } from '../../../features/calendar/models/session';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-session-form',
  templateUrl: './session-form.html',
  styleUrl: './session-form.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class SessionForm implements OnInit {
  sessionForm: FormGroup;
  isEdit = false;
  sessionId?: string;
  categories: SessionCategory[] = [];
  cities: string[] = [];
  statusOptions: SessionStatus[] = ['draft', 'locked', 'hidden', 'published'];

  constructor(
    private fb: FormBuilder,
    private sessionService: sessionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sessionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      city: ['', Validators.required],
      date: ['', Validators.required],
      status: ['draft', Validators.required],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.categories = this.sessionService.getCategories();
    this.cities = this.sessionService.getCities();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.sessionId = params['id'];
        this.loadSession();
      }
    });
  }

  loadSession(): void {
    if (this.sessionId) {
      this.sessionService.getSessionById(this.sessionId).subscribe(session => {
        if (session) {
          this.sessionForm.patchValue({
            ...session,
            date: new Date(session.date).toISOString().slice(0, 16)
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.sessionForm.valid) {
      const formValue = this.sessionForm.value;
      const sessionData = {
        ...formValue,
        date: new Date(formValue.date)
      };

      if (this.isEdit && this.sessionId) {
        this.sessionService.updateSession(this.sessionId, sessionData).subscribe(() => {
          this.router.navigate(['/admin']);
        });
      } else {
        this.sessionService.createSession(sessionData).subscribe(() => {
          this.router.navigate(['/admin']);
        });
      }
    }
  }
}

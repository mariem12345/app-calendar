import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Session, SessionCategory, SessionStatus } from '../models/session';
import { sessionService } from '../services/session';

@Component({
  selector: 'app-calendar',
  imports: [],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar implements OnInit{
  sessions: Session[] = [];
  filteredSessions: Session[] = [];
  filterForm: FormGroup;
  categories: SessionCategory[] = [];
  
  currentMonth: Date = new Date();
  weeks: Date[][] = [];

  constructor(
    private sessionService: sessionService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.loadSessions();
    this.categories = this.sessionService.getCategories();
    
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadSessions(): void {
    this.sessionService.getSessions().subscribe(sessions => {
      this.sessions = sessions;
      this.applyFilters();
      this.generateCalendar();
    });
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    this.filteredSessions = this.sessions.filter(session => {
      const categoryMatch = !filters.category || session.category === filters.category;
      const statusMatch = !filters.status || session.status === filters.status;
      return categoryMatch && statusMatch;
    });
  }

  generateCalendar(): void {
    // Simplified calendar generation
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Basic calendar grid implementation
    this.weeks = [];
    let currentWeek: Date[] = [];
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      currentWeek.push(date);
      
      if (date.getDay() === 0 || day === lastDay.getDate()) {
        this.weeks.push(currentWeek);
        currentWeek = [];
      }
    }
  }

  getSessionsForDate(date: Date): Session[] {
    return this.filteredSessions.filter(session => 
      new Date(session.date).toDateString() === date.toDateString()
    );
  }

  changeMonth(direction: number): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + direction,
      1
    );
    this.generateCalendar();
  }
}

import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Session, SessionCategory, SessionStatus } from '../models/session';
import { sessionService } from '../services/session';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true,
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
    this.generateCalendar();
  }

  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Calculate start date (previous month's days to fill the first week)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // Calculate end date (next month's days to fill the last week)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    this.weeks = [];
    let currentWeek: Date[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      currentWeek.push(new Date(currentDate));
      
      if (currentDate.getDay() === 6) { // Saturday - end of week
        this.weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Add the last week if it's not empty
    if (currentWeek.length > 0) {
      this.weeks.push(currentWeek);
    }
  }

  getSessionsForDate(date: Date): Session[] {
    return this.filteredSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.getDate() === date.getDate() &&
             sessionDate.getMonth() === date.getMonth() &&
             sessionDate.getFullYear() === date.getFullYear();
    });
  }

  changeMonth(direction: number): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + direction,
      1
    );
    this.generateCalendar();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  getWeekdayNames(): string[] {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }
}
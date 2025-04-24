import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http'; 

import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
  eventId: number = 0;
  eventDetails: Event | null = null;
  isLoading: boolean = true; 
  error: string | null = null; 

 
  isRegistering: boolean = false;
  registrationMessage: string | null = null;
  registrationIsError: boolean = false;
  isAlreadyRegistered: boolean = false;


  showFeedbackForm: boolean = false;
  feedbackComment: string = '';
  feedbackRating: number = 3;
  isSubmittingFeedback: boolean = false;
  feedbackMessage: string | null = null;
  feedbackIsError: boolean = false;
  hasAlreadyLeftFeedback: boolean = false;


  schoolMap: { [key: string]: string } = { 'all': 'All Schools', 'bs': 'Business School', 'site': 'School of IT & Engineering', 'seogi': 'School of Energy & Oil and Gas', 'sg': 'School of Geology', 'ise': 'International School of Economics', 'kma': 'Kazakhstan Maritime Academy', 'sam': 'School of Applied Mathematics', 'sce': 'School of Chemical Engineering' };
  eventTypeMap: { [key: string]: string } = { 'lecture': 'Lecture', 'master_class': 'Master Class', 'competition': 'Competition', 'cultural': 'Cultural', 'volunteering': 'Volunteering' };


  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.eventId = +idParam;
      this.loadEventDetails();
    } else {
      this.error = 'Event ID not found.';
      this.isLoading = false;
    }
  }

  loadEventDetails(): void {
    this.isLoading = true;
    this.error = null;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (data) => {
        this.eventDetails = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading event details:', err);
        this.error = 'Failed to load event details.';
        this.isLoading = false;
      },
    });
  }
  isUserLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
  registerForEvent(): void {
    if (!this.eventId || this.isRegistering || this.isAlreadyRegistered) return;
    this.isRegistering = true;
    this.registrationMessage = null;
    this.registrationIsError = false;

    this.eventService.registerForEvent(this.eventId).subscribe({
      next: (response) => {
        this.registrationMessage = response.message || 'Successfully registered!';
        this.isAlreadyRegistered = true;
        this.registrationIsError = false;
        this.isRegistering = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Registration error:', err);
        if (err.status === 400 && err.error?.error?.includes('Already registered')) {
          this.registrationMessage = err.error.error;
          this.isAlreadyRegistered = true;
        } else {
          this.registrationMessage = err.error?.error || err.error?.message || 'Registration failed. Please try again.';
          this.isAlreadyRegistered = false;
        }
        this.registrationIsError = true;
        this.isRegistering = false;
      }
    });
  }

  toggleFeedbackForm(): void {
    if (this.hasEventPassed()) { 
        this.showFeedbackForm = !this.showFeedbackForm;
        this.feedbackMessage = null;
        this.feedbackIsError = false;
    } else {
        alert("You can leave feedback only after the event has passed.");
    }
  }

  submitFeedback(): void {
    if (!this.eventId || !this.feedbackComment || !this.feedbackRating || this.isSubmittingFeedback || this.hasAlreadyLeftFeedback) return;
    if (this.feedbackRating < 1 || this.feedbackRating > 5) { this.feedbackMessage = "Rating must be between 1 and 5."; return; }

    this.isSubmittingFeedback = true;
    this.feedbackMessage = null;
    this.feedbackIsError = false;

    const payload = { event_id: this.eventId, comment: this.feedbackComment, rating: this.feedbackRating };

    this.eventService.addEventFeedback(payload).subscribe({
      next: (response) => {
        this.feedbackMessage = response.message || 'Thank you for your feedback!';
        this.hasAlreadyLeftFeedback = true;
        this.feedbackIsError = false;
        this.isSubmittingFeedback = false;
        this.showFeedbackForm = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Feedback submission error:', err);
        if (err.status === 400 && err.error?.error?.toLowerCase().includes('already left feedback')) {
            this.feedbackMessage = err.error.error;
            this.hasAlreadyLeftFeedback = true;
            this.showFeedbackForm = false;
        } else {
            this.feedbackMessage = err.error?.error || err.error?.message || 'Feedback submission failed. Please try again.';
            this.hasAlreadyLeftFeedback = false;
        }
        this.feedbackIsError = true;
        this.isSubmittingFeedback = false;
      }
    });
  }

  hasEventPassed(): boolean {
    if (!this.eventDetails?.event_date) {
        return false;
    }
    try {
        const eventDate = new Date(this.eventDetails.event_date + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate < today;
    } catch (e) {
        console.error("Error parsing event date:", e);
        return false;
    }
  }

  goBack(): void { this.router.navigate(['/']); }

  getSchoolName(code: string): string { return this.schoolMap[code] || code; }
  getEventTypeName(code: string): string { return this.eventTypeMap[code] || code; }
}
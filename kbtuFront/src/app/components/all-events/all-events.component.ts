import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Needed for ngModel
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs'; // To manage subscription

import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { EventCardComponent } from '../event-card/event-card.component'; // Import EventCard

@Component({
  selector: 'app-all-events',
  standalone: true,
  // Import necessary modules
  imports: [CommonModule, FormsModule, RouterModule, EventCardComponent],
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent implements OnInit, OnDestroy {

  allEvents: Event[] = []; // Master list from backend
  filteredEvents: Event[] = []; // List displayed after filtering
  private eventsSubscription: Subscription | null = null; // To prevent memory leaks

  isLoading = true;
  error: string | null = null;

  // Filter state properties
  searchTerm: string = '';
  selectedSchool: string = 'all'; // Default: 'all' for radio button
  // Use object for checkboxes; keys match event_type values from backend/model
  selectedEventTypes: { [key: string]: boolean } = {
    lecture: false,
    master_class: false,
    competition: false,
    cultural: false,
    volunteering: false,
    // Add any other types if defined in your Event model EVENT_TYPE_CHOICES
    // Example: 'party': false, 'conference': false, 'workshop': false, 'other': false
  };

  // Static data for filter options (match keys in selectedEventTypes and values in Event model)
  readonly eventTypeOptions = [
    { key: 'lecture', display: 'Lecture' },
    { key: 'competition', display: 'Competition' },
    { key: 'master_class', display: 'Master Class' }, // Match display to screenshot/model
    { key: 'cultural', display: 'Cultural' }, // Match display to screenshot/model
    { key: 'volunteering', display: 'Volunteering' }, // Match display to screenshot/model
    // Add others if they exist in your EVENT_TYPE_CHOICES
    // { key: 'party', display: 'Party'},
    // { key: 'conference', display: 'Conference'},
    // { key: 'workshop', display: 'Workshop'},
    // { key: 'other', display: 'Other'},
  ];
  // Match values to Event model SCHOOL_CHOICES keys
  readonly schoolOptions = [
    { key: 'all', display: 'All Schools' },
    { key: 'bs', display: 'Business School' },
    { key: 'site', display: 'IT & Engineering' },
    { key: 'seogi', display: 'Energy & Oil/Gas' },
    { key: 'sg', display: 'Geology' },
    { key: 'ise', display: 'Economics (ISE)' },
    { key: 'kma', display: 'Maritime Academy' },
    { key: 'sam', display: 'Applied Mathematics' },
    { key: 'sce', display: 'Chemical Engineering' },
  ];


  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadAllEvents();
  }

  ngOnDestroy(): void {
    // Unsubscribe when component is destroyed
    this.eventsSubscription?.unsubscribe();
  }

  loadAllEvents(): void {
    this.isLoading = true;
    this.error = null;
    this.eventsSubscription = this.eventService.getEvents().subscribe({
      next: (data) => {
        this.allEvents = data;
        this.applyFilters(); // Apply default filters (show all initially)
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.error = 'Failed to load events. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  // Central function to apply all active filters
  applyFilters(): void {
    let events = [...this.allEvents]; // Start with a copy of the full list

    // 1. Filter by Search Term (case-insensitive check on event name)
    if (this.searchTerm.trim()) {
      const lowerSearchTerm = this.searchTerm.toLowerCase().trim();
      events = events.filter(event =>
        event.name.toLowerCase().includes(lowerSearchTerm)
        // Optional: Add more fields to search (e.g., topic, speakers)
        // || event.topic?.toLowerCase().includes(lowerSearchTerm)
        // || event.speakers?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // 2. Filter by Selected School (if not 'all')
    if (this.selectedSchool !== 'all') {
      events = events.filter(event => event.school === this.selectedSchool);
    }

    // 3. Filter by Selected Event Types (check which checkboxes are true)
    const activeTypes = Object.keys(this.selectedEventTypes)
                              .filter(key => this.selectedEventTypes[key]); // Get keys where value is true

    // Only filter by type if *some* checkboxes are checked
    if (activeTypes.length > 0) {
      events = events.filter(event => activeTypes.includes(event.event_type));
    }
    // If no checkboxes are checked, show events of *all* types (matching other filters)

    this.filteredEvents = events;
  }

  // Reset all filters to default state
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedSchool = 'all';
    // Reset all checkbox states to false
    Object.keys(this.selectedEventTypes).forEach(key => {
      this.selectedEventTypes[key] = false;
    });
    this.applyFilters(); // Re-apply filters (will show all events now)
  }

  // Handle changes from search or filter controls
  onFilterChange(): void {
    // Can potentially add debounce here later if needed, especially for search
    this.applyFilters();
  }
}
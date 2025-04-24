import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'; 
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { EventCardComponent } from '../event-card/event-card.component';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EventCardComponent,
    FormsModule, 
    NgbDatepickerModule 
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {


  upcomingEvents: Event[] = [];
  isLoadingCarousel = true; 
  errorCarousel: string | null = null; 
  readonly timelineEventLimit = 6;
  private swiperInstance: Swiper | null = null;

  selectedDateModel: NgbDateStruct | null = null; 
  filteredEvents: Event[] = []; 
  isLoadingCalendarEvents = false; 
  errorCalendarEvents: string | null = null; 
  noEventsFoundForDate = false; 

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
    ) {}

  ngOnInit(): void {
    this.loadTimelineEvents(); 
  }

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  ngOnDestroy(): void {
    this.swiperInstance?.destroy(true, true);
  }

  loadTimelineEvents(): void {
    this.isLoadingCarousel = true; 
    this.errorCarousel = null;     
    this.swiperInstance?.destroy(true, true);
    this.swiperInstance = null;

    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.upcomingEvents = data.slice(0, this.timelineEventLimit);
        this.isLoadingCarousel = false; 
        setTimeout(() => { this.initSwiper(); }, 0);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading timeline events:', err);
        this.errorCarousel = 'Failed to load timeline events.'; 
        this.isLoadingCarousel = false; 
        this.cdr.detectChanges();
      }
    });
  }

  private initSwiper(): void {
    if (this.swiperInstance || this.isLoadingCarousel || this.upcomingEvents.length === 0) return;
    this.ngZone.runOutsideAngular(() => {
        this.swiperInstance = new Swiper('.swiper-container', { 
            modules: [Navigation, Pagination, Autoplay, A11y],
            slidesPerView: 1, spaceBetween: 20, grabCursor: true,
            loop: this.upcomingEvents.length > 3,
            pagination: { el: '.swiper-pagination', clickable: true, },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev', },
            a11y: { prevSlideMessage: 'Previous slide', nextSlideMessage: 'Next slide', },
            breakpoints: {
                600: { slidesPerView: 2, spaceBetween: 25, loop: this.upcomingEvents.length > 2, },
                992: { slidesPerView: 3, spaceBetween: 30, loop: this.upcomingEvents.length > 3, }
            }
        });
    });
  }


  onDateSelect(date: NgbDateStruct | null): void { 
    if (!date) {
        this.filteredEvents = [];
        this.selectedDateModel = null;
        this.noEventsFoundForDate = false;
        return;
    }

    this.selectedDateModel = date; 
    const selectedDateStr = this.formatDate(date);
    this.isLoadingCalendarEvents = true;
    this.errorCalendarEvents = null;
    this.filteredEvents = []; 
    this.noEventsFoundForDate = false;

    this.eventService.getEventsByDate(selectedDateStr).subscribe({
        next: (data) => {
            this.filteredEvents = data;
            this.noEventsFoundForDate = data.length === 0;
            this.isLoadingCalendarEvents = false;
            this.cdr.detectChanges();
        },
        error: (err) => {
            console.error(`Error loading events for date ${selectedDateStr}:`, err);
            this.errorCalendarEvents = 'Failed to load events for the selected date.';
            this.isLoadingCalendarEvents = false;
            this.noEventsFoundForDate = false;
            this.cdr.detectChanges();
        }
    });
  }

  formatDate(date: NgbDateStruct): string {
    const year = date.year;
    const month = date.month < 10 ? `0${date.month}` : date.month;
    const day = date.day < 10 ? `0${date.day}` : date.day;
    return `${year}-${month}-${day}`;
  }

  getEventTypeName(code: string): string {
    const map: { [key: string]: string } = { 'lecture': 'Lecture', 'master_class': 'Master Class', /* ... add others ... */ };
    return map[code] || code;
  }
}
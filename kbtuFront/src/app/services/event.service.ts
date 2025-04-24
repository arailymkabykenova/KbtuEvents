import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs'; 
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseApiUrl = 'http://127.0.0.1:8000';
  private eventsApiBase = `${this.baseApiUrl}/api/events/`;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {

    return this.http.get<Event[]>(this.eventsApiBase);
  }

  getEventById(id: number): Observable<Event> {
  
      return this.http.get<Event>(`${this.eventsApiBase}${id}/`);
  }

  getEventsByDate(date: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.eventsApiBase}by_date/?date=${date}`);
  }

  registerForEvent(eventId: number): Observable<any> {
    const payload = { event_id: eventId };
    return this.http.post(`${this.eventsApiBase}register/`, payload);
  }

  addEventFeedback(payload: { event_id: number; comment: string; rating: number }): Observable<any> {
    return this.http.post(`${this.eventsApiBase}feedback/`, payload);
  }
}
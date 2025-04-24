export interface Event {
  id: number;
  name: string;
  location?: string;
  topic?: string;
  speakers?: string;
  school: string;
  event_type: string;
  event_date: string; 
  event_time: string; 
  image?: string;     
  imageUrl?: string;   
}
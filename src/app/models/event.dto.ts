export class EventDTO {
  eventId?: string;
  userId?: string;
  title: string;
  start: Date;
  end: Date;
  color: string;

  constructor(
    title: string, 
    start: Date, 
    end: Date,
    color: string
  ) {
    this.title = title;
    this.start = start;
    this.end = end;
    this.color = color;
  }
}


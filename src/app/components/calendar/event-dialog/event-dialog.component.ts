import { Component, OnInit, Inject } from '@angular/core';
import { EventDTO } from '../../../models/event.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { formatDateForDisplay } from '../../../utils/format-date.utils';

export interface EventDialogData {
  clickedDate: string;      
  event?: EventDTO;         
}

@Component({
  selector: 'app-event-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent implements OnInit {
  eventData: EventDTO = {
    title: '',
    start: new Date(),
    end: new Date()
  };

  startValue: string = '';
  endValue: string = '';

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDialogData
  ) {}

  ngOnInit(): void {
    if (this.data.event) { 
      // Edit mode: pre-fill with the event’s data
      this.eventData = { ...this.data.event };
      this.startValue = formatDateForDisplay(this.eventData.start);
      this.endValue = formatDateForDisplay(this.eventData.end);
    } else {
      // Add mode: use clickedDate to prefill both start and end
      this.startValue = this.data.clickedDate;
      this.endValue = this.data.clickedDate;
      this.eventData.start = new Date(this.data.clickedDate);
      this.eventData.end = new Date(this.data.clickedDate);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAddEvent(): void {
    if (!this.eventData.title.trim()) {
      return;
    }
    // Convert the string dates to Date
    this.eventData.start = new Date(this.startValue);
    this.eventData.end = new Date(this.endValue);
    this.dialogRef.close(this.eventData);
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { EventDTO } from '../../../models/event.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { formatDateForAPI } from '../../../utils/date-formatting';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

export interface EventDialogData {
  clickedDate: string;      
  event?: EventDTO;         
}

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
  ],
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent implements OnInit {
  eventData!: EventDTO;
  startValue!: Date;
  endValue!: Date;
  colorValue = '';

  // Set values for users to choose in the form
  safePalette: string[] = [
    '#9357c7', 
    '#c2185b', 
    '#f57c00', 
    '#fbc02d', 
    '#43a047', 
    '#1976d2', 
    '#0097a7', 
    '#f06292', 
    '#8D6E63', 
    '#455a64'  
  ];

  constructor(
    private dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDialogData,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const { event, clickedDate } = this.data;
    const defaultColor = '#9357c7';

    const start = event?.start ? new Date(event.start) : new Date(clickedDate || '');
    const end = event?.end ? new Date(event.end) : start;

    this.startValue = isNaN(start.getTime()) ? new Date() : start;
    this.endValue   = isNaN(end.getTime())   ? this.startValue : end;

    this.eventData = {
      title: event?.title || '',
      start: this.startValue,
      end: this.endValue,
      color: event?.color ?? defaultColor,
      userId: event?.userId ?? ''
    };

    this.colorValue = this.eventData.color;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onAddOrUpdateEvent() {
    if (!this.eventData.title.trim()) return;

    // Update eventData with the chosen dates and color
    Object.assign(this.eventData, {
      start: new Date(formatDateForAPI(this.startValue)),
      end:   new Date(formatDateForAPI(this.endValue)),
      color: this.colorValue
    });

    const payload = this.data.event
      ? { action: 'update', eventData: this.eventData }
      : this.eventData;

    this.dialogRef.close(payload);
  }

  onDeleteEvent() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this event? This action cannot be undone.' }
    });

    dialogRef.afterClosed().subscribe((confirm: boolean) => { 
      if (confirm) {
        this.dialogRef.close({ action: 'delete' });
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-profile',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './delete-profile.component.html',
  styleUrl: './delete-profile.component.scss'
})
export class DeleteProfileComponent {
  constructor(private dialogRef: MatDialogRef<DeleteProfileComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

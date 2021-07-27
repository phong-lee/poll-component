import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Result} from "../constant/constant";

@Component({
  selector: 'result-dialog',
  template: `
    <h1 mat-dialog-title>RESULT</h1>
    <mat-divider></mat-divider>
    <div mat-dialog-content>
      <h2 style="font-size: large; margin: 0; color: yellowgreen">{{data.title}}</h2>
      <h3>Most Chosen Options:
        <button mat-button color="accent" *ngFor="let mostSlider of data.mostSliders">
          <i>{{mostSlider.name}} ({{mostSlider.chosen.length}})</i>
        </button>
      </h3>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-raised-button color="primary" [mat-dialog-close]="true" cdkFocusInitial>New Poll!</button>
      <button mat-raised-button (click)="onNoClick()" mat-dialog-close>Close</button>
    </div>
  `,
})
export class ResultDialog {
  constructor(public dialogRef: MatDialogRef<ResultDialog>,
              @Inject(MAT_DIALOG_DATA) public data: Result) {
    this.dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    })
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ResultDialog} from "../result-dialog/result-dialog.component";
import {Result} from "../constant/constant";

@Component({
  selector: 'app-poll',
  template: '<app-slider [refreshComponent]="newPoll" (onHavingResult)="showResult($event)"></app-slider>',
  encapsulation: ViewEncapsulation.None
})
export class PollComponent {
  newPoll = false;
  constructor(public dialog: MatDialog) {}

  showResult(event: Result) {
    const dialogRef = this.dialog.open(ResultDialog, {data: event})
    dialogRef.afterClosed().subscribe(result => {
      this.newPoll = result;
    })
  }
}

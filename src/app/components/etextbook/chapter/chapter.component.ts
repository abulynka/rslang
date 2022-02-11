import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
})
export class ChapterComponent implements OnInit {
  public pageEvent: PageEvent;

  public constructor() {
    this.pageEvent = new PageEvent();
  }

  public ngOnInit(): void {
    // empty
    return;
  }

  public getServerData(event: PageEvent): PageEvent {
    return event;
  }
}

import { Observable } from 'rxjs';
import { ExportService, IReportExportStatusTracker } from '../export.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  status$: Observable<IReportExportStatusTracker>;

  allAtOnceStatus$: Observable<IReportExportStatusTracker>;

  arrayOfStatus: Array<Observable<IReportExportStatusTracker>> = [];

  constructor(private exportservice: ExportService) { }

  ngOnInit() {
  }

  start() {
    this.exportservice.startLongProcess().subscribe((response: { id: string }) => {
      this.status$ = this.exportservice.subscribeToExportStatus(response.id);
    });
  }

  startAllAtOnce() {
    this.allAtOnceStatus$ = this.exportservice.startAndSubscribeAllAtOnce();
  }

  addLongProcess() {
    this.arrayOfStatus.push(this.exportservice.startAndSubscribeAllAtOnce());
  }

}

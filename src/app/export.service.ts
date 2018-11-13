import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Observable } from 'rxjs';
import { switchMap, tap, takeWhile } from 'rxjs/operators';

export interface IReportExportStatusTracker {
  status: 'Pending' | 'Complete';
  progress: number;
  downloadLink: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  pollingInterval = 2000;
  constructor(private http: HttpClient) { }

  startLongProcess() {
    return this.http.post<{ id: string}>('http://localhost:3000/new-process', {});
  }

  getStatus(id: string): Observable<IReportExportStatusTracker> {
    return this.http.get<IReportExportStatusTracker>(`http://localhost:3000/status/${id}`);
  }

  subscribeToExportStatus(id: string): Observable<IReportExportStatusTracker> {
    let isDone = false;
    return interval(this.pollingInterval)
    .pipe(
      switchMap(() => this.getStatus(id)),
      // takeWhile stops the observable once it matches so we can't put the test in there otherwise we never see 100%
      takeWhile(() => !isDone),
      // Putting the tap AFTER takeWhile means that it will send the final step then complete
      tap((status) => isDone = status.progress === 100),
      tap(console.log) // Can remove, just to show it is completing
    );
  }

  startAndSubscribeAllAtOnce(): Observable<IReportExportStatusTracker> {
    return this.startLongProcess()
    .pipe(
      switchMap(response => this.subscribeToExportStatus(response.id))
    );
  }
}

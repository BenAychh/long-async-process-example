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
    return this.http.post('http://localhost:3000/new-process', {});
  }

  getStatus(id: string): Observable<IReportExportStatusTracker> {
    return this.http.get<IReportExportStatusTracker>(`http://localhost:3000/status/${id}`);
  }

  subscribeToExportStatus(id: string): Observable<IReportExportStatusTracker> {
    let isDone = false;
    return interval(this.pollingInterval)
    .pipe(
      switchMap(() => this.getStatus(id)),
      takeWhile(() => !isDone),
      tap((status) => isDone = status.progress === 100)
    );
  }

  startAndSubscribeAllAtOnce(): Observable<IReportExportStatusTracker> {
    return this.http.post<{ id: string }>('http://localhost:3000/new-process', {})
    .pipe(
      switchMap(response => this.subscribeToExportStatus(response.id))
    );
  }
}

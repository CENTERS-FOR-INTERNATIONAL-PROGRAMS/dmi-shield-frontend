import { CommunicationService } from '../communication.service';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { config } from '../../config/config';
import { AwarenessService } from '../awareness.service';
import { Router } from '@angular/router';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private awareness: AwarenessService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    handler: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return handler.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          // Clear all localStorage data
          this.awareness.removeUserData();

          // Navigate to login page
          this.router.navigate(['/authentication/login']);
        }

        return throwError(() => error);
      }),
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private communication: CommunicationService,
    private http: HttpClient,
    private awareness: AwarenessService,
  ) {}

  deleteRequest(endpoint: string): Observable<any> {
    const url = config.API_ENDPOINT + endpoint;
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${this.handleGetToken()}`,
    });

    return this.http.delete(url, { headers });
  }

  postRequest(endpoint: string, data: any): Observable<any> {
    const url = config.API_ENDPOINT + endpoint;
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${this.handleGetToken()}`,
    });

    return this.http.post(url, data, { headers });
  }

  patchRequest(endpoint: string, data: any): Observable<any> {
    const url = config.API_ENDPOINT + endpoint;
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${this.handleGetToken()}`,
    });

    return this.http.patch(url, data, { headers: headers });
  }

  putFileRequest(preSignedUrl: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.put(preSignedUrl, formData);
  }

  get(endpoint: string): Observable<any> {
    const url = config.API_ENDPOINT + endpoint;

    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${this.handleGetToken()}`,
    });

    return this.http.get(url, { headers: headers });
  }

  getAll(endpoint: string): Observable<any> {
    const url = config.API_ENDPOINT + endpoint;

    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${this.handleGetToken()}`,
    });

    return this.http.get(url, { headers: headers });
  }

  handleGetToken(): string {
    const token = this.awareness.getUserData()?.token;
    if (token && token != '') {
      return token;
    } else {
      return '';
    }
  }
}

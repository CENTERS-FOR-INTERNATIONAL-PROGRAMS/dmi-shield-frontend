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
    private communication: CommunicationService,
  ) {}

  parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }

  intercept(
    req: HttpRequest<any>,
    handler: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return handler.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          let token = this.awareness.getToken();

          if (token) {
            // Decode auth token to get expiry time
            let { exp } = this.parseJwt(token);
            let nowTimeInUnix = Math.floor(Date.now() / 1000);

            // Check if current time is after token expiry
            if (nowTimeInUnix >= exp) {
              // Clear all localStorage data
              this.awareness.removeUserData();

              this.communication.showToast(
                'Session Expired. Kindly sign in again',
              );

              // Navigate to login page
              this.router.navigate(['/authentication/login']);
            }
          }
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
    private http: HttpClient,
    private awareness: AwarenessService,
  ) {}

  deleteRequest(endpoint: string): Observable<any> {
    const url = config.API_ENDPOINT + endpoint;
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${this.awareness.getToken()}`,
    });

    return this.http.delete(url, { headers });
  }

  postRequest(endpoint: string, data: any): Observable<any> {
    const url = config.API_ENDPOINT + endpoint;
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${this.awareness.getToken()}`,
    });

    return this.http.post(url, data, { headers });
  }

  patchRequest(endpoint: string, data: any): Observable<any> {
    const url = config.API_ENDPOINT + endpoint;
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${this.awareness.getToken()}`,
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
      Authorization: `Bearer ${this.awareness.getToken()}`,
    });

    return this.http.get(url, { headers: headers });
  }

  getAll(endpoint: string): Observable<any> {
    const url = config.API_ENDPOINT + endpoint;

    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${this.awareness.getToken()}`,
    });

    return this.http.get(url, { headers: headers });
  }
}

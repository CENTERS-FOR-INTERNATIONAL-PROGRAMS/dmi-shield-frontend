import { CommunicationService } from '../communication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { config } from '../../config/config';
import { IModelStatus } from '../../interfaces/IModel.model';
import { ApiResponse } from '../../interfaces/IAuth.model';
import { AwarenessService } from '../awareness.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private communication: CommunicationService,
    private http: HttpClient,
    private awareness: AwarenessService,
    private router: Router
  ) {}

  postRequest(endpoint: string, data: any): Observable<any> {
    const url = config.API_ENDPOINT + endpoint;
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${this.handleGetToken()}`,
    });
    return new Observable((observer) => {
      this.http.post(url, data, { headers: headers }).subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  patchRequest(endpoint: string, data: any): Observable<any> {
    const url = config.API_ENDPOINT + endpoint;
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${this.handleGetToken()}`,
    });
    return new Observable((observer) => {
      this.http.patch(url, data, { headers: headers }).subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  putFileRequest(preSignedUrl: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return new Observable((observer) => {
      this.http.put(preSignedUrl, formData).subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  get(endpoint: string): Observable<any> {
    const url = config.API_ENDPOINT + endpoint;

    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${this.handleGetToken()}`,
    });

    return new Observable((observer) => {
      this.http.get(url, { headers: headers }).subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  getAll(endpoint: string): Observable<any> {
    const url = config.API_ENDPOINT + endpoint;

    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
    });

    return new Observable((observer) => {
      this.http.get(url, { headers: headers }).subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  handleGetToken(): string {
    const token = this.awareness.getUserData().token;
    if (token != '') {
      return token;
    } else {
      this.router.navigate(['/home']);
      return '';
    }
  }
}

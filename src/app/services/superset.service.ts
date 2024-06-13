import { Injectable } from '@angular/core';
import { config } from '../config/config';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { embedDashboard } from '@superset-ui/embedded-sdk';

@Injectable({ providedIn: 'root' })

export class SupersetService {
    constructor(private http: HttpClient) { }

    /**
    * @returns { access token }
    */
    private fetchAccessToken(): Observable<any> {
        const com_payload = {
            "username": config.SUPERSET.USER_ADMINISTRATOR.USERNAME,
            "password": config.SUPERSET.USER_ADMINISTRATOR.PASSWORD,
            "provider": config.SUPERSET.API_PROVIDER,
            "refresh": true
        };

        const com_options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, X-Custom-Header, Upgrade-Insecure-Requests',
            })
        };

        return this.http.post<any[]>(`${config.SUPERSET.API_ENDPOINT}/login`, com_payload, com_options).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    /**
     * 
     * @returns { guest token } using @param { accessToken }
     */
    private fetchGuestToken(accessToken: any, dashboard_id: string): Observable<any> {
        const body = {
            "resources": [
                {
                    "type": "dashboard",
                    "id": dashboard_id,
                }
            ],
            "rls": [], //Row Level Security e.g. { "clause": "1" }
            "user": {
                "username": config.SUPERSET.USER_GUEST.USERNAME,
                "first_name": "",
                "last_name": "",
            }
        };

        const acc = accessToken["access_token"];
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${acc}`,
        });

        return this.http.post<any>(`${config.SUPERSET.API_ENDPOINT}/guest_token/`, body, { headers });
    }
    /**
     * @returns { guest Token }
     */
    getGuestToken(dashboard_id: string): Observable<any> {
        return this.fetchAccessToken().pipe(
            catchError((error) => {
                return error;
            }),
            switchMap((accessToken: any) => this.fetchGuestToken(accessToken, dashboard_id))
        );
    }
    /**
     * @returns { dashboard }
     */
    embedDashboard(elem: any, dashboard_id: string): Observable<void> {
        return new Observable((observer) => {
            this.getGuestToken(dashboard_id).subscribe(
                (token) => {
                    embedDashboard({
                        id: dashboard_id,
                        supersetDomain: config.SUPERSET.DOMAIN,
                        mountPoint: elem,
                        fetchGuestToken: () => token["token"],
                        dashboardUiConfig: {
                            hideTitle: true,
                            hideChartControls: true,
                            hideTab: true,
                        },
                    });
                    observer.next();
                    observer.complete();
                },
                (error) => {
                    observer.error(error);
                }
            );
        });
    }

    private handleError(error: HttpErrorResponse) {
        return "error";
    }
}
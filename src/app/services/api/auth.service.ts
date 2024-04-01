import {CommunicationService} from "../communication.service";
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {config} from "../../config/config";
import {IModelStatus} from "../../interfaces/IModel.model";
import {ApiResponse} from "../../interfaces/IAuth.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  constructor(private communication: CommunicationService, private http: HttpClient) {
  }




  postRequest(endpoint: string, data: any): Observable<any> {

    const url = config.API_ENDPOINT + endpoint;
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json'
    });
    return new Observable(observer => {
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
}

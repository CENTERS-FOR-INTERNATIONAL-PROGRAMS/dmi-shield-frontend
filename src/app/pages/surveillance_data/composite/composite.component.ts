import {Component, OnInit} from '@angular/core';
import {AwarenessService} from "../../../services/awareness.service";
import {Surveillance} from "../../../models/Surveillance.model";
import {CommunicationService} from "../../../services/communication.service";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../services/api/api.service";
import {ApiResponse, ApiResponseStatus} from "../../../interfaces/IAuth.model";

@Component({
  selector: 'app-composites',
  templateUrl: './composite.component.html'
})
export class CompositeComponent implements OnInit{
  Surveillance: Surveillance[] = [];
  TableHeaders: string[] = [ "file_original_name", "file_type", "validated", "createdDate", "actions"];

  FilterSurveillanceData: Surveillance = new Surveillance();

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: ""
  }

  constructor(private awareness: AwarenessService, private communication: CommunicationService, private http: HttpClient,
              private apiService: ApiService) { }

  ngOnInit(): void {
    // this.loadComposite();
    this.loadComposites();
  }

  loadComposites(){
    const url = `files/uploads/resources?page[limit]=1&page[offset]=0`;
    this.apiService.get('files/uploads/resources',).subscribe({
      next: (res) => {
        this.ApiResponseStatus.success = true;
        this.Surveillance = res.data;
      },
      error: (error) =>{

      },
      complete: () =>{
        this.ApiResponseStatus.processing = false;
        console.log(this.FilterSurveillanceData)
      },
    });
  }

  loadComposite() {
    this.FilterSurveillanceData.user_id = this.awareness.UserInstance._id;
    this.FilterSurveillanceData.acquireComposite((Surveillance: Surveillance[]) => {
      this.Surveillance = Surveillance;
      console.log("Allll", this.Surveillance);
    }, (error: any) => {
      // TODO! Handle errors
      console.log("Error", error);
    });
  }

  deleteInstance(doc: any){
    let SurveillanceInstance = new  Surveillance();

    SurveillanceInstance = doc;
    SurveillanceInstance.deleted = true;
    SurveillanceInstance.modifiedDate = SurveillanceInstance.updateModifiedDate();

    SurveillanceInstance.putInstance((res: any) =>{
      this.communication.showSuccessToast();

      SurveillanceInstance.parseComposite(SurveillanceInstance);

      this.loadComposite();

    }, (err: any) =>{
      console.error('error', err)
      this.communication.showFailedToast();
    });
  }


  downloadFile(file: Surveillance): boolean {
    const fileName = `${file._id}.${file.file_extension}`;
    const originalFileName = `${file.file_original_name}.${file.file_extension}`;

    this.http.get(file.file_url, { responseType: 'blob' }).subscribe(
      (data: Blob) => {
        if (data) {
          this.downloadFileByBlob(data, originalFileName);
        } else {
          console.error('No file data found');
        }
      },
      error => {
        console.error('Error downloading file:', error);
      }
    );

    return true;
  }

  private downloadFileByBlob(blob: Blob, fileName: string): void {
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', downloadUrl);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl); // Clean up
  }


  submitInstance() {

  }

  parseDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }

  getValidityStatus(status: boolean): string{
    if(status === true){
      return "Valid";
    }
    return "Invalid";
  }
}

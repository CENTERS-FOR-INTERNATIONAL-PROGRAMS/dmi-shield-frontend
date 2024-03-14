import {Component, OnInit} from '@angular/core';
import {AwarenessService} from "../../../services/awareness.service";
import {Surveillance} from "../../../models/Surveillance.model";
import {CommunicationService} from "../../../services/communication.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-composites',
  templateUrl: './composite.component.html'
})
export class CompositeComponent implements OnInit{
  Surveillance: Surveillance[] = [];
  TableHeaders: string[] = [ "file_original_name", "file_type", "validated", "createdDate", "actions"];

  FilterSurveillanceData: Surveillance = new Surveillance();

  constructor(private awareness: AwarenessService, private communication: CommunicationService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadComposite()
  }

  loadComposite() {
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


  downloadFile(fileId: Surveillance): boolean {
    const fileName = `${fileId._id}.${fileId.file_extension}`;
    const originalFileName = `${fileId.file_original_name}.${fileId.file_extension}`;
    const fileIds = [fileName];

    if (fileIds.length === 0) {
      console.error('No file IDs provided');
      return false;
    }

    const url = 'http://localhost:3000/files';

    this.http.post(url, fileIds, { responseType: 'blob' }).subscribe(
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

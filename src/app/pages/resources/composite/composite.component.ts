import {Component, OnInit} from '@angular/core';
import {AwarenessService} from "../../../services/awareness.service";
import {CommunicationService} from "../../../services/communication.service";
import {HttpClient} from "@angular/common/http";
import {Resource} from "../../../models/Resources.model";

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
})
export class CompositeComponent implements OnInit{
  Resource: Resource[] = [];
  TableHeaders: string[] = ["file_name", "actions"];
  FileNames: string[] = [];
  FilterResource: Resource = new Resource();

  constructor(private awareness: AwarenessService, private communication: CommunicationService, private http: HttpClient) { }


  ngOnInit() {
    this.getFileNames()
  }

  loadComposite() {
    this.FilterResource.acquireComposite((Surveillance: Resource[]) => {
      this.Resource = Surveillance;
      console.log("Allll", this.Resource);
    }, (error: any) => {
      // TODO! Handle errors
      console.log("Error", error);
    });
  }

  downloadFile(fileName: string): void {
    const filePath = `assets/${fileName}`;
    this.http.get(filePath, { responseType: 'blob' }).subscribe((data: Blob) => {
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(data);
      downloadLink.setAttribute('download', fileName);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }


  getFileNames(): void {
    const url = 'http://localhost:3000/resources';

    this.http.get<{ fileNames: string[] }>(url)
      .subscribe(data => {
        this.FileNames = data.fileNames;
        console.log('Resource file names:', this.FileNames);
        // Process the file names as needed
      }, error => {
        console.error('Error fetching resource file names:', error);
        this.FileNames = ["IDSR Technical Guidelines for Kenya Final 06.09.2022-7.pdf", "ADAM MOH TRAINING updated-2.pptx"];
      });
  }

  downloadFileStream(fileId: string){
    const fileName = fileId;
    const fileIds = [fileName];

    this.downloadFile(fileName);

    // if (fileIds.length === 0) {
    //   console.error('No file IDs provided');
    //   return false;
    // }
    //
    // const url = 'http://localhost:3000/files';
    //
    // this.http.post(url, fileIds, { responseType: 'blob' }).subscribe(
    //   (data: Blob) => {
    //     if (data) {
    //       this.downloadFileByBlob(data, fileId);
    //     } else {
    //       console.error('No file data found');
    //     }
    //   },
    //   error => {
    //     console.error('Error downloading file:', error);
    //   }
    // );
    //
    // return true;
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

}

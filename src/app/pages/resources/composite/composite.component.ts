import {Component, OnInit} from '@angular/core';
import {AwarenessService} from "../../../services/awareness.service";
import {CommunicationService} from "../../../services/communication.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../../../models/User.model";
import {Resource} from "../../../models/Resource.model";

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
})
export class CompositeComponent implements OnInit{
  Resource: Resource[] = [];
  TableHeaders: string[] = ["file_original_name", "actions"];
  FileNames: string[] = [];
  FilterResource: Resource = new Resource();
  UserInstance : User = new User;

  constructor(public awareness: AwarenessService, private communication: CommunicationService, private http: HttpClient) { }


  ngOnInit() {
    // this.getFileNames()
    this.loadComposite();
    this.awaken();
  }

  awaken(){
    this.awareness.awaken(() => {
      this.UserInstance._id = this.awareness.getFocused("authenticated");

      if (this.UserInstance._id != "") {
        this.UserInstance.acquireInstance((doc: any) => {
          this.UserInstance.parseInstance(doc);
        }, (err: any) => {
          //TODO! Handle errors
        });
      }
    });
  }
  loadComposite() {
    // this.FilterResource.acquireComposite((Resource: Resource[]) => {
    //   this.Resource = Resource;
    //   console.log("Allll", this.Resource);
    // }, (error: any) => {
    //   // TODO! Handle errors
    //   console.log("Error", error);
    // });

    this.FilterResource.acquireComposite((Resource: Resource[]) => {
      this.Resource = Resource;
      console.log("Allll", this.Resource);
    }, (error: any) => {
      // TODO! Handle errors
      console.log("Error", error);
    });
  }

  downloadFile(fileId: Resource): boolean {
    const fileName = `${fileId._id}.${fileId.file_extension}`;
    const originalFileName = `${fileId.file_original_name}.${fileId.file_extension}`;
    const fileIds = [fileName];

    if (fileIds.length === 0) {
      console.error('No file IDs provided');
      return false;
    }

    const url = 'http://localhost:3000/files-resource';

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

}

import {Component, OnInit} from '@angular/core';
import {MField} from "../../../models/MField.model";
import {NgxFileDropEntry} from "ngx-file-drop";
import {CompositeFormControls} from "../../../models/CompositeFormControls.model";
import {Resource} from "../../../models/Resource.model";
import {CommunicationService} from "../../../services/communication.service";
import {AwarenessService} from "../../../services/awareness.service";
import {HttpClient} from "@angular/common/http";
import {Guid} from "guid-typescript";
import {IModelStatus} from "../../../interfaces/IModel.model";
import {Observable} from "rxjs";
import {config} from "../../../config/config";

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss']
})
export class ModifyComponent implements OnInit{

  ResourceInstance = new Resource();
  allowedFiles: string=  ".csv, .xlsx, .xls, .docx, .pdf"
  public Files: NgxFileDropEntry[] = [];
  public UploadedFiles: any;
  ResourceFormControl : CompositeFormControls = {}
  ResourceDataList: Resource[] = [];
  ValidatedFileTypes: string[] = ["csv", "xlsx", "xls"]
  DocumentTypes: string[] = ["SARI", "CHOLERA", "POLIO"]
  fileUploaderUrl = config.FILE_UPLOADER_URL;

  UIMStatus: IModelStatus = {
    ms_processing:false,
    ms_action_result: false
  }


  constructor(private communication: CommunicationService, private awareness: AwarenessService, private http: HttpClient) {
  }


  ngOnInit() {
  }

  SubmitInstance(){
    if(this.Files.length < 1){
      this.UIMStatus.ms_action_result = true;
      this.communication.showToast("Kindly add at least one file");
    }

    for (const SurveillanceInstance of this.ResourceDataList) {
      SurveillanceInstance.putInstance((res: any) =>{
        this.communication.showSuccessToast();

        SurveillanceInstance.parseComposite(SurveillanceInstance);

      }, (err: any) =>{
        console.error('error', err)
        this.communication.showFailedToast();
      });
    }
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.Files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          let ResourceInstance = new  Resource();
          if (ResourceInstance._id == "")
          {
            ResourceInstance._id =  this.generateUniqueId();
          }
          ResourceInstance.file_original_name = droppedFile.fileEntry.name;
          ResourceInstance.user_id = this.awareness.UserInstance._id;

          const parts = droppedFile.fileEntry.name.split('.');
          ResourceInstance.file_extension = parts[parts.length - 1];

          if(this.fileUploaderUrl != ""){
            this.uploadFile(file, ResourceInstance._id).subscribe(
              (res: any) => {
                console.log(res);
                ResourceInstance.file_url = res;
              },
              (error: any) =>{
                console.log(error);
              }
            );
          }


          this.ResourceDataList.push(ResourceInstance);
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  uploadFile(file: File, fileId: string): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);

    // return this.http.post(`http://localhost:5055/Upload/UploadFile?FileId=${fileId}`, formData, {
    //   responseType: 'text'
    // });

    let url = `${this.fileUploaderUrl}/Upload/UploadFile?FileId=${fileId}`;
    return this.http.post(url, formData, {
      responseType: 'text'
    });
  }

  generateUniqueId(){
    return Guid.create().toString();
  }

  removeFile(index: number) {
    this.Files.splice(index, 1);
  }

  public fileOver(event: any){
    console.log(event);
  }

  public fileLeave(event: any){
    console.log(event);
  }

}

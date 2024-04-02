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
import {ApiResponseStatus, CreatePreSignedUrlData, UserAuthenticationData} from 'src/app/interfaces/IAuth.model';
import {ApiService} from "../../../services/api/api.service";

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss']
})
export class ModifyComponent implements OnInit{

  ResourceInstance = new Resource();
  allowedFiles: string=  ".csv, .xlsx, .xls, .docx, .pdf"
  public Files: NgxFileDropEntry[] = [];
  ResourceDataList: Resource[] = [];
  fileData: CreatePreSignedUrlData;

  UIMStatus: IModelStatus = {
    ms_processing:false,
    ms_action_result: false
  }

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: ""
  }

  constructor(private communication: CommunicationService, private awareness: AwarenessService, private http: HttpClient,
              private apiService: ApiService) {
  }

  ngOnInit() {
  }

  SubmitInstance(){
    if(this.Files.length < 1){
      this.UIMStatus.ms_action_result = true;
      this.communication.showToast("Kindly add at least one file");
    }
    this.uploadToApi();
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

          this.ResourceDataList.push(ResourceInstance);
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
  }

  uploadToApi(){
    this.ApiResponseStatus.processing = true;
    const totalFiles = this.Files.length;
    let successfulUploads = 0;

    for (const droppedFile of this.Files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          let resourceInstance = new  Resource();

          resourceInstance.file_original_name = droppedFile.fileEntry.name;
          resourceInstance.user_id = this.awareness.UserInstance._id;

          const parts = droppedFile.fileEntry.name.split('.');
          resourceInstance.file_extension = parts[parts.length - 1];

          this.fileData = {
            data: {
              attributes: {
                filename: file.name,
                original_filename: file.name,
                mime: file.type,
                type : "resource",
                size: file.size
              },
              type: 'File CreateUpload'
            }
          };

          this.apiService.postRequest('files/uploads/create', this.fileData).subscribe({
            next: (response) => {

              if(response.data.attributes.url != ''){
                console.log('preSignedUrl', response.data.attributes.url);
                this.pushToBucket(response.data.attributes.url, file);
                successfulUploads++;
              }

              if (successfulUploads === totalFiles) {
                this.ApiResponseStatus.processing = false;
                this.ApiResponseStatus.success = true;
              }
            },
            error: (error) =>{
              this.ApiResponseStatus.processing = false;
              this.ApiResponseStatus.success = false;
              console.log(error);
            },
            complete: () =>{
            },
          });

          this.ResourceDataList.push(resourceInstance);
        });
      }
    }
  }

  pushToBucket(preSignedUrl: string, file: File){
    this.apiService.putFileRequest(preSignedUrl, file).subscribe({
      next: (response) => {
      },
      error: (error) =>{
        // this.ApiResponseStatus.processing = false;
        // this.ApiResponseStatus.success = false;
        throw new Error(error);
      },
      complete: () =>{
      },
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

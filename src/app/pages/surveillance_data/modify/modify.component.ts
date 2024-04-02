import {Component, OnInit} from '@angular/core';
import {MField} from "../../../models/MField.model";
import {CommunicationService} from "../../../services/communication.service";
import {AwarenessService} from "../../../services/awareness.service";
import {HttpClient} from "@angular/common/http";
import {NgxFileDropEntry} from "ngx-file-drop";
import {CompositeFormControls} from "../../../models/CompositeFormControls.model";
import {FormControl} from "@angular/forms";
import {Surveillance} from "../../../models/Surveillance.model";
import {IModelStatus} from "../../../interfaces/IModel.model";
import {Guid} from "guid-typescript";
import {Observable} from "rxjs";
import {config} from "../../../config/config";
import {ApiService} from "../../../services/api/api.service";
import {ApiResponseStatus, CreatePreSignedUrlData} from 'src/app/interfaces/IAuth.model';
import {Resource} from "../../../models/Resource.model";

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html'
})
export class ModifyComponent implements OnInit{
  MFieldInstance = new MField();
  allowedFiles: string=  ".csv, .xlsx, .xls"
  public Files: NgxFileDropEntry[] = [];
  SurveillanceDataList: Surveillance[] = [];
  ValidatedFileTypes: string[] = ["csv", "xlsx", "xls"]
  DocumentTypes: string[] = ["moh505", "sari"]
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

  ngOnInit(): void {
    this.MFieldInstance._id = this.awareness.getFocused("mfield");

    if (this.MFieldInstance._id != "") {
      this.MFieldInstance.acquireInstance((doc: any) => {
        this.MFieldInstance.parseInstance(doc);
      }, (err: any) => {
        // TODO! Handle errors
      });
    }
  }


  public dropped(files: NgxFileDropEntry[]) {
    this.Files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          let SurveillanceInstance = new  Surveillance();
          if (SurveillanceInstance._id == "")
          {
            SurveillanceInstance._id =  this.generateUniqueId();
          }
          SurveillanceInstance.file_original_name = droppedFile.fileEntry.name;
          SurveillanceInstance.user_id = this.awareness.UserInstance._id;

          const parts = droppedFile.fileEntry.name.split('.');
          SurveillanceInstance.file_extension = parts[parts.length - 1];

          this.SurveillanceDataList.push(SurveillanceInstance);


        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
  }


  public fileOver(event: any){
    console.log(event);
  }

  public fileLeave(event: any){
    console.log(event);
  }

  removeFile(index: number) {
    this.Files.splice(index, 1);
  }

  SubmitInstance(){
    if(this.Files.length < 1){
      this.UIMStatus.ms_action_result = true;
      this.communication.showToast("Kindly add at least one file");
    }

    this.uploadToApi();
  }

  generateUniqueId(){
    return Guid.create().toString();
  }

  assignDocumentType(event: any, fileIndex: number): void {
    this.SurveillanceDataList[fileIndex].file_type =  event.target.value.toLowerCase();
    console.log(this.SurveillanceDataList);

  }

  describeFileType(File: any): boolean {
    const parts = File.fileEntry.name.split('.');
    let extension = parts[parts.length - 1].toLowerCase();

    if (this.ValidatedFileTypes && this.ValidatedFileTypes.includes(extension)) {
      return true;
    }
    return false;
  }

  getFileExtension(File: string): string {
    const parts = File.split('.');
    return  parts[parts.length - 1].toLowerCase();

  }

  uploadToApi(){
    this.ApiResponseStatus.processing = true;
    const totalFiles = this.Files.length;
    let successfulUploads = 0;

    for (const [index, droppedFile] of this.Files.entries()) {
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
                type : this.SurveillanceDataList[index].file_type,
                size: file.size
              },
              type: 'File CreateUpload'
            }
          };

          this.apiService.postRequest('files/uploads/create', this.fileData).subscribe({
            next: (response) => {
              if(response.data.attributes.url != ''){
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

          this.SurveillanceDataList.push(resourceInstance);
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



}

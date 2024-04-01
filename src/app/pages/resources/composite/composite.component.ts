import {Component, OnInit} from '@angular/core';
import {AwarenessService} from "../../../services/awareness.service";
import {CommunicationService} from "../../../services/communication.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../../../models/User.model";
import {Resource, ResourceModelApi} from "../../../models/Resource.model";
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import {ApiService} from "../../../services/api/api.service";

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
})
export class CompositeComponent implements OnInit{
  Resource: Resource[] = [];
  ResourceModel: ResourceModelApi[] = [];
  TableHeaders: string[] = ["original_filename", "actions"];
  FileNames: string[] = [];
  FilterResource: Resource = new Resource();
  UserInstance : User = new User;

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: ""
  }

  constructor(public awareness: AwarenessService, private communication: CommunicationService, private http: HttpClient,
              private apiService: ApiService) { }


  ngOnInit() {
    this.loadComposites();
  }

  loadComposites(){
    this.ApiResponseStatus.processing = true;
    this.apiService.get('files/uploads/resources',).subscribe({
      next: (res) => {
        this.ApiResponseStatus.success = true;
        this.ResourceModel = res.data.map(item => item.attributes);

      },
      error: (error) =>{

      },
      complete: () =>{
        this.ApiResponseStatus.processing = false;
      },
    });
  }

  // awaken(){
  //   this.awareness.awaken(() => {
  //     this.UserInstance._id = this.awareness.getFocused("authenticated");
  //
  //     if (this.UserInstance._id != "") {
  //       this.UserInstance.acquireInstance((doc: any) => {
  //         this.UserInstance.parseInstance(doc);
  //       }, (err: any) => {
  //         //TODO! Handle errors
  //       });
  //     }
  //   });
  // }


}

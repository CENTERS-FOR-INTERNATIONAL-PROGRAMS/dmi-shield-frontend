import {Component, OnInit} from '@angular/core';
import {NotificationModel} from "../../../models/Notification.model";
import {ApiResponseStatus, MarkNotificationData, UserAuthenticationData} from 'src/app/interfaces/IAuth.model';
import {ApiService} from "../../../services/api/api.service";
import {AwarenessService} from "../../../services/awareness.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
  styleUrls: ['./composite.component.scss']
})
export class CompositeComponent implements OnInit {

  Notifications: NotificationModel[] = [];
  dataSource = new MatTableDataSource(this.Notifications);
  notificationPayload: MarkNotificationData;
  selectedNotifications: string[] = []

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: ""
  }

  constructor(private apiService: ApiService, public awareness: AwarenessService) {
  }

  ngOnInit(): void {
    this.getUser();
    this.getApiNotifications();
  }


  getUser(){
    this.awareness.UserInstance =  this.awareness.getUserData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getApiNotifications(){
    const url = `notification?user_id=${this.awareness.UserInstance.id}`;
    this.apiService.get(url).subscribe({
      next: (res) => {
        this.ApiResponseStatus.success = true;

        this.Notifications = res.data.map(item => ({
          id: item.id,
          ...item.attributes
        }));
      },
      error: (error) =>{
        this.ApiResponseStatus.processing = false;
      },
      complete: () =>{
        this.ApiResponseStatus.processing = false;
      },
    });
  }


  markNotificationsRead() {
    this.ApiResponseStatus.processing = true;
    const userId = this.awareness.UserInstance.id;

    if (!userId) {
      this.ApiResponseStatus.processing = false;
      return;
    }


    this.selectedNotifications.forEach(notificationId => {
      this.notificationPayload = {
        data: {
          attributes: {
            status: "read"
          },
          id: notificationId,
          type: 'Notifications'
        }
      };

      this.apiService.patchRequest(`notification/${notificationId}`, this.notificationPayload).subscribe({
        next: (patchRes) => {
        },
        error: (error) => {
        },
        complete: () => {
        }
      });
    });

    this.ApiResponseStatus.processing = false;
    this.selectedNotifications = [];
    this.getApiNotifications();
  }

  toggleSelection(id: string) {
    if (this.selectedNotifications.includes(id)) {
      this.selectedNotifications = this.selectedNotifications.filter(selectedId => selectedId !== id);
    } else {
      this.selectedNotifications.push(id);
    }
  }
}

import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation,} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AwarenessService} from 'src/app/services/awareness.service';
import {User} from 'src/app/models/User.model';
import {Location} from '@angular/common';
import {NavigationEnd, Router} from "@angular/router";
import {CommunicationService} from "../../../services/communication.service";
import {AuthService} from "../../../services/api/auth.service";
import {ApiResponseStatus, UserSignOutData} from "../../../interfaces/IAuth.model";
import {ApiService} from "../../../services/api/api.service";
import {ResourceModelApi} from "../../../models/Resource.model";
import {NotificationModel} from "../../../models/Notification.model";
import {AuthenticationService} from "../../../services/authentication.service";
import { config } from '../../../config/config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  scrollTop = 0;
  hideNav = false;

  showFiller = false;
  showMenu: boolean = false;
  showNotificationCard: boolean = false;
  activeRoute: string;
  UserInstance: User = new  User;
  userData: UserSignOutData;
  Notifications: NotificationModel[] = [];
  userRole: string;

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: ""
  }
  dashboards: string[];

  constructor(private router: Router, public dialog: MatDialog, public awareness: AwarenessService,
              private location: Location, private communication: CommunicationService, private authService: AuthService,
              private apiService: ApiService, private authenticationService: AuthenticationService) {

  }
  ngOnInit(): void {
    this.dashboards = config.SUPERSET.DASHBOARDS;
    this.getUser();
    // this.awareness.awaken(null);

    this.router.events.subscribe(events =>{
      if(events instanceof NavigationEnd){
        this.updateActiveRoute();
      }
    })

    this.authenticationService.getApiCurrentUserRole().subscribe({
      next: (role) => {
        this.userRole = role;
      },
      error: (err) => console.error('Error fetching user role', err),
    });

    this.getApiNotifications();
  }

  getUser(){
    this.awareness.UserInstance =  this.awareness.getUserData();
  }

  updateActiveRoute() : void{
    this.activeRoute = this.router.url;
  }

  viewPrevious() {
    this.location.back();
  }


  onScroll(event) {
    this.hideNav = this.scrollTop < event.target.scrollTop;
    this.scrollTop = event.target.scrollTop;
  }

  onClick(action: any) {
    if (action == "logout") {
      this.awareness.UserInstance = new User();
      this.requestLogOut();
      this.awareness.removeUserData();
      this.router.navigate(['/home']);
      window.location.reload();
    }
  }

  requestLogOut(){
    const userToken = this.awareness.getUserData().token;

    if(userToken != "" && userToken !=null){
      this.userData = {
        data: {
          attributes: {
            token: userToken
          },
          type: 'User Authentication'
        }
      };

      this.authService.postRequest("auth/user/sign-out", this.userData).subscribe({
        next: () => {
        },
        error: () => {
        },
        complete: () => {
        }
      });
    }

  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleMenuIcon() {
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('active');
    }
  }

  notificaionClicked() {
    this.communication.showToast('No new notifications.')
  }

  getApiNotifications(){


    if (!this.awareness.UserInstance.id || !this.awareness.UserInstance.id) {
      this.ApiResponseStatus.processing = false;
      return;
    }else{
      const url = `notification?user_id=${this.awareness.UserInstance.id}`;

      this.apiService.get(url).subscribe({
        next: (res) => {
          this.ApiResponseStatus.success = true;
          this.Notifications = res.data.map(item => ({
            id: item.id,
            ...item.attributes
          })).filter(item => item.status !== "read")
            .sort((a, b) => b.created_at - a.created_at);
        },
        error: (error) =>{
          this.ApiResponseStatus.processing = false;
        },
        complete: () =>{
          this.ApiResponseStatus.processing = false;
        },
      });
    }


  }
}

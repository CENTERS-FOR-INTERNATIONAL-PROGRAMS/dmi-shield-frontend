import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation,} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AwarenessService} from 'src/app/services/awareness.service';
import {User} from 'src/app/models/User.model';
import {Location} from '@angular/common';
import {NavigationEnd, Router} from "@angular/router";
import {CommunicationService} from "../../../services/communication.service";

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
  activeRoute: string;
  UserInstance: User = new  User;

  constructor(private router: Router, public dialog: MatDialog, public awareness: AwarenessService,
              private location: Location, private communication: CommunicationService) {

  }
  ngOnInit(): void {
    this.getUser();
    // this.awareness.awaken(null);

    this.router.events.subscribe(events =>{
      if(events instanceof NavigationEnd){
        this.updateActiveRoute();
      }
    })
  }

  getUser(){
    this.awareness.UserInstance =  this.awareness.getUserData();
    console.log('working', this.awareness.UserInstance);
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
      // this.awareness.removeUserData();
      // window.location.reload();

      this.awareness.setFocused("authenticated", "", (res: any) => {
        this.awareness.UserInstance = new User();
        this.awareness.removeUserData();
        this.router.navigate(['/home']);
        window.location.reload();
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
}

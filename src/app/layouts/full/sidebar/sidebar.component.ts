import { Component, OnInit } from '@angular/core';
import { navItems } from './sidebar-data';
import { NavService } from '../../../services/nav.service';
import { AwarenessService } from 'src/app/services/awareness.service';
import { Router } from '@angular/router';
import { User } from '../../../models/User.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  navItems = navItems;
  currentUser: User | undefined = null;

  constructor(
    private router: Router,
    public navService: NavService,
    public awareness: AwarenessService,

    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {}

  onClick(action: any) {
    if (action == 'logout') {
      this.authenticationService.signOut();
      this.awareness.removeUserData();
      this.router.navigate(['/authentication/login']);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { navItems } from './sidebar-data';
import { NavService } from '../../../services/nav.service';
import { AwarenessService } from 'src/app/services/awareness.service';
import { Router } from '@angular/router';
import {User} from "../../../models/User.model";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  navItems = navItems;
  UserInstance: User = new User();

  constructor(private router: Router, public navService: NavService, public awareness: AwarenessService) { }

  ngOnInit(): void {

  }

  onClick(action: any) {
    if (action == "logout") {
      this.awareness.setFocused("authenticated", "", (res: any) => {
        this.router.navigate(['/authentication']);
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { navItems } from './sidebar-data';
import { NavService } from '../../../services/nav.service';
import { AwarenessService } from 'src/app/services/awareness.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  navItems = navItems;
  UserInstance: User = new User();

  constructor(private router: Router, public navService: NavService, public awareness: AwarenessService) { }

  ngOnInit(): void {
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

  onClick(action: any) {
    if (action == "logout") {
      this.awareness.setFocused("authenticated", "", (res: any) => {
        this.router.navigate(['/authentication']);
      });
    }
  }
}

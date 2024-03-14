import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AwarenessService } from 'src/app/services/awareness.service';
import { User } from 'src/app/models/User.model';
import { Location } from '@angular/common';
import {Router} from "@angular/router";

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
  UserInstance: User = new User();

  constructor(private router: Router, public dialog: MatDialog, public awareness: AwarenessService, private location: Location) {

  }
  ngOnInit(): void {
    this.awareness.awaken(() => {
      this.UserInstance._id = this.awareness.getFocused("user");

      if (this.UserInstance._id != "") {
        this.UserInstance.acquireInstance((doc: any) => {
          this.UserInstance.parseInstance(doc);
        }, (err: any) => {
          // TODO! Handle errors
        });
      }
    });
  }

  viewPrevious() {
    this.location.back();
  }

  // onScroll($event: Event) {
  //
  // }

  onScroll(event) {
    this.hideNav = this.scrollTop < event.target.scrollTop;
    this.scrollTop = event.target.scrollTop;
  }

  onClick(action: any) {
    if (action == "logout") {
      this.awareness.setFocused("authenticated", "", (res: any) => {
        this.router.navigate(['/authentication']);
      });
    }
  }
}

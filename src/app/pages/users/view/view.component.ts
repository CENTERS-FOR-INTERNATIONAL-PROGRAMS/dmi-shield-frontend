import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { AwarenessService } from 'src/app/services/awareness.service';

@Component({
  selector: 'view',
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit {

  UserInstance: User = new User();

  constructor(public awareness: AwarenessService) { }

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

    console.log(this.UserInstance)
  }
}

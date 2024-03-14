import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { AwarenessService } from 'src/app/services/awareness.service';

@Component({
  selector: 'composite',
  templateUrl: './composite.component.html'
})

export class CompositeComponent implements OnInit {
  Users: User[] = [];
  FilterUser: User = new User;

  constructor(public awareness: AwarenessService) { }

  ngOnInit(): void {
    this.loadComposite();
  }

  loadComposite() {
    this.FilterUser.acquireComposite((Users: User[]) => {
      this.Users = Users;
    }, (error: any) => {
      // TODO! Handle errors
      console.log("Error", error);
    });
  }
  
}

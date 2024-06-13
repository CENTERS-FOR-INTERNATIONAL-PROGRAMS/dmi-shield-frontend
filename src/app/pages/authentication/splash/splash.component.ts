import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'splash',
  templateUrl: './splash.component.html',
})

export class SplashComponent implements OnInit{

  constructor(private router: Router, private awareness: AwarenessService, private communication: CommunicationService) {
  }

  ngOnInit(): void {
    this.router.navigate(['/home']);
  }
}

import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {AwarenessService} from "../../../services/awareness.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {MdbCarouselComponent} from "mdb-angular-ui-kit/carousel";

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
  styleUrls: ['./composite.component.scss']
})
export class CompositeComponent implements OnInit{

  @ViewChild('myIframe') myIframe!: ElementRef;
  private sanitizer = inject(DomSanitizer);
  SummaryDashboardsFrame: SafeResourceUrl;


  iframeList = [
    {source: "https://app.powerbi.com/view?r=eyJrIjoiZDQ2NzZkYWQtYjFjZS00ODcyLTg2MjUtYzI5MWI4NGZhZWMwIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiODhjMWNkMDktMzFlNC00ODlmLWI1YTItNzFjZjA5OTA3YWE5IiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiNzVhZjBmNGQtZjU1MC00ZGNhLWFiMjktNTgxZDE4MjAwMDhlIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiMjg1YWVhNGUtYjFlMy00Y2Y1LTlkZmEtM2UzNGNmODVhM2EzIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiNzVhZjBmNGQtZjU1MC00ZGNhLWFiMjktNTgxZDE4MjAwMDhlIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiZWE4ZDZlYjgtNDEzOS00Mjk4LThkODctZDlhZTI2ZDAxY2I4IiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiZWU1MGMzN2MtZDExYy00OTRiLWE5NDItOGFiMTc0Njc3YjIzIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiOWQyNTgyYjUtZjQxZC00YjI4LTg2ZTUtNmRiZDc4NGViMDVhIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiMTViNzE2MTEtYjk2Zi00ODc0LTkxZGQtMDgyNDk0ZDE3ZjBiIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiMjYwZDk1NTYtNTE4Ni00OTk5LWIzY2YtZTU5OWRmNWRiZTE5IiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiMTdjOTg4MGItMjE2YS00NjAxLWJlMzUtZmI5OTlmMjJhOTNiIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiMWNmNjUwYzEtZDJjOC00MDU1LWEzYjYtYWIwODAzZTlhMjY0IiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiNjAwNTFjOWEtMzUwMy00ZWVjLWE5MzQtYzcwMTk0NDU0YjViIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"}
  ];

  // @ViewChild('carousel') carousel: MdbCarouselComponent;
  @ViewChild('carousel', {static: false}) carousel: any;
  constructor(private awareness: AwarenessService) {
    this.iframeList.forEach(item => {
      item.source = <string>this.sanitizer.bypassSecurityTrustResourceUrl(item.source);
    });
  }

  ngOnInit() {
  }


  nextSlide() {
    this.carousel.next();
  }

  previousSlide() {
    this.carousel.prev();
  }
}

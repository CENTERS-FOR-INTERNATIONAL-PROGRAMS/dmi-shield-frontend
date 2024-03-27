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
    // {source: "https://app.powerbi.com/view?r=eyJrIjoiZjZjMjQ3YzUtMzBmNS00OTQ5LWE3ZGEtMjllYmJjYWFhMGExIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    // {source: "https://app.powerbi.com/view?r=eyJrIjoiYzNjNTIyOWQtNDE4Mi00YjZkLTk5NjQtNjE3ZWRmYmU3NGViIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    // {source: "https://app.powerbi.com/view?r=eyJrIjoiNDczNmQwNWUtOWM1ZS00ZTIwLWI5MzktMmVlMmRlZGI3YzcwIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    // {source: "https://app.powerbi.com/view?r=eyJrIjoiNzdjMGU0NDAtYjRkYi00ZjI4LWJhZmItYjFiZDdlZjM1NTA4IiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    // {source: "https://app.powerbi.com/view?r=eyJrIjoiOTJmOWQzZWEtMjJiMC00YmIyLWFmZjYtMjgyOTk2YWViMjVjIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    // {source: "https://app.powerbi.com/view?r=eyJrIjoiZWE4ZDZlYjgtNDEzOS00Mjk4LThkODctZDlhZTI2ZDAxY2I4IiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    // {source: "https://app.powerbi.com/view?r=eyJrIjoiZWU1MGMzN2MtZDExYy00OTRiLWE5NDItOGFiMTc0Njc3YjIzIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    // {source: "https://app.powerbi.com/view?r=eyJrIjoiOWQyNTgyYjUtZjQxZC00YjI4LTg2ZTUtNmRiZDc4NGViMDVhIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    // {source: "https://app.powerbi.com/view?r=eyJrIjoiMTViNzE2MTEtYjk2Zi00ODc0LTkxZGQtMDgyNDk0ZDE3ZjBiIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    // {source: "https://app.powerbi.com/view?r=eyJrIjoiMjYwZDk1NTYtNTE4Ni00OTk5LWIzY2YtZTU5OWRmNWRiZTE5IiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    // {source: "https://app.powerbi.com/view?r=eyJrIjoiMTdjOTg4MGItMjE2YS00NjAxLWJlMzUtZmI5OTlmMjJhOTNiIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    // {source: "https://app.powerbi.com/view?r=eyJrIjoiMWNmNjUwYzEtZDJjOC00MDU1LWEzYjYtYWIwODAzZTlhMjY0IiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    // {source: "https://app.powerbi.com/view?r=eyJrIjoiNjAwNTFjOWEtMzUwMy00ZWVjLWE5MzQtYzcwMTk0NDU0YjViIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"}

    {source: "https://app.powerbi.com/view?r=eyJrIjoiZjZjMjQ3YzUtMzBmNS00OTQ5LWE3ZGEtMjllYmJjYWFhMGExIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiYzNjNTIyOWQtNDE4Mi00YjZkLTk5NjQtNjE3ZWRmYmU3NGViIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiNDczNmQwNWUtOWM1ZS00ZTIwLWI5MzktMmVlMmRlZGI3YzcwIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"}, 
    {source: "https://app.powerbi.com/view?r=eyJrIjoiNzdjMGU0NDAtYjRkYi00ZjI4LWJhZmItYjFiZDdlZjM1NTA4IiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiOTJmOWQzZWEtMjJiMC00YmIyLWFmZjYtMjgyOTk2YWViMjVjIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiMDRjZGYwN2UtZTI0My00YTg4LTk2OTQtZmM0NTk4MTNkZDdhIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiNGYwYTkxOTEtOTFiZC00ZjkwLTkwNTQtY2UyNGRmZjZmZjI2IiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiNWZkMTQ2MmMtN2Y1MC00MDQ1LTgzMmItNDI5YTZiN2UxYWFjIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiYjQwZDM3MTEtNDY0NS00MjQ0LWI4MDAtYzcyNmIyZDYxMTE4IiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiZjllN2JhY2MtMjUwNy00YTgyLThjN2QtNmQ4YzhkNjE4YzIyIiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"},
    {source: "https://app.powerbi.com/view?r=eyJrIjoiMTc0OGU0MmMtOTI3ZS00ODJiLWI5OGQtYzgwZTRjZGQ0MTg4IiwidCI6ImE4MmQ5Y2U3LTcwZDQtNGMzOS1iMmUyLTU5ZmQwODA0NjQ1YiIsImMiOjh9"}
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

import {Component} from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {
  shieldAccordion = [
    {
      id: 0,
      title: "What is SHEILD?",
      content: "Surveillance Health Information Exchange Linkage Data (SHIELD) is a centralised data repository developed by the Kenya Ministry of Health for surveillance data storage and visualization."
    },
    {
      id: 1,
      title: "How do I log into SHIELD",
      content: "If you are an approved user, you can log at https://shield.health.go.ke"
    }, {
      id: 2,
      title: "Am I allowed to use data for general dissemination?",
      content: "The data should be used in accordance with the rules and regulation of the Ministry of Health."
    }, {
      id: 3,
      title: "Who can I contact if I have trouble logging in?",
      content: "You can get help by contacting the MOH helpline 020-000000."
    }, {
      id: 4,
      title: "Who can I contact if I have trouble uploading data?",
      content: "You can get help by contacting the MOH helpline 020-000000."
    }
  ];

  adamAccordion = [
    {
      id: 0,
      title: "What is ADAM?",
      content: "It’s an end-to-end digital solution for disease surveillance and outbreak response and management."
    },
    {
      id: 1,
      title: "How does one log into the system?",
      content: "A help desk link will be provided for users to register and report any issues they encounter while navigating through the system."
    }, {
      id: 2,
      title: "Who is the custodian?",
      content: "The custodian of the system is the Ministry of Health, responsible for its management and administration."
    }
  ];
}

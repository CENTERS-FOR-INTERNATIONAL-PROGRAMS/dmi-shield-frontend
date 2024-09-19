import {Component} from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {
  panelOpenState: boolean = false;

  accordionData = [
    {
      id: 0,
      title: " Data Integration",
      routeName: "Go to Upload Page",
      routeLink: '/surveillance/composites',
      icon: "/assets/images/icons/data-integration.png",
      content: "SHIELD seamlessly integrates diverse health data sources from public health management systems such as the Kenya Health Information System (KHIS-2) Patient management systems such as electronic health records (EMRs) and community health information systems; Diagnostic management systems such as Laboratory Information Systems (LMIS) Supply chain management systems such as logistics management information system; " +
        "and person-centered self-care systems such as events management information system to create a comprehensive one-stop surveillance database. Data from different data sources are electronically loaded into the SHIELD database using Application Programming Interface (API) or uploaded manually on the Upload page. "
    },
    {
      id: 1,
      title: "Data Dashboard",
      routeName: "Go to Dashboard",
      routeLink: "/dashboard",
      icon: "/assets/images/icons/dashboard.png",
      content: "Users can access a data dashboard designed by healthcare experts to address their specific surveillance data needs." +
        " This interface provides easy navigation and visualization of key metrics, facilitating data-driven decision-making. The dashboards available on SHIELD can be accessed on the Dashboard page."
    },
    {
      id: 2,
      title: "Advanced Analytics and Functionality",
      routeName: "",
      routeLink: "",
      icon: "/assets/images/icons/analytics.png",
      content: "Utilizing state-of-the-art analytics tools, SHIELD transforms raw datasets in different formats into actionable insights. This enables the Ministry of Health (MOH), its partners, and stakeholders to identify trends, " +
        "detect disease outbreaks, predict disease outbreaks using advanced machine learning algorithms, and send alert signals to relevant health personnel whenever pre-defined disease thresholds are reached."
    },
    {
      id: 3,
      title: "Real Time Monitoring",
      routeName: "",
      routeLink: "",
      icon: "/assets/images/icons/realtime.png",
      content: "SHIELD platform automatically connects to source data systems, thus offering real-time monitoring capabilities. This allows health professionals to track health indicators, monitor disease prevalence, and respond promptly to emerging health threats."
    },
    {
      id: 4,
      title: "Trust-based Exchange",
      routeName: "",
      routeLink: "",
      icon: "/assets/images/icons/trust-based.png",
      content: "SHIELD prioritizes data security and privacy, ensuring compliance with the highest confidentiality and data protection standards. Our secure exchange protocols facilitate safe and efficient data sharing among authorized stakeholders."
    },
    {
      id: 5,
      title: "Resources",
      routeName: "Go to Resources Page",
      routeLink: "/resources/composites",
      icon: "/assets/images/icons/resources.png",
      content: "The SHIELD platform provides an array of resources tailored to meet the diverse needs of health surveillance professionals. This includes guidelines, standard operation procedures, frameworks, etc. The resources can be found on the Resource page."
    },
  ];
}

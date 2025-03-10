import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconImage: 'icon-home-outline--black.png',
    route: '/dashboard',
  },
  {
    navCap: 'Response',
  },
  {
    displayName: 'Cases',
    iconImage: 'icon-cases_group-colored.png',
    route: '/cases/composites',
  },
  {
    displayName: 'Outbreaks',
    iconImage: 'icon-outbreak-colored.png',
    route: '/outbreaks/composites',
  },
  {
    navCap: 'Surveillance',
  },
  {
    displayName: 'Data',
    iconImage: 'icon-table-black.png',
    route: '/surveillance',
  },
  {
    navCap: 'Analytics',
  },
  {
    displayName: 'Simple',
    iconImage: 'icon-table-black.png',
    route: '/analytics/simple',
  },
  {
    displayName: 'Advanced',
    iconImage: 'icon-dashboard-black.png',
    route: '/analytics/advanced',
  },
  // {
  //   navCap: 'Notifications',
  // },
  // {
  //   displayName: 'Messages',
  //   iconImage: 'icon-bell-ringing.png',
  //   route: '#'
  // },
  // {
  //   displayName: 'Warnings',
  //   iconImage: 'icon-alert-triangle-filled.png',
  //   route: '#'
  // },
  {
    navCap: 'Settings',
  },
  {
    displayName: 'Configurations',
    iconImage: 'icon-settings-black.png',
    route: '/settings/configurations',
  },
  {
    navCap: 'Profile',
  },
  {
    displayName: 'Profile',
    iconImage: 'icon-user--black.png',
    route: '/users/view',
  },
  {
    displayName: 'Logout',
    iconImage: 'icon-exit--black.png',
    action: 'logout',
  },
];

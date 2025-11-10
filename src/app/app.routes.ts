/* Minimal local Routes type to avoid requiring @angular/router typings */
type Route = {
  path?: string;
  loadComponent?: () => Promise<any>;
  redirectTo?: string;
  pathMatch?: string;
};
export type Routes = Route[];

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./presentation/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
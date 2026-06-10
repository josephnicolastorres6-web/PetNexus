import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { SearchComponent } from './features/search/search';
import { DetailsComponent } from './features/details/details.component';
import { Favorites } from './features/favorites/favorites';
import { NotFound } from './core/components/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'details/:id', component: DetailsComponent },
  { path: 'favorites', component: Favorites },
  { path: '**', component: NotFound },
];


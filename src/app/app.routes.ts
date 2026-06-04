import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { SearchComponent } from './features/search/search';
import { Details } from './features/details/details';
import { Favorites } from './features/favorites/favorites';
import { NotFound } from './core/components/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'details/:id', component: Details },
  { path: 'favorites', component: Favorites },
  { path: '**', component: NotFound }
];

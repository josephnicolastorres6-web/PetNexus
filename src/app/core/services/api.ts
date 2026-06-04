import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';
import { Dog } from '../models/dog.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.apiUrl}/breeds?limit=60`).pipe(
      map(data => {
        const valid = data.filter(dog => dog.image?.url || dog.reference_image_id);
        return valid.length > 0 ? valid.slice(0, 20) : data.slice(0, 20);
      })
    );
  }

  searchBreeds(query: string): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.apiUrl}/breeds/search?q=${query}`).pipe(
      map(data => {
        const valid = data.filter(dog => dog.image?.url || dog.reference_image_id);
        return valid.length > 0 ? valid : data;
      })
    );
  }
}

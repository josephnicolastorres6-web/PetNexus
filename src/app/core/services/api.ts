import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map, switchMap, of, catchError, forkJoin } from 'rxjs';
import { Dog } from '../models/dog.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getDogs(page: number = 0): Observable<Dog[]> {
    // Usamos el parámetro 'page' de The Dog API y traemos lotes de 12
    return this.http.get<Dog[]>(`${this.apiUrl}/breeds?limit=12&page=${page}`).pipe(
      switchMap(dogs => {
        if (!dogs || dogs.length === 0) return of([]);
        const requests = dogs.map(dog => {
          if (dog.image?.url || dog.reference_image_id) return of(dog);
          
          return this.http.get<any[]>(`${this.apiUrl}/images/search?breed_ids=${dog.id}&limit=1`).pipe(
            map(images => {
              if (images && images.length > 0 && images[0].url) {
                dog.image = { url: images[0].url };
              }
              return dog;
            }),
            catchError(() => of(dog))
          );
        });
        return forkJoin(requests);
      })
    );
  }

  searchBreeds(query: string): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.apiUrl}/breeds/search?q=${query}`).pipe(
      switchMap(dogs => {
        if (!dogs || dogs.length === 0) return of([]);
        const requests = dogs.map(dog => {
          if (dog.image?.url || dog.reference_image_id) return of(dog);
          
          return this.http.get<any[]>(`${this.apiUrl}/images/search?breed_ids=${dog.id}&limit=1`).pipe(
            map(images => {
              if (images && images.length > 0 && images[0].url) {
                dog.image = { url: images[0].url };
              }
              return dog;
            }),
            catchError(() => of(dog))
          );
        });
        return forkJoin(requests);
      })
    );
  }

  getDogById(id: string): Observable<Dog> {
    // 1. Obtenemos los datos de la raza asegurados
    return this.http.get<Dog>(`${this.apiUrl}/breeds/${id}`).pipe(
      switchMap(dog => {
        if (!dog) throw new Error('Dog not found');
        
        // 2. Buscamos la imagen exacta vinculada a esta raza usando /images/search
        return this.http.get<any[]>(`${this.apiUrl}/images/search?breed_ids=${id}&limit=1`).pipe(
          map(images => {
            // 3. Si encontramos una imagen en el buscador, la inyectamos
            if (images && images.length > 0 && images[0].url) {
              dog.image = { url: images[0].url };
            } 
            // 4. Si la búsqueda falla pero tenemos un ID de referencia, intentamos construirla
            else if (dog.reference_image_id) {
              dog.image = { url: `https://cdn2.thedogapi.com/images/${dog.reference_image_id}.jpg` };
            }
            return dog;
          }),
          // Si la llamada a las imágenes falla por completo, devolvemos el perro (mostrará el placeholder)
          catchError(() => of(dog)) 
        );
      })
    );
  }
}




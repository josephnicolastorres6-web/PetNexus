import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api';
import { Dog } from '../../core/models/dog.model';
import { PetCardComponent } from '../../shared/components/pet-card/pet-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PetCardComponent, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  heroDog = signal<Dog | null>(null);
  dogs = signal<Dog[]>([]);
  isLoading = signal(true); // Agregamos el estado de carga

  ngOnInit(): void {
    this.apiService.getDogs().subscribe({
      next: (data) => {
        if (data.length > 0) {
          // El primer perro es el "Póster Principal" (Hero)
          this.heroDog.set(data[0]);
          // Los demás van al grid estilo Netflix
          this.dogs.set(data.slice(1));
        }
        this.isLoading.set(false); // Apagamos el esqueleto al cargar
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading.set(false);
      },
    });
  }

  getHeroImage(dog: Dog): string {
    if (dog.image?.url) return dog.image.url;
    if (dog.reference_image_id)
      return `https://cdn2.thedogapi.com/images/${dog.reference_image_id}.jpg`;
    return `https://placedog.net/1200/600?id=${dog.id}`; // Formato ancho para el Hero
  }

  handleHeroError(event: any, dog: Dog) {
    const fallback = `https://loremflickr.com/1200/600/dog?lock=${dog.id}`;
    if (event.target.src !== fallback) {
      event.target.src = fallback;
    }
  }
}


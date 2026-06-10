import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
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
  isLoading = signal(true);

  // Variables para controlar el scroll
  currentPage = 0;
  isFetching = false;

  ngOnInit(): void {
    this.loadMoreDogs();
  }

  loadMoreDogs() {
    if (this.isFetching) return; // Evita peticiones duplicadas si ya está cargando
    this.isFetching = true;
    
    // Solo mostramos los skeleton loaders en la primera carga
    if (this.currentPage === 0) {
      this.isLoading.set(true);
    }

    this.apiService.getDogs(this.currentPage).subscribe({
      next: (data) => {
        if (this.currentPage === 0 && data.length > 0) {
          // El primer perro es el "Póster Principal" (Hero)
          this.heroDog.set(data[0]);
          // Los demás van al grid estilo Netflix
          this.dogs.set(data.slice(1));
        } else if (data.length > 0) {
          // Acumulamos los perros nuevos junto a los que ya teníamos
          this.dogs.update(current => [...current, ...data]);
        }
        
        this.currentPage++;
        this.isFetching = false;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando más perros:', err);
        this.isFetching = false;
        this.isLoading.set(false);
      }
    });
  }

  // Escucha el evento de scroll en toda la ventana
  @HostListener('window:scroll', [])
  onScroll(): void {
    // Comprueba si estamos a 200px del final de la página
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    const max = document.documentElement.scrollHeight;
    
    if (pos >= max - 200) {
      this.loadMoreDogs();
    }
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



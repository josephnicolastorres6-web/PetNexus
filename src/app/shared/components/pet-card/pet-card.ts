import { Component, input, computed } from '@angular/core';
import { Dog } from '../../../core/models/dog.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="card" [routerLink]="['/details', pet().id]">
      <img [src]="imageUrl()" [alt]="pet().name" loading="lazy" (error)="handleError($event)" />
      <div class="card-overlay">
        <h3>{{ pet().name }}</h3>
        <span class="btn">Ver detalles</span>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        background: white;
        cursor: pointer;
        aspect-ratio: 2/3; /* Formato Póster de Película */
        display: flex;
      }
      .card:hover {
        transform: translateY(-10px) scale(1.05);
        box-shadow: 0 20px 40px rgba(249, 115, 22, 0.15);
        z-index: 10;
      }
      .card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      .card:hover img {
        transform: scale(1.1);
      }
      .card-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 30px 20px 20px;
        background: linear-gradient(
          to top,
          rgba(255, 255, 255, 0.95) 0%,
          rgba(255, 255, 255, 0.8) 50%,
          transparent 100%
        );
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        height: 60%;
      }
      .card:hover .card-overlay {
        opacity: 1;
      }
      .card-overlay h3 {
        margin: 0 0 15px 0;
        color: #1e293b;
        font-size: 1.5rem;
        font-family: 'Outfit', sans-serif;
        font-weight: 800;
        text-align: center;
        text-shadow: none;
        transform: translateY(20px);
        transition: transform 0.3s ease;
      }
      .card:hover .card-overlay h3 {
        transform: translateY(0);
      }
      .btn {
        display: inline-block;
        padding: 8px 24px;
        background: linear-gradient(135deg, #f97316, #ec4899);
        color: white;
        border-radius: 20px;
        font-weight: 700;
        font-size: 0.9rem;
        font-family: 'Outfit', sans-serif;
        transform: translateY(20px);
        transition: transform 0.4s ease;
        box-shadow: 0 4px 10px rgba(249, 115, 22, 0.3);
      }
      .card:hover .card-overlay .btn {
        transform: translateY(0);
      }
    `,
  ],
})
export class PetCardComponent {
  pet = input.required<Dog>();

  imageUrl = computed(() => {
    const p = this.pet();
    if (p.image?.url) return p.image.url;
    if (p.reference_image_id)
      return `https://cdn2.thedogapi.com/images/${p.reference_image_id}.jpg`;
    return `https://placedog.net/600/900?id=${p.id}`; // Formato póster (2:3)
  });

  handleError(event: any) {
    const p = this.pet();
    // Si placedog.net falla o es bloqueado, usamos un servicio de fotos de perros aleatorias 100% confiable
    const fallback = `https://loremflickr.com/600/900/dog?lock=${p.id}`;
    if (event.target.src !== fallback) {
      event.target.src = fallback;
    }
  }
}



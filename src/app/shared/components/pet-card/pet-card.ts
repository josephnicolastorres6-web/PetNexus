import { Component, input } from '@angular/core';
import { Dog } from '../../../core/models/dog.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="card">
      <img [src]="pet().image?.url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80'" [alt]="pet().name" loading="lazy">
      <div class="card-body">
        <h3>{{ pet().name }}</h3>
        <a [routerLink]="['/details', pet().id]" class="btn">Ver detalles</a>
      </div>
    </div>
  `,
  styles: [`
    .card { border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s; background: white; }
    .card:hover { transform: translateY(-5px); }
    .card img { width: 100%; height: 220px; object-fit: cover; }
    .card-body { padding: 15px; text-align: center; }
    .btn { display: inline-block; margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; }
  `]
})
export class PetCardComponent {
  pet = input.required<Dog>(); 
}

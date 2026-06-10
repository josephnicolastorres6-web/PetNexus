import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api';
import { Dog } from '../../core/models/dog.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  dog = signal<Dog | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getDogById(id).subscribe({
        next: (data) => {
          this.dog.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error cargando detalles:', err);
          this.isLoading.set(false);
        }
      });
    }
  }

  getImageUrl(currentDog: Dog): string {
    return currentDog.image?.url || `https://dummyimage.com/600x600/f97316/ffffff.png&text=${encodeURIComponent(currentDog.name)}`;
  }

  handleError(event: any, name: string) {
    const fallback = `https://dummyimage.com/600x600/f97316/ffffff.png&text=${encodeURIComponent(name)}`;
    if (event.target.src !== fallback) {
      event.target.src = fallback;
    }
  }
}



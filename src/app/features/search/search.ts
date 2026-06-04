import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api';
import { Dog } from '../../core/models/dog.model';
import { PetCardComponent } from '../../shared/components/pet-card/pet-card';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [PetCardComponent],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class SearchComponent {
  private apiService = inject(ApiService);
  searchResults = signal<Dog[]>([]);
  hasSearched = signal(false);

  onSearch(query: string) {
    if (!query.trim()) return;
    this.apiService.searchBreeds(query).subscribe({
      next: (data) => {
        this.searchResults.set(data);
        this.hasSearched.set(true);
      },
      error: (err) => console.error('Error:', err)
    });
  }
}

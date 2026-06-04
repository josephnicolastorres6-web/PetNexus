import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api';
import { Dog } from '../../core/models/dog.model';
import { PetCardComponent } from '../../shared/components/pet-card/pet-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PetCardComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  dogs = signal<Dog[]>([]);

  ngOnInit(): void {
    this.apiService.getDogs().subscribe({
      next: (data) => this.dogs.set(data),
      error: (err) => console.error('Error API:', err)
    });
  }
}

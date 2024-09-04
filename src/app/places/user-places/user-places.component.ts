import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal(false);
  error = signal('');
  private placesSevice = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  places = this.placesSevice.loadedUserPlaces;

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placesSevice.loadUserPlaces().subscribe({
        error: (error: Error) => {
          console.log(error);
          this.error.set(error.message);
        },
        complete: () => {
          this.isFetching.set(false);
        }
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onRemovePlace(place: Place) {
    const subscription = this.placesSevice.removeUserPlace(place).subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

}

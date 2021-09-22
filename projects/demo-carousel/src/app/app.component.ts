import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <ui-carousel [items]="photos" [boxWidth]="photoWidth" [boxHeight]="photoHeight"></ui-carousel>
  `,
  styles: [`
  :host {
      display: block;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: lightcyan;
    }
  `]
})
export class AppComponent {
  title = 'demo-carousel';
  photoWidth: number = 350;
  photoHeight: number = 250;
  photos: any[] = [
    'https://source.unsplash.com/350x250/?ronaldo',
    'https://source.unsplash.com/350x250/?nature,water',
    'https://source.unsplash.com/350x250/?people',
    'https://source.unsplash.com/350x250/?soccer',
    'https://source.unsplash.com/350x250/?home',
    'https://source.unsplash.com/350x250/?interior',
  ];
}

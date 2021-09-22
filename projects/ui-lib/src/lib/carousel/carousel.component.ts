import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'ui-carousel',
  template: `
    <div #carousel class="carousel">
      <div #itemsWrapper class="carousel__items">
        <div #box *ngFor="let photo of items; let i = index" [ngStyle]="boxStyle()" class="carousel__box">
          <img [src]="photo" class="carousel__photo" />
          <span class="carousel__num">{{i}}</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit {

  @ViewChild('carousel', { read: ElementRef }) carouselEl!: ElementRef<HTMLElement>;
  @ViewChild('itemsWrapper', { read: ElementRef }) itemsWrapperEl!: ElementRef<HTMLElement>;
  @ViewChildren('box', { read: ElementRef }) boxEls!: QueryList<ElementRef<HTMLElement>>;

  @Input() items!: string[];
  @Input() boxWidth!: number;
  @Input() boxHeight!: number;

  nItems: number = 0;
  itemsWrapperWidth: number = 0;
  carouselOffsetLeft: number = 0;
  startX: number = 0;
  boxInset: number = 0;
  leftEdgeMax: number = 0;
  transformX: number = 0;
  nextLeft!: number;
  nextRight!: number;
  snapBoundryX!: number;

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.nItems = this.items.length;
    this.itemsWrapperWidth = (this.nItems + 1) * this.boxWidth;
    this.snapBoundryX = this.boxWidth / 2;
    this.nextLeft = 0;
    this.nextRight = this.boxWidth * (this.nItems - 1);
  }

  ngAfterViewInit(): void {
    let itemsWrapperEl = this.itemsWrapperEl.nativeElement;
    let carouselEl = this.carouselEl.nativeElement;

    this.renderer.setStyle(itemsWrapperEl, 'left', `-${this.boxWidth}px`);
    this.renderer.setStyle(itemsWrapperEl, 'width', `${this.itemsWrapperWidth}px`);
    this.renderer.setStyle(itemsWrapperEl, 'height', `${this.boxHeight}px`);
    this.renderer.setStyle(carouselEl, 'width', `${(this.boxWidth * 2) + 175}px`);
    this.renderer.setStyle(carouselEl, 'height', `${this.boxHeight}px`);

    for (let i = this.nItems - 1; i > -1; i--) {
      let index = (i + this.nItems - 1) % this.nItems;
      this.renderer.setStyle(
        this.boxEls.get(index)?.nativeElement,
        'left', `${i * this.boxWidth}px`
      );
    }

    itemsWrapperEl.addEventListener('mousedown', this.onMouseDown);
  }

  onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    let carouselEl = this.carouselEl.nativeElement;
    let boxEl = e.target as HTMLElement;

    this.leftEdgeMax = carouselEl.offsetLeft - this.boxWidth;
    this.transformX = this.extractPosX(boxEl.style.transform);
    this.carouselOffsetLeft = carouselEl.offsetLeft;
    this.startX = boxEl.getBoundingClientRect().left;
    this.boxInset = e.pageX - this.startX;

    this.document.addEventListener('mousemove', this.onMouseMove);
    this.document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (e: MouseEvent) => {
    e.preventDefault();

    for (let i = this.nItems - 1; i >= 0; i--) {
      let boxEl = this.boxEls.get(i)?.nativeElement!;
      let newTransformX = (e.pageX + this.transformX) - (this.startX + this.boxInset);

      this.renderer.setStyle(
        boxEl, 'transform', `translate3d(${newTransformX}px, 0px, 0px)`
      );

      if (boxEl.getBoundingClientRect().left - this.carouselOffsetLeft > 1750) {
        this.nextLeft = this.nextLeft - 350;
        this.nextRight = this.nextRight - this.boxWidth;
        this.renderer.setStyle(
          boxEl, 'left', `${this.nextLeft}px`
        );
      } else if (boxEl.getBoundingClientRect().left < this.leftEdgeMax) {
        this.nextLeft += this.boxWidth;
        this.nextRight += this.boxWidth;
        this.renderer.setStyle(
          boxEl, 'left', `${this.nextRight}px`
        );
      }
    }
  }

  onMouseUp = (e: MouseEvent) => {
    this.document.removeEventListener('mousemove', this.onMouseMove);
    this.document.removeEventListener('mouseup', this.onMouseUp);

    let sampleBoxEl = e.target as HTMLElement;
    let transformX = this.extractPosX(sampleBoxEl.style.transform);
    let mod = transformX % this.boxWidth;

    if (transformX === 0) return;

    if (mod < this.snapBoundryX && transformX > 0) {
      transformX -= mod;
    }

    if (mod < this.snapBoundryX && transformX < 0) {
      transformX += mod;
    }

    if (mod >= this.snapBoundryX && transformX > 0) {
      transformX += this.boxWidth - mod;
    }

    if (mod >= this.snapBoundryX && transformX < 0) {
      transformX -= this.boxWidth - mod;
    }

    for (let i = this.nItems - 1; i >= 0; i--) {
      let boxEl = this.boxEls.get(i)?.nativeElement!;
      /* this.renderer.setStyle(
        boxEl, 'transform', `translate3d(${transformX}px, 0px, 0px)`
      ); */
    }

    this.document.removeEventListener('mousemove', this.onMouseMove);
    this.document.removeEventListener('mouseup', this.onMouseUp);
  }

  boxStyle() {
    return {
      width: `${this.boxWidth}px`,
      height: `${this.boxHeight}px`
    };
  }

  extractPosX = (transform: string) => {
    let result = /^(translate3d\()(-?\d+)px/.exec(transform);
    return result ? +result![2] : 0;
  }
}

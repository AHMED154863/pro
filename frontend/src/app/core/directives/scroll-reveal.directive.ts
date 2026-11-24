import { Directive, ElementRef, HostBinding, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit {
  @HostBinding('class.scroll-reveal') enabled = true;
  @HostBinding('class.is-visible') visible = false;

  constructor(private readonly element: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.updateVisibility();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  updateVisibility(): void {
    if (this.visible) {
      return;
    }

    const top = this.element.nativeElement.getBoundingClientRect().top;
    this.visible = top < window.innerHeight * 0.9;
  }
}

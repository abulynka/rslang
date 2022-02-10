import {
  group,
  style,
  trigger,
  transition,
  animate,
  query,
  animateChild,
  AnimationTriggerMetadata,
} from '@angular/animations';

export const routeChangeAnimation: AnimationTriggerMetadata[] = [
  trigger('routeChangeAnimation', [
    transition('signin <=> signup', [
      style({ position: 'relative', opacity: 1 }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          opacity: 1,
        }),
      ]),
      query(':enter', [style({ opacity: 0 })]),
      query(':leave', animateChild()),
      group([
        query(':leave', [animate('500ms linear', style({ opacity: 0 }))]),
        query(':enter', [animate('500ms linear', style({ opacity: 1 }))]),
      ]),
      query(':enter', animateChild()),
    ]),
  ]),
];

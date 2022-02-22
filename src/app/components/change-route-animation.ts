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

interface StyleInterface {
  [key: string]: number | string;
}
const getStyles = (): StyleInterface => {
  const height: number = window.innerHeight;
  if (height < Number('720')) {
    return {
      position: 'relative',
      opacity: 1,
      minHeight: '600px',
      marginTop: '56px',
    };
  }
  return { position: 'relative', opacity: 1 };
};
export const routeChangeAnimation: AnimationTriggerMetadata[] = [
  trigger('routeChangeAnimation', [
    transition('signin <=> signup', [
      style(getStyles()),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
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

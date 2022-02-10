import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeChangeAnimation } from './components/change-route-animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeChangeAnimation],
})
export class AppComponent {
  title = 'rslang';

  getRouteAnimationState(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    )
  }
}

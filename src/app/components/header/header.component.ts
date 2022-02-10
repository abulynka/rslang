import { Component, DoCheck, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements DoCheck {
  @Input() isAuthUser: boolean = false;
  public name: string = 'On Packer';
  constructor(private authService: AuthService) { }

  public ngDoCheck(): void {
    const userData = this.authService.getUserData();
    this.isAuthUser = false;

    if (userData) {
      this.name = userData.name;
      this.isAuthUser = true;
    }
  }

  public logOut(): void {
    this.authService.deleteUserData();
    this.isAuthUser = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { UserSettingsService } from 'src/app/services/user-settings.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent implements OnInit {
  public imageLink: string = '';
  public userName: string = this.auth.getUserData()?.name || '';
  public userEmail: string = '';
  public currentPassword: string = '';
  public hide: boolean = true;
  public hideNewPsw: boolean = true;
  public newPswControl: FormControl = new FormControl(
    { value: '', disabled: true },
    [Validators.minLength(Number('8')), Validators.pattern(/[a-zA-Z\d].{8,}$/i)]
  );
  public nameControl: FormControl = new FormControl(this.userName, [
    Validators.minLength(Number('3')),
    Validators.pattern(/^[A-Za-zА-я]{3,}$/i),
  ]);

  public constructor(
    private auth: AuthService,
    private settingsService: UserSettingsService
  ) {}

  public ngOnInit(): void {
    this.settingsService.getUserEmail().subscribe((email: string) => {
      this.userEmail = email;
    });
  }

  public uploadFile(e: Event): void {
    e.preventDefault();
    const files: FileList | null = (<HTMLInputElement>e.target).files;
    if (files && files.length > 0) {
      this.uploadImage(files);
    }
  }

  public uploadImage(files: FileList): void {
    const fileReader: FileReader = new FileReader();
    const imageSize: number = files[0].size;
    fileReader.readAsDataURL(files[0]);

    fileReader.onload = (): void => {
      // '1000000' - 1 mb
      if (imageSize < Number('1000000')) {
        this.imageLink = String(fileReader.result);
      }
    };
  }

  public checkPassword(): void {
    this.settingsService
      .checkUserPassword(this.userEmail, this.currentPassword)
      .subscribe((data: boolean) => {
        if (data) {
          this.newPswControl.enable();
        } else {
          this.newPswControl.disable();
        }
      });
  }

  public saveSettings(): void {
    if (this.imageLink.length > 0) {
      this.auth.setUserimage(this.imageLink);
    }
    const data: Partial<User> = {};
    if (this.nameControl.valid) {
      data.name = this.nameControl.value;
    }
    if (this.newPswControl.valid) {
      data.password = this.newPswControl.value;
    }
    this.settingsService.setUserData(data);
    this.newPswControl.disable();
  }
}

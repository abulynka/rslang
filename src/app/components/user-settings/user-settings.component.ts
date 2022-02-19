import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  SelecetData,
  User,
  UserSettings,
  UserSettingsOptional,
} from 'src/app/interfaces/interfaces';
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
  public isPasswordTrue: boolean | null = null;
  public toppings: FormControl = new FormControl('primary');
  public bgURLs: string[] = [
    'monkey-bg.png',
    'mountain.png',
    'terry.jpg',
    'unsplesh.jfif',
  ].map((name: string) => `../../../assets/bg/${name}`);
  public toppingList: SelecetData[] = [
    { name: 'primary', value: 'основной' },
    { name: 'accent', value: 'розовый' },
    { name: 'warn', value: 'красный' },
  ];
  public userData: UserSettingsOptional = {
    lastName: '',
    bio: '',
    shellColor: '',
    bgUrl: '',
    image: '',
  };
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
    this.settingsService.getUserSettings().subscribe((data: UserSettings) => {
      if (data.optional) {
        this.userData.lastName = data.optional.lastName || '';
        this.userData.bio = data.optional.bio || '';
        this.userData.bgUrl = data.optional.bgUrl || '';
        this.imageLink = data.optional.image || '';
        this.toppings.setValue(data.optional.shellColor || 'primary');
      }
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
      if (imageSize < Number('100000')) {
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
          this.isPasswordTrue = true;
        } else {
          this.newPswControl.disable();
          this.isPasswordTrue = false;
        }
      });
  }

  public saveSettings(): void {
    if (this.imageLink.length > 0) {
      this.userData.image = this.imageLink;
    }
    this.setUserData();
    this.setUserSettings();
    this.newPswControl.disable();
  }

  public changeShellColor(): void {
    this.userData.shellColor = this.toppings.value as string;
  }

  public setUserSettings(): void {
    const settingsOptional: UserSettingsOptional = {};
    Object.entries(this.userData).forEach(
      (entry: Array<string | undefined>) => {
        if (!entry[0]) return;
        if (entry[1] !== '') {
          settingsOptional[entry[0]] = entry[1];
        }
      }
    );
    this.settingsService.updateUserSettings(settingsOptional);
  }

  public deleteAccaunt(): void {
    this.settingsService.deleteUserAccaunt();
  }

  public setBgUrl(url: string): void {
    this.userData.bgUrl = url;
  }

  private setUserData(): void {
    const data: Partial<User> = {};

    if (this.nameControl.valid) {
      data.name = this.nameControl.value;
    }
    if (this.newPswControl.valid) {
      data.password = this.newPswControl.value;
    }
    this.settingsService.setUserData(data);
  }
}

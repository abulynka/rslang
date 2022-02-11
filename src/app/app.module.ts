import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SigninComponent } from './components/sign-in/signin.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { HttpService } from './services/http.service';
import { AuthService } from './services/auth.service';
import { AudiocallGameComponent } from './components/audiocall-game/audiocall-game.component';
import { WordComponent } from './components/etextbook/word/word.component';
import { PageComponent } from './components/etextbook/page/page.component';
import { ChapterComponent } from './components/etextbook/chapter/chapter.component';
import { EtextbookComponent } from './components/etextbook/etextbook/etextbook.component';
import { AudioComponent } from './components/etextbook/audio/audio.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SprintGameComponent } from './components/sprint-game/sprint-game.component';
import { GameResultComponent } from './components/game-result/game-result.component';
import { GamesStartComponent } from './components/games-start/games-start.component';
import { GamesStatesService } from './services/games-states.service';
import { UserProgressService } from './services/user-progress.service';
import { ShortStatisticComponent } from './components/short-statistic/short-statistic.component';
import { LongStatisticComponent } from './components/long-statistic/long-statistic.component';
import { NgxChartsModule } from "@swimlane/ngx-charts";

const appRoutes: Routes = [
  { path: '', component: MainPageComponent },
  {
    path: 'etextbook',
    component: EtextbookComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
    data: { animation: 'signin' },
    canActivate: [CheckAuthGuard],
  },
  {
    path: 'signup',
    component: SignUpComponent,
    data: { animation: 'signup' },
    canActivate: [CheckAuthGuard],
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
    data: { animation: 'about' },
  },
  {
    path: 'sprint-game',
    component: SprintGameComponent,
  },
  {
    path: 'audiocall',
    component: AudiocallGameComponent,
  },
  {
    path: 'short-statistic',
    component: ShortStatisticComponent,
  },
  {
    path: 'long-statistic',
    component: LongStatisticComponent,
  },
  { path: '**', component: MainPageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    SigninComponent,
    SignUpComponent,
    AboutUsComponent,
    AudiocallGameComponent,
    WordComponent,
    PageComponent,
    ChapterComponent,
    EtextbookComponent,
    SprintGameComponent,
    AudioComponent,
    GameResultComponent,
    GamesStartComponent,
    ShortStatisticComponent,
    LongStatisticComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatPaginatorModule,
    NgxChartsModule,
  ],
  providers: [
    HttpService,
    AuthService,
    GamesStatesService,
    UserProgressService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

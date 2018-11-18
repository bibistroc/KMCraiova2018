import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  public currentName = '';
  public currentColor = '#000000';
  public appHeight = 0;

  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    userService: UserService) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);

    this.currentName = userService.getUser();
    this.currentColor = userService.getColour();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.appHeight = document.body.clientHeight - 64;
  }
}

import { Component } from '@angular/core';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'NewShore_Air';
  isLoading?: boolean;
  constructor(private _commonSrv: CommonService) {
    this._commonSrv.isLoading.subscribe((value: boolean) => {
      // setTimeout(() => {
      this.isLoading = value;
      // }, 100);
    });
  }
}

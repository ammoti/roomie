import { OnInit, Component } from "@angular/core";
import { Router } from "@angular/router";
import { MatchService, LoginService, BackendService } from "~/services";
import { Page } from "tns-core-modules/ui/page/page";
import { action } from "tns-core-modules/ui/dialogs";
import { ImageSource } from "image-source";

@Component({
  selector: "rm-matchies",
  moduleId: module.id,
  templateUrl: "./matches.component.html",
  styleUrls: ["./css/matches-common.css", "./css/matches.component.css"],
  providers: [MatchService]
})
export class MatchesComponent implements OnInit {
  private _imageSource: ImageSource;
  isLoading: Boolean = false;
  constructor(
    private router: Router,
    private matchService: MatchService,
    private loginService: LoginService,
    private page: Page
  ) {
    this._imageSource = new ImageSource();
  }
  ngOnInit(): void {
    this.page.actionBarHidden = true;
    if (!BackendService.isComplete()) {
      this.router.navigate(["/questions"]);
    }
  }
  ngAfterViewInit() {
    this.isLoading = false;
  }
  showActivityIndicator(): void {
    this.isLoading = true;
  }
  hideActivityIndicator(): void {
    this.isLoading = false;
  }
  showMenu(): void {
    action({
      message: "What would you like to do?",
      actions: ["Share", "Log Off"],
      cancelButtonText: "Cancel"
    }).then(result => {
      if (result === "Share") {
      } else if (result === "Log Off") {
        this.logoff();
      }
    });
  }
  logoff(): void {
    this.loginService.logoff();
    this.router.navigate(["/login"]);
  }
}

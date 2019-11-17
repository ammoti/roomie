import { OnInit, Component } from "@angular/core";
import { Router } from "@angular/router";
import { MatchService, LoginService } from "~/services";
import { Page } from "tns-core-modules/ui/page/page";
import { action } from "tns-core-modules/ui/dialogs";

@Component({
  selector: "rm-matchies",
  moduleId: module.id,
  templateUrl: "./matches.component.html",
  styleUrls: ["./css/matches-common.css", "./css/matches.component.css"],
  providers: [MatchService]
})
export class MatchesComponent implements OnInit {
  isLoading: Boolean = false;
  constructor(
    private router: Router,
    private matchService: MatchService,
    private loginService: LoginService,
    private page: Page
  ) {}
  ngOnInit(): void {
    this.page.actionBarHidden = true;
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

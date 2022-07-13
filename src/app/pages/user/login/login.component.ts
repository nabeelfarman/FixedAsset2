import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { AppComponent } from "src/app/app.component";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

declare var jQuery: any;
declare var $: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2006/";
  serverUrl = "http://125.209.107.137:7002/";
  //serverUrl = "http://192.168.100.162:9010/";
  // serverUrl = "http://192.168.100.162:7002/";
  // serverUrl = "http://localhost:5000/";

  showProgress = false;
  showResetProgress = false;

  emailAddress = "";
  loginPassword = "";
  resetEmailAddress = "";
  resetOldPassword = "";
  resetNewPassword = "";
  resetConfirmPassword = "";

  roleTitle = "";

  constructor(
    public toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent,
    private router: Router,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    if (this.cookie.get("userID") != "") {
      this.router.navigate(["assetEntry"]);
      $("#menuId").show();
    } else {
      $("#menuId").hide();
    }
  }

  /*** Capture Enter key ***/
  getKeyPressed(e) {
    if (e.keyCode == 13) {
      this.login();
    }
  }

  login() {
    if (this.emailAddress == "") {
      this.toastr.errorToastr("Please Enter Email", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.loginPassword == "") {
      this.toastr.errorToastr("Please Enter Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var reqData = {
        UserName: this.emailAddress,
        HashPassword: this.loginPassword,
      };

      this.showProgress = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
      this.http
        .post(this.serverUrl + "api/CreateToken", reqData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          // alert(data.msg);
          if (data.msg == "Success") {
            this.toastr.successToastr("Login Successfully!", "Success!", {
              toastTimeout: 2500,
            });

            this.cookie.set("token", data.token);
            this.cookie.set("userID", data.userDetail[0].id);
            this.cookie.set("userName", data.userDetail[0].loginName);
            this.cookie.set("pinstatus", data.userDetail[0].pinStatus);
            this.cookie.set("roleName", data.userDetail[0].roleDisplayName);

            this.app.userName = this.cookie.get("userName");
            this.app.userRole = this.cookie.get("roleName");

            // alert(this.cookie.get("userID"));
            this.showProgress = false;
            this.router.navigate(["home"]);
            $("#menuId").show();
            // this.app.startWatching();
            // this.app.subscribeIdle();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            this.showProgress = false;
            return false;
          }
        });
    }
  }

  resetPassword() {
    //  = "";
    //  = "";
    // resetNewPassword = "";
    // resetConfirmPassword = "";

    if (this.resetEmailAddress == "") {
      this.toastr.errorToastr("Please Enter Email", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.resetOldPassword == "") {
      this.toastr.errorToastr("Please Enter Old Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.resetNewPassword == "") {
      this.toastr.errorToastr("Please Enter New Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.resetConfirmPassword == "") {
      this.toastr.errorToastr("Please Enter Confirm Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.resetConfirmPassword != this.resetNewPassword) {
      this.toastr.errorToastr(
        "New & Confirm Password does not Match",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else {
      var reqData = {
        UserName: this.emailAddress,
        HashPassword: this.loginPassword,
      };
    }
  }
}

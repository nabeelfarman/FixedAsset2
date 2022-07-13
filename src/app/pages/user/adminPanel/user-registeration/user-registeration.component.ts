import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { UserIdleService } from "angular-user-idle";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { AppComponent } from "../../../../app.component";

declare var $: any;

@Component({
  selector: "app-user-registeration",
  templateUrl: "./user-registeration.component.html",
  styleUrls: ["./user-registeration.component.scss"],
})
export class UserRegisterationComponent implements OnInit {
  loadingBar = true;
  // serverUrl = "http://95.217.206.195:2007/api/";
  //serverUrl = "http://192.168.100.162:12345/api/";
  toppings = new FormControl();

  txtPin = "";
  userIDforLoc = 0;
  userID = "";
  txtEmail = "";
  txtName = "";
  txtFName = "";
  txtCnic = "";
  ddlPost = "";
  ddlUserRole = "";
  rdbPin = "";
  ddlLocations = "";

  txtSearchPost = "";
  txtSearchRole = "";
  txtSearchUser = "";
  txtSearchLoc = "";

  postsList = [];
  userRoleList = [];
  locationsList = [];
  userLocationsList = [];

  usersList = [];
  objList = [];

  toppingList: string[] = [
    "Abbottabad - GM Office",
    "Abbottabad - Toll Plaza",
    "Karachi - Keti Bandar Toll Plaza",
    "Quetta - DD Maintenance Office",
  ];

  constructor(
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService,
    private toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.getPosts();
    this.getRoles();
    this.getUsers();
    this.getLocations();
  }

  getPosts() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getposts?IsActivated=0", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.postsList = data;
      });
  }

  getRoles() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getroles?IsActivated=0", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.userRoleList = data;
      });
  }

  getLocations() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getsubloc?IsActivated=1", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.locationsList = data;
      });
  }

  getUserLocations(userid) {
    this.userIDforLoc = userid;
    this.userLocationsList = [];
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getuserlocation?UserId=" + userid, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.userLocationsList = data;
      });
  }

  getUsers() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getusers", { headers: reqHeader })
      .subscribe((data: any) => {
        this.usersList = data;
        this.loadingBar = false;
      });
  }

  save() {
    if (this.txtEmail == undefined || this.txtEmail.trim() == "") {
      this.toastr.errorToastr("Please Enter Email", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ValidateEmail(this.txtEmail) == false) {
      this.toastr.errorToastr("Please Enter Valid Email", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtName == undefined || this.txtName.trim() == "") {
      this.toastr.errorToastr("Please Enter Full Name", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtFName == undefined || this.txtFName.trim() == "") {
      this.toastr.errorToastr("Please Enter Father / Husband Name", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtCnic == undefined || this.txtCnic.trim() == "") {
      this.toastr.errorToastr("Please Enter CNIC", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtCnic.trim().length < 15) {
      this.toastr.errorToastr("Please Enter Complete CNIC", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlPost == undefined || this.ddlPost == "") {
      this.toastr.errorToastr("Please Select Post", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlUserRole == undefined || this.ddlUserRole == "") {
      this.toastr.errorToastr("Please Select Role", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var reqSpType = "Insert";

      if (this.userID != "") {
        reqSpType = "Update";
      }

      var reqPin = false;
      if (this.rdbPin == "1") {
        reqPin = true;
      }
      debugger;
      var SaveData = {
        LoginName: this.txtEmail.trim(),
        HashPassword: this.txtEmail.trim(),
        Name: this.txtName.trim(),
        FName: this.txtFName.trim(),
        CNIC: this.txtCnic.trim(),
        PostID: this.ddlPost,
        PhoneNo: 0,
        CellNo: 0,
        Email: this.txtEmail.trim(),
        Address: "-",
        LoginID: this.cookie.get("userID"),
        SPType: reqSpType,
        Pincode: null,
        Ispincode: reqPin,
        RoleID: this.ddlUserRole,
      };

      this.loadingBar = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "reguser", SaveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.userID == "") {
              this.toastr.successToastr(
                "Record Saved Successfully!",
                "Success!",
                { toastTimeout: 2500 }
              );
            } else {
              this.toastr.successToastr(
                "Record Updated Successfully!",
                "Success!",
                { toastTimeout: 2500 }
              );
            }

            this.clear();
            this.getUsers();
            this.loadingBar = false;
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            this.loadingBar = false;
            return false;
          }
        });
    }
  }

  clear() {
    this.userID = "";
    this.txtEmail = "";
    this.txtName = "";
    this.txtFName = "";
    this.txtCnic = "";
    this.ddlPost = "";
    this.ddlUserRole = "";
  }

  editUser(item) {
    this.userID = item.id;
    this.txtEmail = item.email;
    this.txtName = item.name;
    if (item.fname == null) {
      this.txtFName = "";
    } else {
      this.txtFName = item.fname;
    }

    if (item.cnic == null) {
      this.txtCnic = "";
    } else {
      this.txtCnic = item.cnic;
    }

    this.ddlPost = item.postID.toString();
    this.ddlUserRole = item.roleID.toString();
    this.rdbPin = item.isPincode.toString();
  }

  deleteUser(item) {
    setTimeout(() => {
      Swal.fire({
        title: "Do you want to delete?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          this.loadingBar = true;

          var SaveData = {
            LoginID: this.cookie.get("userID"),
            SPType: "Delete",
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "reguser", SaveData, {
              headers: reqHeader,
            })
            .subscribe((data: any) => {
              if (data.msg == "Success") {
                this.toastr.successToastr(
                  "Record Deleted Successfully!",
                  "Success!",
                  { toastTimeout: 2500 }
                );
                this.clear();
                this.getUsers();
                this.loadingBar = false;
                return false;
              } else {
                this.toastr.errorToastr(data.msg, "Error !", {
                  toastTimeout: 5000,
                });
                this.loadingBar = false;
                return false;
              }
            });
        }
      });
    }, 1000);
  }

  saveLocation() {
    if (this.ddlLocations == undefined || this.ddlLocations == "") {
      this.toastr.errorToastr("Please Select Location", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var SaveData = {
        UserId: this.userIDforLoc,
        SubLocId: this.ddlLocations,
        LoginID: this.cookie.get("userID"),
        SPType: "Insert",
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sduserloc", SaveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            this.toastr.successToastr(
              "Record Saved Successfully!",
              "Success!",
              { toastTimeout: 2500 }
            );
            this.http
              .get(
                this.app.serverUrl +
                  "getuserlocation?UserId=" +
                  this.userIDforLoc,
                { headers: reqHeader }
              )
              .subscribe((data: any) => {
                this.userLocationsList = data;
              });
            this.loadingBar = false;
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            this.loadingBar = false;
            return false;
          }
        });
    }
  }

  deleteLocation(item) {
    var SaveData = {
      UserId: this.userIDforLoc,
      SubLocId: item.subLocID,
      LoginID: this.cookie.get("userID"),
      SPType: "Delete",
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.app.serverUrl + "sduserloc", SaveData, { headers: reqHeader })
      .subscribe((data: any) => {
        if (data.msg == "Success") {
          this.toastr.successToastr(
            "Record Deleted Successfully!",
            "Success!",
            { toastTimeout: 2500 }
          );
          this.http
            .get(
              this.app.serverUrl +
                "getuserlocation?UserId=" +
                this.userIDforLoc,
              { headers: reqHeader }
            )
            .subscribe((data: any) => {
              this.userLocationsList = data;
            });
          this.loadingBar = false;
          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error !", {
            toastTimeout: 5000,
          });
          this.loadingBar = false;
          return false;
        }
      });
  }

  ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    } else {
      return false;
    }
  }

  active(obj) {
    var type = "";
    if (obj.isActivated == false) {
      type = "DEACTIVATE";
    } else {
      type = "ACTIVATE";
    }

    // this.loadingBar = true;
    // alert(obj.loginName);
    // return false;

    var SaveData = {
      LoginName: obj.loginName,
      LoginID: this.cookie.get("userID"),
      SPType: type,
    };

    this.loadingBar = true;
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.app.serverUrl + "reguser", SaveData, { headers: reqHeader })
      .subscribe((data: any) => {
        if (data.msg == "Success" && type == "DEACTIVATE") {
          this.toastr.successToastr(
            "User Deactivated Successfully!",
            "Success!",
            { toastTimeout: 2500 }
          );
          this.clear();
          this.getUsers();
          return false;
        } else if (data.msg == "Success" && type == "ACTIVATE") {
          this.toastr.successToastr(
            "User Activated Successfully!",
            "Success!",
            { toastTimeout: 2500 }
          );
          this.clear();
          this.getUsers();
          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error !", { toastTimeout: 5000 });
          this.loadingBar = false;
          return false;
        }
      });
  }

  genPin(obj) {
    // alert(obj.email);
    if (this.cookie.get("pinstatus") == "true") {
      this.txtPin = "";
      this.objList = [];
      this.objList = obj;

      $("#genPinModal").modal("show");
    } else {
      this.toastr.errorToastr("PIN Code is not allowed", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }
  }

  /*** Capture Enter key ***/
  getKeyPressed(e) {
    if (e.keyCode == 13) {
      this.allowUpdation();
    }
  }

  allowUpdation() {
    // alert(this.objList);
    // alert(this.paramType);

    if (this.txtPin == "") {
      this.toastr.errorToastr("Please Enter Pin", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtPin.length != 4) {
      this.toastr.errorToastr("Please Enter Correct Pin", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var saveData = {
        UserName: this.cookie.get("userName"),
        Pincode: this.txtPin,
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "pincode", saveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            $("#genPinModal").modal("hide");
            this.resetPw(this.objList);
            // this.paramType = "";
            // this.objList = [];
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          }
        });
    }
  }

  resetPw(item) {
    var saveData = {
      UserName: item.email,
      HashPassword: "1234",
      UpdatedBY: this.cookie.get("userID"),
      SpType: "PASSWORD",
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.app.serverUrl + "resetpw", saveData, { headers: reqHeader })
      .subscribe((data: any) => {
        if (data.msg == "Success") {
          this.toastr.successToastr(
            "Password Reset Successfully!",
            "Success!",
            { toastTimeout: 2500 }
          );
          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
        }
      });
  }
}

import { Component, OnInit } from "@angular/core";
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
  selector: "app-create-building",
  templateUrl: "./create-building.component.html",
  styleUrls: ["./create-building.component.scss"],
})
export class CreateBuildingComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2007/api/";

  loadingBar = false;

  heading = "Add";
  cmbLocation = "";
  cmbProject = "";

  txtPin = "";
  txtShortName = "";
  txtDescription = "";
  txtAddress = "";
  txtPackage = "";

  lblBuildID = 0;

  tblSearch = "";
  lblLocationSearch = "";
  lblProjectSearch = "";

  tempList = [];
  buildingList = [];
  locationList = [];
  projectList = [];

  objList = [];
  paramType = "";
  index = 0;

  constructor(
    // private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService,
    private toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent
  ) {}
  ngOnInit(): void {
    this.getBuilding();
    this.getLocation();
    this.getProject();
  }

  getBuilding() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getBuildings", { headers: reqHeader })
      .subscribe((data: any) => {
        this.buildingList = data;
        this.tempList = data;
        this.loadingBar = false;
      });
  }

  filterTable() {
    this.buildingList = this.tempList;

    if (this.cmbLocation == "" && this.cmbProject != "") {
      this.buildingList = this.buildingList.filter(
        (x) => x.projectID == this.cmbProject
      );
    } else if (this.cmbProject == "" && this.cmbLocation != "") {
      this.buildingList = this.buildingList.filter(
        (x) => x.subLocID == this.cmbLocation
      );
    } else {
      this.buildingList = this.buildingList.filter(
        (x) => x.subLocID == this.cmbLocation && x.projectID == this.cmbProject
      );
    }
  }
  getLocation() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
      .subscribe((data: any) => {
        this.locationList = data;
        this.loadingBar = false;
      });
  }

  getProject() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getprojects?IsActivated=1", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.projectList = data;
        this.loadingBar = false;
      });
  }

  save() {
    if (this.cmbLocation == "") {
      this.toastr.errorToastr("Please Select Building Location", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtShortName == "") {
      this.toastr.errorToastr("Please Enter Building Short Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtDescription == "") {
      this.toastr.errorToastr("Please Enter Building Description", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtAddress == "") {
      this.toastr.errorToastr("Please Enter Building Address", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbProject == "") {
      this.toastr.errorToastr("Please Select Project", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtPackage == "") {
      this.toastr.errorToastr("Please Enter Package Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var reqSpType = "Insert";
      if (this.lblBuildID > 0) {
        reqSpType = "Update";
      }

      var saveData = {
        buildingId: this.lblBuildID,
        subLocID: parseInt(this.cmbLocation),
        projectID: parseInt(this.cmbProject),
        buildingShortName: this.txtShortName,
        buildingDescription: this.txtDescription,
        buildingAddress: this.txtAddress,
        packageName: this.txtPackage,
        userID: this.cookie.get("userID"),
        spType: reqSpType,
      };

      this.loadingBar = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudBuildCon", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.lblBuildID == 0) {
              this.toastr.successToastr(
                "Record Saved Successfully!",
                "Success!",
                {
                  toastTimeout: 2500,
                }
              );
            } else {
              this.toastr.successToastr(
                "Record Updated Successfully!",
                "Success!",
                {
                  toastTimeout: 2500,
                }
              );
            }
            this.clear();
            this.getBuilding();
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

  edit(obj) {
    this.heading = "Edit";
    this.cmbLocation = obj.subLocID;
    this.cmbProject = obj.projectID;

    this.txtShortName = obj.buildingShortName;
    this.txtDescription = obj.buildingDescription;
    this.txtAddress = obj.buildingAddress;
    this.txtPackage = obj.packageName;

    this.lblBuildID = obj.buildingId;

    this.tblSearch = "";
    this.lblLocationSearch = "";
    this.lblProjectSearch = "";
  }

  delete(obj) {
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
          var saveData = {
            buildingId: obj.buildingId,
            userID: this.cookie.get("userID"),
            spType: "Delete",
          };
          this.loadingBar = true;
          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "sudBuildCon", saveData, {
              headers: reqHeader,
            })
            .subscribe((data: any) => {
              if (data.msg == "Success") {
                this.toastr.successToastr(
                  "Record Deleted Successfully!",
                  "Success!",
                  {
                    toastTimeout: 2500,
                  }
                );
                this.clear();
                this.getBuilding();
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

  genPin(obj, param, i) {
    if (this.cookie.get("pinstatus") == "true") {
      this.txtPin = "";
      this.objList = [];
      this.paramType = "";
      this.objList = obj;
      this.paramType = param;
      this.index = i;

      $("#genPinModal").modal("show");
    } else {
      this.toastr.errorToastr("PIN Code is not allowed", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }
  }

  resetPin() {
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
        HashPassword: this.txtPin,
        UpdatedBY: this.cookie.get("userID"),
        SpType: "PINCODE",
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "resetPw", saveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            this.toastr.successToastr("Pin Changed Successfully!", "Success!", {
              toastTimeout: 2500,
            });
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          }
        });
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
            if (this.paramType == "edit") {
              this.edit(this.objList);
            } else if (this.paramType == "delete") {
              this.delete(this.objList);
            }
            this.paramType = "";
            this.objList = [];
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          }
        });
    }
  }

  onKeyPress(event) {
    if ((event.keyCode > 47 && event.keyCode < 58) || event.keyCode == 8) {
      return true;
    } else {
      return false;
    }
  }
  clear() {
    this.heading = "Add";
    // this.cmbLocation = "";
    // this.cmbProject = "";

    this.txtShortName = "";
    this.txtDescription = "";
    this.txtAddress = "";
    this.txtPackage = "";

    this.lblBuildID = 0;

    this.tblSearch = "";
    this.lblLocationSearch = "";
    this.lblProjectSearch = "";

    // this.buildingList = this.tempList;
  }

  clearAll() {
    this.heading = "Add";
    this.cmbLocation = "";
    this.cmbProject = "";

    this.txtShortName = "";
    this.txtDescription = "";
    this.txtAddress = "";
    this.txtPackage = "";

    this.lblBuildID = 0;

    this.tblSearch = "";
    this.lblLocationSearch = "";
    this.lblProjectSearch = "";

    this.buildingList = this.tempList;
  }
}

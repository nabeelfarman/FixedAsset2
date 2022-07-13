import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { AppComponent } from "../../../../app.component";

declare var $: any;

@Component({
  selector: "app-nhaloc",
  templateUrl: "./nhaloc.component.html",
  styleUrls: ["./nhaloc.component.scss"],
})
export class NHALocComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2007/api/";
  // serverUrl = "http://192.168.100.162:5090/api/";
  heading = "Add";

  loadingBar = true;

  txtPin = "";
  subLocID = "";
  txtLocShrtName = "";
  txtLocFullName = "";
  cmbRegion = "";
  cmbOfcType = 0;

  searchOfcType = "";
  searchLocation = "";
  tblSearch = "";

  locList = [];
  tempList = [];
  ofcTypeList = [];
  mainLocList = [];

  objList = [];
  paramType = "";
  index = 0;

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.getLocation();
    this.getMainLocation();
    this.getOfficeType();
  }

  getOfficeType() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getofctype", { headers: reqHeader })
      .subscribe((data: any) => {
        this.ofcTypeList = data;
      });
  }

  getMainLocation() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getmainLoc", { headers: reqHeader })
      .subscribe((data: any) => {
        this.mainLocList = data;
        this.loadingBar = false;
      });
  }

  getLocation() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
      .subscribe((data: any) => {
        this.tempList = data;
        // alert(this.cmbRegion);
        if (this.cmbRegion != "") {
          // alert("if");
          this.locList = this.locList.filter(
            (x) => x.mainLocID == this.cmbRegion
          );
        } else {
          // alert("else");
          this.locList = data;
        }
        this.loadingBar = false;
      });
  }

  filterTable(loc) {
    this.locList = this.tempList;
    this.locList = this.locList.filter((x) => x.mainLocID == loc);
  }

  save() {
    if (this.cmbRegion == "") {
      this.toastr.errorToastr("Please Select Region", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbOfcType == 0) {
      this.toastr.errorToastr("Please Select Office Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtLocShrtName == "") {
      this.toastr.errorToastr("Please Enter Location Short Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtLocFullName == "") {
      this.toastr.errorToastr("Please Enter Location Full Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;
      if (this.subLocID == "") {
        saveData = {
          MainLocID: this.cmbRegion,
          SubLocation: this.txtLocFullName,
          subLocationCode: this.txtLocShrtName,
          OfficeTypeID: this.cmbOfcType,
          SubLocationID: 0,
          UserId: this.cookie.get("userID"),
          SPType: "INSERT",
        };
      } else {
        saveData = {
          MainLocID: this.cmbRegion,
          SubLocation: this.txtLocFullName,
          subLocationCode: this.txtLocShrtName,
          OfficeTypeID: this.cmbOfcType,
          SubLocationID: this.subLocID,
          UserId: this.cookie.get("userID"),
          SPType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sublocation", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "SUCCESS") {
            if (this.subLocID == "") {
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
            this.getLocation();
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
    this.subLocID = obj.subLocID;
    this.txtLocShrtName = obj.subLocationCode;
    this.txtLocFullName = obj.subLocationDescription;
    this.cmbRegion = obj.mainLocID;
    this.cmbOfcType = obj.officeTypeID;
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
            // Userid: this.cookie.get("userID"), //int
            SpType: "DELETE", //string
            SubLocationID: obj.subLocID,
            userID: this.cookie.get("userID"), //int
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "sublocation", saveData, {
              headers: reqHeader,
            })
            .subscribe((data: any) => {
              if (data.msg == "SUCCESS") {
                this.toastr.successToastr(
                  "Record Deleted Successfully!",
                  "Success!",
                  {
                    toastTimeout: 2500,
                  }
                );
                this.clear();
                this.getLocation();
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

  active(obj) {
    var type = "";
    if (obj.isActivated == true) {
      setTimeout(() => (this.locList[this.index].isActivated = false), 10);
      type = "DEACTIVATE";
    } else {
      setTimeout(() => (this.locList[this.index].isActivated = true), 10);
      type = "ACTIVATE";
    }

    // this.loadingBar = true;

    var saveData = {
      Userid: this.cookie.get("userID"), //int
      SpType: type, //string
      SubLocationID: obj.subLocID,
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.app.serverUrl + "sublocation", saveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "SUCCESS") {
          this.toastr.successToastr(
            "Record " + type + " Successfully!",
            "Success!",
            {
              toastTimeout: 2500,
            }
          );
          this.clear();
          this.getLocation();
          // this.loadingBar = false;
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

  clear() {
    this.heading = "Add";
    this.subLocID = "";
    this.txtLocShrtName = "";
    this.txtLocFullName = "";
    this.cmbOfcType = 0;

    this.searchLocation = "";
    this.tblSearch = "";
  }

  clearAll() {
    this.heading = "Add";
    this.subLocID = "";
    this.txtLocShrtName = "";
    this.txtLocFullName = "";
    this.cmbRegion = "";
    this.cmbOfcType = 0;

    this.searchLocation = "";
    this.tblSearch = "";

    this.locList = this.tempList;
  }

  genPin(obj, param, i) {
    if (this.cookie.get("pinstatus") == "true") {
      this.txtPin = "";
      this.objList = [];
      this.paramType = "";
      this.objList = obj;
      this.paramType = param;
      this.index = i;

      if (param == "active") {
        // alert(obj.isActivated);
        // setTimeout(this.sld)
        if (obj.isActivated == false) {
          setTimeout(() => (this.locList[i].isActivated = true), 10);
        } else {
          setTimeout(() => (this.locList[i].isActivated = false), 10);
        }
      }
      $("#genPinModal").modal("show");
    } else {
      if (obj.isActivated == false) {
        setTimeout(() => (this.locList[i].isActivated = true), 10);
      } else {
        setTimeout(() => (this.locList[i].isActivated = false), 10);
      }
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
            } else if (this.paramType == "active") {
              this.active(this.objList);
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
}

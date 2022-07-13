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
  selector: "app-nhasection",
  templateUrl: "./nhasection.component.html",
  styleUrls: ["./nhasection.component.scss"],
})
export class NHASectionComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2007/api/";
  // serverUrl = "http://192.168.100.162:5090/api/";

  heading = "Add";

  loadingBar = true;

  txtPin = "";
  secID = "";
  txtSecShrtName = "";
  txtSecFullName = "";
  cmbWing = "";
  cmbOfcType = 0;

  searchOfcType = "";
  searchWing = "";
  tblSearch = "";

  tempList = [];
  wngSectionList = [];
  ofcTypeList = [];
  wingList = [];

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
    this.getSection();
    this.getWing();
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

  getWing() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getwing", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.wingList = data;
      });
  }

  getSection() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getwingsec", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.tempList = data;
        if (this.cmbOfcType == 0) {
          this.wngSectionList = data;
        } else {
          this.wngSectionList = this.wngSectionList.filter(
            (x) => x.officeTypeID == this.cmbOfcType
          );
        }
        this.loadingBar = false;
      });
  }

  filterTable(ofcType) {
    this.wngSectionList = this.tempList;
    this.wngSectionList = this.wngSectionList.filter(
      (x) => x.officeTypeID == ofcType
    );
  }

  save() {
    if (this.cmbOfcType == 0) {
      this.toastr.errorToastr("Please Select Office Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbWing == "") {
      this.toastr.errorToastr("Please Select Wing", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtSecShrtName == "") {
      this.toastr.errorToastr("Please Enter Section Short Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtSecFullName == "") {
      this.toastr.errorToastr("Please Enter Section Full Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;
      if (this.secID == "") {
        saveData = {
          OfficeCode: this.txtSecShrtName,
          OfficeDescription: this.txtSecFullName,
          OfficeSecID: 0,
          OfficeTypeID: this.cmbOfcType,
          WingID: this.cmbWing,
          UserId: this.cookie.get("userID"),
          SPType: "INSERT",
        };
      } else {
        saveData = {
          OfficeCode: this.txtSecShrtName,
          OfficeDescription: this.txtSecFullName,
          OfficeSecID: this.secID,
          OfficeTypeID: this.cmbOfcType,
          WingID: this.cmbWing,
          UserId: this.cookie.get("userID"),
          SPType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "ofcsection", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "SUCCESS") {
            if (this.secID == "") {
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
            this.getSection();
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

    this.secID = obj.officeSecID;
    this.txtSecShrtName = obj.officeCode;
    this.txtSecFullName = obj.officeDescription;
    this.cmbWing = obj.wingID;
    this.cmbOfcType = parseInt(obj.officeTypeID);
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
            Userid: this.cookie.get("userID"), //int
            SpType: "DELETE", //string
            OfficeSecID: obj.officeSecID, //int
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "ofcsection", saveData, {
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
                this.getSection();
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
      setTimeout(
        () => (this.wngSectionList[this.index].isActivated = false),
        10
      );
      type = "DEACTIVATE";
    } else {
      setTimeout(
        () => (this.wngSectionList[this.index].isActivated = true),
        10
      );
      type = "ACTIVATE";
    }

    // this.loadingBar = true;

    var saveData = {
      Userid: this.cookie.get("userID"), //int
      SpType: type, //string
      OfficeSecID: obj.officeSecID, //int
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.app.serverUrl + "ofcsection", saveData, {
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
          this.getSection();
          // this.loadingBar = false;
          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error !", {
            toastTimeout: 5000,
          });
          // this.loadingBar = false;
          return false;
        }
      });
  }

  clear() {
    this.heading = "Add";

    this.secID = "";
    this.txtSecShrtName = "";
    this.txtSecFullName = "";
    this.cmbWing = "";

    this.searchOfcType = "";
    this.searchWing = "";
    this.tblSearch = "";
    this.wngSectionList = this.tempList;
  }

  clearAll() {
    this.heading = "Add";

    this.secID = "";
    this.txtSecShrtName = "";
    this.txtSecFullName = "";
    this.cmbWing = "";
    this.cmbOfcType = 0;

    this.searchOfcType = "";
    this.searchWing = "";
    this.tblSearch = "";
    this.wngSectionList = this.tempList;
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
          setTimeout(() => (this.wngSectionList[i].isActivated = true), 10);
        } else {
          setTimeout(() => (this.wngSectionList[i].isActivated = false), 10);
        }
      }
      $("#genPinModal").modal("show");
    } else {
      if (param == "active") {
        if (obj.isActivated == false) {
          setTimeout(() => (this.wngSectionList[i].isActivated = true), 10);
        } else {
          setTimeout(() => (this.wngSectionList[i].isActivated = false), 10);
        }
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

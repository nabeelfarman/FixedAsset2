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
  selector: "app-nhaprojects",
  templateUrl: "./nhaprojects.component.html",
  styleUrls: ["./nhaprojects.component.scss"],
})
export class NHAProjectsComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2007/api/";
  // serverUrl = "http://192.168.100.162:5090/api/";

  heading = "Add";

  loadingBar = true;

  txtPin = "";
  projectID = "";
  txtProShrtName = "";
  txtProFullName = "";
  cmbOfcSec = "";
  txtAccTitle = "";

  searchOfcSec = "";
  tblSearch = "";

  projectList = [];
  tempList = [];
  ofcSecList = [];

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
    this.getProject();
    this.getOfcSection();
  }

  getOfcSection() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getwingsec", { headers: reqHeader })
      .subscribe((data: any) => {
        this.ofcSecList = data;
        // this.loadingBar = false;
      });
  }

  getProject() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getprojects", { headers: reqHeader })
      .subscribe((data: any) => {
        this.tempList = data;

        if (this.cmbOfcSec != "") {
          this.projectList = this.projectList
            .filter((x) => x.officeSecID == this.cmbOfcSec)
            .reverse();
        } else {
          this.projectList = data;
        }
        this.loadingBar = false;
      });
  }

  filterTable(cmbOfcSec) {
    this.projectList = this.tempList;

    this.projectList = this.projectList
      .filter((x) => x.officeSecID == cmbOfcSec)
      .reverse();
  }

  save() {
    if (this.cmbOfcSec == "") {
      this.toastr.errorToastr("Please Select Office Section", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtAccTitle == "") {
      this.toastr.errorToastr("Please Select Account Code-Title", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtProShrtName == "") {
      this.toastr.errorToastr("Please Enter Porject Short Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtProFullName == "") {
      this.toastr.errorToastr("Please Enter Project Full Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;
      if (this.projectID == "") {
        saveData = {
          ProjectShortName: this.txtProShrtName,
          projectName: this.txtProFullName,
          OfficeSecID: this.cmbOfcSec,
          AccountCode: this.txtAccTitle,
          ProjectID: 0,
          UserId: this.cookie.get("userID"),
          SPType: "INSERT",
        };
      } else {
        saveData = {
          ProjectShortName: this.txtProShrtName,
          projectName: this.txtProFullName,
          OfficeSecID: this.cmbOfcSec,
          AccountCode: this.txtAccTitle,
          ProjectID: this.projectID,
          UserId: this.cookie.get("userID"),
          SPType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudproject", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.projectID == "") {
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
            this.getProject();
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

    this.projectID = obj.projectID;
    // this.txtAccSection = obj.;
    this.txtProShrtName = obj.projectShortName;
    this.txtProFullName = obj.projectName;
    this.cmbOfcSec = obj.officeSecID;
    this.txtAccTitle = obj.accountCode;
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
            ProjectID: obj.projectID, //int
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "sudproject", saveData, {
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
                this.getProject();
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
      setTimeout(() => (this.projectList[this.index].isActivated = false), 10);
      type = "DEACTIVATE";
    } else {
      setTimeout(() => (this.projectList[this.index].isActivated = true), 10);
      type = "ACTIVATE";
    }

    var saveData = {
      Userid: this.cookie.get("userID"), //int
      SpType: type, //string
      OfficeSecID: obj.projectID, //int
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.app.serverUrl + "sudproject", saveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "Success") {
          this.toastr.successToastr(
            "Record " + type + " Successfully!",
            "Success!",
            {
              toastTimeout: 2500,
            }
          );
          this.clear();
          this.getProject();
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

    this.projectID = "";
    this.txtProShrtName = "";
    this.txtProFullName = "";
    this.txtAccTitle = "";

    this.searchOfcSec = "";
    this.tblSearch = "";
  }

  clearAll() {
    this.heading = "Add";

    this.projectID = "";
    this.txtProShrtName = "";
    this.txtProFullName = "";
    this.cmbOfcSec = "";
    this.txtAccTitle = "";

    this.searchOfcSec = "";
    this.tblSearch = "";

    this.projectList = this.tempList;
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
          setTimeout(() => (this.projectList[i].isActivated = true), 10);
        } else {
          setTimeout(() => (this.projectList[i].isActivated = false), 10);
        }
      }
      $("#genPinModal").modal("show");
    } else {
      if (obj.isActivated == false) {
        setTimeout(() => (this.projectList[i].isActivated = true), 10);
      } else {
        setTimeout(() => (this.projectList[i].isActivated = false), 10);
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

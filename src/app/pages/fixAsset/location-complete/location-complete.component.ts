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
import { AppComponent } from "../../../app.component";

declare var $: any;

@Component({
  selector: "app-location-complete",
  templateUrl: "./location-complete.component.html",
  styleUrls: ["./location-complete.component.scss"],
})
export class LocationCompleteComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2007/api/";
  // serverUrl = "http://192.168.100.162:5090/api/";

  loadingBar = false;

  imgPath = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/Location";
  showPdf = "";
  lblFileName = "";
  image;
  selectedFile: File = null;

  panelOpenState = false;
  userLocations = [];
  tempLocList = [];

  txtPin = "";
  compLoc = "";
  locID = 0;
  officeTypeID = 0;
  locationTitle = "Select Location";
  locationCheckList = [];
  locationStatus = 1;
  locStatus = 0;
  userRole = "";

  constructor(
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService,
    private toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.getUserLocations();
    this.userRole = this.cookie.get("roleName");
  }

  showLocCheckList(item) {
    this.locStatus = item.isCompleted;
    // alert(this.locID);
    // alert(item.officeTypeID);
    this.compLoc = item.isCompleted;
    this.locID = item.subLocID;
    this.officeTypeID = item.officeTypeID;
    this.locationTitle =
      item.subLocationDescription + " - " + item.officeTypeDescription;
    this.locationStatus = item.isCompleted;
    // this.locationStatus = 1;
    this.getCheckList(this.locID, this.officeTypeID);
  }

  getCheckList(subLocIDp, officeTypeIDp) {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getLocationCheckList?subLocID=" +
          subLocIDp +
          "&officeTypeID=" +
          officeTypeIDp,
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.locationCheckList = data;
        this.tempLocList = data;
      });
  }

  // get user location
  getUserLocations() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getuserlocation?UserID=" +
          this.cookie.get("userID"),
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.userLocations = data;
      });
  }

  // update check list
  updateCheckList(item) {
    // alert(item.description);
    if (
      item.fileRequired == 1 &&
      (item.eDoc == "" || item.eDoc == null || item.eDoc == undefined)
    ) {
      this.toastr.errorToastr("File Required to upload", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      item.description == "" ||
      item.description == undefined ||
      item.description == null
    ) {
      this.toastr.errorToastr("description is required", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var filePath = "";
      var fileExtension = "";

      //eDoc setting
      if (item.fileRequired == 1) {
        filePath = this.imgPath;
        fileExtension = "pdf";
      }
      //update
      var saveData = {
        LocCheckListID: item.locCheckListID,
        Description: item.description,
        status: 1,
        SubLocCompletionID: item.subLocCompletionID,
        EDoc: filePath,
        EDocExtension: fileExtension,
        imgFile: item.eFile,
        UserId: this.cookie.get("userID"),
        SpType: "UPDATE",
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "updatechecklist", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            this.toastr.successToastr(
              "Record Updated Successfully!",
              "Success!",
              {
                toastTimeout: 2500,
              }
            );
            // this.showLocCheckList(item);
            this.getCheckList(this.locID, this.officeTypeID);
            // this.clear();
            // this.getAssetCategory();
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
  }

  // update check list
  undoneCheckList(item) {
    var saveData = {
      LocCheckListID: item.locCheckListID,
      Description: item.description,
      status: 0,
      SubLocCompletionID: item.subLocCompletionID,
      EDoc: null,
      EDocExtension: null,
      imgFile: null,
      UserId: this.cookie.get("userID"),
      SpType: "UPDATE",
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.app.serverUrl + "updatechecklist", saveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "Success") {
          this.toastr.successToastr(
            "Record Updated Successfully!",
            "Success!",
            {
              toastTimeout: 2500,
            }
          );
          // this.showLocCheckList(item);
          this.getCheckList(this.locID, this.officeTypeID);
          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error !", {
            toastTimeout: 5000,
          });
          return false;
        }
      });
  }

  verifyPin(param) {
    var count = 0;
    if (this.locID == 0) {
      this.toastr.errorToastr("Please Select Location", "Error !", {
        toastTimeout: 5000,
      });
      return false;
    } else if (this.txtPin == "") {
      this.toastr.errorToastr("Please Enter Pin", "Error !", {
        toastTimeout: 5000,
      });
      return false;
    } else {
      if (this.tempLocList.length > 0) {
        for (var i = 0; i < this.tempLocList.length; i++) {
          if (this.tempLocList[i].status == 1) {
            count++;
          }
        }
      }

      if (count < this.tempLocList.length) {
        this.toastr.errorToastr("Please Complete Check List", "Error !", {
          toastTimeout: 5000,
        });
        return false;
      }
      this.loadingBar = true;
      var saveData = {
        UserName: this.cookie.get("userName"),
        Pincode: this.txtPin,
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "pincode", saveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (param == "Complete") {
              this.saveCompleteLocation();
            } else {
              this.saveInCompleteLocation();
            }
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          }
        });
    }
  }

  saveCompleteLocation() {
    var saveData = {
      SpType: "COMPLETE", //string
      SubLocationID: this.locID,
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
            "Location Completed Successfully!",
            "Success!",
            {
              toastTimeout: 2500,
            }
          );
          // this.clear();
          this.getUserLocations();
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
    this.txtPin = "";
    this.locationCheckList = [];
  }

  saveInCompleteLocation() {
    var saveData = {
      SpType: "UNCOMPLETE", //string
      SubLocationID: this.locID,
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
            "Location InComplete Successfully!",
            "Success!",
            {
              toastTimeout: 2500,
            }
          );
          // this.clear();
          this.getUserLocations();
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
    this.txtPin = "";
    this.locationCheckList = [];
  }

  onFileSelected(event, item) {
    if (event.target.files[0].type == "application/pdf") {
      this.lblFileName = event.target.files[0].name;
      this.selectedFile = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.image = reader.result;

        var splitImg = this.image.split(",")[1];
        this.image = splitImg;
        this.showPdf = e.target.result;
        this.lblFileName = this.selectedFile.name;
        item.eFile = this.image;
      };

      reader.readAsDataURL(this.selectedFile);
    } else {
      this.toastr.errorToastr("Please Select PDF File", "Error", {
        toastTimeout: 2500,
      });

      this.image = undefined;
      // this.imgFile = undefined;
      this.selectedFile = null;
      // this.imageUrl = "";
    }
  }

  openPDFFile(item) {
    var url =
    // "http://192.168.100.162:7000/assets/Location/" +
    "http://125.209.107.137:7000/assets/Location/" +
      item.subLocCompletionID +
      ".pdf";
    window.open(url);
  }
}

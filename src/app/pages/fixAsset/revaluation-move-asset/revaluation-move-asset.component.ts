import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { AppComponent } from "../../../app.component";

declare var $: any;

@Component({
  selector: "app-revaluation-move-asset",
  templateUrl: "./revaluation-move-asset.component.html",
  styleUrls: ["./revaluation-move-asset.component.scss"],
})
export class RevaluationMoveAssetComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2007/api/";
  // serverUrl = "http://192.168.100.162:6090/api/";

  heading = "Add";

  loadingBar = true;
  showOfficeType = true;
  showComputer = true;
  showVehicle = true;

  lblAssetDetailID = 0;
  lblOfficeType = "";
  lblRevalComplete = 0;
  lblProject = "";
  lblUsable = "";
  lblComdemned = "";
  lblSurplus = "";
  lblAuctionable = "";
  lblImage1 = "";
  lblImage2 = "";
  lblImage3 = "";
  lblGeneration = "";
  lblProcessor = "";
  lblHardDrive1 = "";
  lblHardDrive2 = "";
  lblSize1 = "";
  lblSize2 = "";
  lblVehType = "";
  lblVehMake = "";
  lblVehModel = "";

  cmbLoc = "";
  cmbAccCat = "";
  txtPin = "";

  dtpDate;
  tblSearch = "";
  searchLocation = "";

  tempList = [];
  revalList = [];
  locList = [];
  accCatList = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.loadingBar = false;

    this.dtpDate = new Date();

    this.getSubLocationforRevaluator();
    this.getAccountsCatagoriesforRevaluator();
  }

  getSubLocationforRevaluator() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getSubLocationforRevaluator", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.locList = data;
        this.loadingBar = false;
      });
  }

  getAccountsCatagoriesforRevaluator() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getAccountsCatagoriesforRevaluator", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.accCatList = data;
        // this.loadingBar = false;
      });
  }

  showOffice() {
    this.revalList = [];

    this.showOfficeType = false;
    var officeType = this.locList.filter((x) => x.subLocID == this.cmbLoc);

    this.lblOfficeType = officeType[0].officeTypeDescription;
    this.lblRevalComplete = officeType[0].isRevaluationCompleted;
  }

  getMoveableAssetListforRevaluation(locID) {
    var oldDate = new Date(this.dtpDate);
    var m = oldDate.getMonth();
    var y = oldDate.getFullYear();
    var year;

    if (m >= 7) {
      year = y + "-" + (y + 1);
    } else if (m < 7) {
      year = y - 1 + "-" + y;
    }

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getMoveableAssetListforRevaluation?locID=" +
          locID,
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.tempList = data;
        this.revalList = data;
        this.loadingBar = false;
      });
  }
  filterTableData(accCat) {
    this.revalList = this.tempList;
    this.revalList = this.revalList.filter(
      (x) => x.accountsCatagory == this.cmbAccCat
    );
  }

  openReval() {
    // this.getMoveableAssetListforRevaluation(this.cmbLoc);
    // return;

    if (this.cmbLoc == "") {
      this.toastr.errorToastr("Please Select Location", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;

      var oldDate = new Date(this.dtpDate);
      var m = oldDate.getMonth();
      var y = oldDate.getFullYear();
      var year;

      if (m >= 7) {
        year = y + "-" + (y + 1);
      } else if (m < 7) {
        year = y - 1 + "-" + y;
      }

      var saveData = {
        SpType: "OPENREVALUATION", //string
        SubLocationID: this.cmbLoc,
        finYear: year,
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
            this.getMoveableAssetListforRevaluation(this.cmbLoc);

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

  superviseReval() {
    // this.getMoveableAssetListforRevaluation(this.cmbLoc);
    // return;

    if (this.cmbLoc == "") {
      this.toastr.errorToastr("Please Select Location", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;

      var oldDate = new Date(this.dtpDate);
      var m = oldDate.getMonth();
      var y = oldDate.getFullYear();
      var year;

      if (m >= 7) {
        year = y + "-" + (y + 1);
      } else if (m < 7) {
        year = y - 1 + "-" + y;
      }

      var saveData = {
        SpType: "SUPERVISEDREVALUATION", //string
        SubLocationID: this.cmbLoc,
        finYear: year,
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
            this.getMoveableAssetListforRevaluation(this.cmbLoc);

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

  completeReval() {
    // this.getMoveableAssetListforRevaluation(this.cmbLoc);
    // return;

    if (this.cmbLoc == "") {
      this.toastr.errorToastr("Please Select Location", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;

      var oldDate = new Date(this.dtpDate);
      var m = oldDate.getMonth();
      var y = oldDate.getFullYear();
      var year;

      if (m >= 7) {
        year = y + "-" + (y + 1);
      } else if (m < 7) {
        year = y - 1 + "-" + y;
      }

      var saveData = {
        SpType: "COMPLETEREVALUATION", //string
        SubLocationID: this.cmbLoc,
        finYear: year,
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
            this.getMoveableAssetListforRevaluation(this.cmbLoc);

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

  assetDetail(item) {
    this.clearDetail();
    $("#detailModal").modal("show");

    this.showVehicle = true;
    this.showComputer = true;

    if (item.accountsCatagory == "VEHICLES") {
      this.showVehicle = false;
    } else if (item.accountsCatagory == "COMPUTERS AND ACCESSORIES") {
      this.showComputer = false;
    }

    this.lblProject = item.projectShortName;
    if (item.isUseable == true) {
      this.lblUsable = "Yes";
    } else {
      this.lblUsable = "No";
    }
    if (item.isSurplus == true) {
      this.lblSurplus = "Yes";
    } else {
      this.lblSurplus = "No";
    }
    if (item.isCondemned == true) {
      this.lblComdemned = "Yes";
    } else {
      this.lblComdemned = "No";
    }
    // if(item.isAuctionable==true){
    //   this.lblAuctionable = "Yes";
    // }else{
    //   this.lblAuctionable = "No";
    // }
    if (
      item.eDoc != null ||
      item.eDoc != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
    ) {
      this.lblImage1 =
      // "http://192.168.100.162:7000/assets/assetEntryImg/" +
      "http://125.209.107.137:7000/assets/assetEntryImg/" +
        item.assetID +
        "_1.jpg";
    } else {
      this.lblImage1 = "../../../../../assets/assetEntryImg/dropHereImg.png";
    }

    if (
      item.eDoc2 != null ||
      item.eDoc2 != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
    ) {
      this.lblImage2 =
      // "http://192.168.100.162:7000/assets/assetEntryImg/" +
      "http://125.209.107.137:7000/assets/assetEntryImg/" +
        item.assetID +
        "_2.jpg";
    } else {
      this.lblImage2 = "../../../../../assets/assetEntryImg/dropHereImg.png";
    }

    if (
      item.eDoc3 != null ||
      item.eDoc3 != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
    ) {
      this.lblImage3 =
      // "http://192.168.100.162:7000/assets/assetEntryImg/" +
      "http://125.209.107.137:7000/assets/assetEntryImg/" +
        item.assetID +
        "_3.jpg";
    } else {
      this.lblImage3 = "../../../../../assets/assetEntryImg/dropHereImg.png";
    }

    this.lblGeneration = item.generation;
    this.lblProcessor = item.processor;
    this.lblHardDrive1 = item.driveType1;
    this.lblHardDrive2 = item.driveType1;
    this.lblSize1 = item.hD1;
    this.lblSize2 = item.hD2;
    this.lblVehType = item.vehType;
    this.lblVehMake = item.vehmake;
    this.lblVehModel = item.vehModel;
  }

  clearDetail() {
    this.showComputer = true;
    this.showVehicle = true;

    this.lblProject = "";
    this.lblUsable = "";
    this.lblComdemned = "";
    this.lblSurplus = "";
    this.lblAuctionable = "";
    this.lblImage1 = "";
    this.lblImage2 = "";
    this.lblImage3 = "";
    this.lblGeneration = "";
    this.lblProcessor = "";
    this.lblHardDrive1 = "";
    this.lblHardDrive2 = "";
    this.lblSize1 = "";
    this.lblSize2 = "";
    this.lblVehType = "";
    this.lblVehMake = "";
    this.lblVehModel = "";
  }

  save(item) {
    if (this.dtpDate == "" || this.dtpDate == undefined) {
      this.toastr.errorToastr("Please Select Date", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      item.revalAmount == null ||
      item.revalAmount == "" ||
      item.revalAmount == undefined
    ) {
      this.toastr.errorToastr("Please Enter Revaluation Amount", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var oldDate = new Date(this.dtpDate);
      var m = oldDate.getMonth();
      var y = oldDate.getFullYear();
      var year;

      if (m >= 7) {
        year = y + "-" + (y + 1);
      } else if (m < 7) {
        year = y - 1 + "-" + y;
      }

      var spType = "INSERT";
      if (this.lblAssetDetailID != 0) {
        spType = "UPDATE";
      }
      var saveData = {
        AssetID: item.assetID, //int
        revaluationAmount: parseFloat(item.revalAmount), //int
        year: y, //int
        finYear: year, //int
        userID: this.cookie.get("userID"), //int
        spType: spType, //string
        assetDetailID: this.lblAssetDetailID,
      };

      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
      });

      this.http
        .post(this.app.serverUrl + "sudAssetDetail", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.lblAssetDetailID == 0) {
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

            this.lblAssetDetailID = 0;
            this.getMoveableAssetListforRevaluation(this.cmbLoc);

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
  }

  edit(item) {
    item.lblAssetDetailID = item.assetDetailID;
    this.lblAssetDetailID = item.assetDetailID;
    item.revalAmount = item.revaluationAmount;
  }

  delete(item) {
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
            userID: this.cookie.get("userID"), //int
            spType: "DELETE", //string
            assetDetailID: item.assetDetailID,
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "sudAssetDetail", saveData, {
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

                this.getMoveableAssetListforRevaluation(item.subLocID);
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
      });
    }, 1000);
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
            this.superviseReval();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          }
        });
    }
  }
}

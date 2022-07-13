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
import { AppComponent } from "../../../app.component";

declare var $: any;

@Component({
  selector: "app-bridges",
  templateUrl: "./bridges.component.html",
  styleUrls: ["./bridges.component.scss"],
})
export class BridgesComponent implements OnInit {
  loadingBar = true;
  reqType = "";
  reqStatus = false;
  // serverUrl = "http://95.217.206.195:2007/api/";

  toggleView = "form";

  fixAccountsCatID = 13;
  fixAssetID = 0;
  accSecList = [];
  projectsList = [];
  projectsList2 = [];
  roadsList = [];
  landMeasurementList = [];
  bridgeDataList = [];
  faDetailList = [];

  oFaDetailList = [];
  aFaDetailList = [];
  ovFaDetailList = [];
  vFaDetailList = [];
  faSummaryList = [];
  odFaDetailList = [];
  dFaDetailList = [];

  transactionList = [];
  tempTransactionList = [];

  txtSearchBridgeData = "";

  ddlAccSec = "";
  txtSearchAccSec = "";
  ddlTrailBalance = "";
  txtSearchTrailBalance = "";
  ddlProject = "";
  txtSearchProject = "";
  ddlRoads = "";
  txtSearchRoads = "";
  ddlLandMeasurement = "";

  aKanal = "";
  aMarla = "";
  projectPackage = "";
  bridgeName = "";
  bridgeLength = "";
  nationalizationDate = new Date();
  cfDate = new Date();
  ctDate = new Date();
  constructionCost = "";
  landCost = "";
  remarks = "";

  lblOpeningCost = 0;
  lblAddition = 0;
  lblOpeningReval = 0;
  lblReval = 0;
  lblTransactions = 0;
  lblOpeningSurplus = 0;
  lblSurplus = 0;
  lblOpeningDepriciation = 0;
  lblDepriciation = 0;

  FaDetailID = 0;
  txtFaAmount = "";
  txtFaCost = "";
  txtFaDate = new Date();

  filePicker = "";
  selectedFile: File = null;
  file;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService,
    private toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.getAccSec();
    this.getProjects();
    this.getLandMeasurement();
    this.getRoads();
    this.getBridgeData();
    this.getFaDetail();
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    let reader = new FileReader();

    reader.onloadend = (e) => {
      this.file = reader.result;

      var splitFile = this.file.split(",")[1];
      this.file = splitFile;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  fileChange(fileNo) {
    var fileName = $(".custom-file-input").val().split("\\").pop();

    if (fileNo == 1) {
      $(".custom-file-input")
        .siblings(".custom-file-label")
        .addClass("selected")
        .html(fileName);
    }

    if (fileNo == 2) {
      $(".custom-file-input2")
        .siblings(".custom-file-label2")
        .addClass("selected")
        .html(fileName);
    }
  }

  saveExcel(fileNo) {
    if (this.filePicker == undefined) {
      this.toastr.errorToastr("Please select document", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var filePath = null;
      if (this.file != undefined) {
        filePath = this.filePicker;
      }

      var fileNameExt = this.filePicker.substr(
        this.filePicker.lastIndexOf(".") + 1
      );

      if (fileNameExt != "xlsx") {
        this.toastr.errorToastr("Please select excel file", "Error", {
          toastTimeout: 2500,
        });
        return false;
      }

      if (fileNo == 1) {
        $("#awardsModal").modal("toggle");
      } else if (fileNo == 2) {
        $("#mutationsModal").modal("toggle");
      }

      var fPath = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/files";

      // this.app.showSpinner();
      //* ********************************************save data
      var saveData = {
        FileNo: fileNo,
        ext: fileNameExt,
        File: this.file,
        FilePath: fPath,
      };

      //var token = localStorage.getItem(this.tokenKey);
      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

      this.loadingBar = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "uploadfile", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "File Uploaded Successfully") {
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500,
            });
            this.clearFaDetail();
            this.loadingBar = false;
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            this.loadingBar = false;
            return false;
          }
        });
    }
  }

  getAccSec() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getaccsec", { headers: reqHeader })
      .subscribe((data: any) => {
        this.accSecList = data;
        this.loadingBar = false;
      });
  }

  getProjects() {
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
        this.projectsList = data;
        this.projectsList2 = data;
        this.loadingBar = false;
      });
  }

  getRoads() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getroads", { headers: reqHeader })
      .subscribe((data: any) => {
        this.roadsList = data;
        this.loadingBar = false;
      });
  }

  getLandMeasurement() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getlandmeasurement", { headers: reqHeader })
      .subscribe((data: any) => {
        this.landMeasurementList = data;
        this.loadingBar = false;
      });
  }

  getBridgeData() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getbridgedata", { headers: reqHeader })
      .subscribe((data: any) => {
        this.bridgeDataList = data;
        this.loadingBar = false;
      });
  }

  getFaDetail() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getfadetail", { headers: reqHeader })
      .subscribe((data: any) => {
        this.faDetailList = data;
        this.getFaSummary();
      });
  }

  getFaSummary() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getfasummary", { headers: reqHeader })
      .subscribe((data: any) => {
        this.faSummaryList = data;
        this.getTransactions();
      });
  }

  getTransactions() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "gettransaction", { headers: reqHeader })
      .subscribe((data: any) => {
        this.transactionList = data;
        this.loadingBar = false;

        if (this.reqStatus == true) {
          this.filterFaDetail(this.fixAssetID, "oc");
          this.filterFaDetail(this.fixAssetID, "a");
          this.filterFaDetail(this.fixAssetID, "ov");
          this.filterFaDetail(this.fixAssetID, "v");
          this.filterFaDetail(this.fixAssetID, "t");
          this.filterFaDetail(this.fixAssetID, "td");
          this.filterFaDetail(this.fixAssetID, "od");
          this.filterFaDetail(this.fixAssetID, "d");

          this.reqStatus = false;
        }
      });
  }

  //main entery CRUD Operation
  save() {
    var aKanal, aMarla, bLength, cCost, lCost;

    if (this.aKanal == undefined || this.aKanal == "" || this.aKanal == null) {
      aKanal = 0;
    } else {
      aKanal = this.aKanal;
    }

    if (this.aMarla == undefined || this.aMarla == "" || this.aMarla == null) {
      aMarla = 0;
    } else {
      aMarla = this.aMarla;
    }

    if (
      this.bridgeLength == undefined ||
      this.bridgeLength == "" ||
      this.bridgeLength == null
    ) {
      bLength = 0;
    } else {
      bLength = this.bridgeLength;
    }

    if (
      this.constructionCost == undefined ||
      this.constructionCost == "" ||
      this.constructionCost == null
    ) {
      cCost = 0;
    } else {
      cCost = this.constructionCost;
    }

    if (
      this.landCost == undefined ||
      this.landCost == "" ||
      this.landCost == null
    ) {
      lCost = 0;
    } else {
      lCost = this.landCost;
    }

    if (this.ddlAccSec == undefined || this.ddlAccSec == "") {
      this.toastr.errorToastr("Please Select Account Section", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    }
    // else if (this.ddlTrailBalance == undefined || this.ddlTrailBalance == "") {
    //     this.toastr.errorToastr("Please Select Trail Balance", "Error !", {toastTimeout: 2500,});
    //     return false;
    // }
    else if (this.ddlProject == undefined || this.ddlProject == "") {
      this.toastr.errorToastr("Please Select Project", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.projectPackage == undefined ||
      this.projectPackage.trim() == ""
    ) {
      this.toastr.errorToastr("Please Enter Project Package", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.bridgeName == undefined || this.bridgeName == "") {
      this.toastr.errorToastr("Please Enter Bridge Name", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (bLength == 0) {
      this.toastr.errorToastr("Please Enter Bridge Length", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlRoads == undefined || this.ddlRoads == "") {
      this.toastr.errorToastr("Please Select Road", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.nationalizationDate == undefined ||
      this.nationalizationDate == null
    ) {
      this.toastr.errorToastr(
        "Please Enter Date of Nationalization",
        "Error !",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (this.cfDate == undefined || this.cfDate == null) {
      this.toastr.errorToastr(
        "Please Enter Date of Construction From",
        "Error !",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (this.ctDate == undefined || this.ctDate == null) {
      this.toastr.errorToastr(
        "Please Enter Date of Construction To",
        "Error !",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (
      this.ddlLandMeasurement == undefined ||
      this.ddlLandMeasurement == ""
    ) {
      this.toastr.errorToastr(
        "Please Select Area Accuired Measurement Unit",
        "Error !",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (aKanal == 0 && aMarla == 0) {
      this.toastr.errorToastr("Please Enter Area Acquired", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var reqRemarks = "-";
      if (this.remarks != undefined && this.remarks.trim() != "") {
        reqRemarks = this.remarks;
      }

      var natDate = this.app.convertDate(this.nationalizationDate);
      var cfDate = this.app.convertDate(this.cfDate);
      var ctDate = this.app.convertDate(this.ctDate);

      var reqSpType = "Insert";
      if (this.fixAssetID > 0) {
        reqSpType = "Update";
      }

      var SaveData = {
        AccountsCatID: this.fixAccountsCatID,
        FixedAssetID: this.fixAssetID,
        OfficeSecID: this.ddlAccSec,
        ProjectID: this.ddlProject,
        RoadId: this.ddlRoads,
        PackageName: this.projectPackage.trim(),
        BridgeName: this.bridgeName.trim(),
        BridgeLength: bLength,
        DateofNationalization: natDate,
        ConstructionFom: cfDate,
        ConstructionTo: ctDate,
        ConstructionCost: cCost,
        LandMeasureTypeID: this.ddlLandMeasurement,
        AreaAcquiredKanal: aKanal,
        AreaAcquiredMarla: aMarla,
        CostOfLand: lCost,
        Remarks: reqRemarks,
        Userid: this.cookie.get("userID"),
        SpType: reqSpType,
      };

      this.loadingBar = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudbridge", SaveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.fixAssetID == 0) {
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
            this.getBridgeData();
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
    this.fixAssetID = 0;
    this.ddlAccSec = "";
    this.ddlTrailBalance = "";
    this.ddlProject = "";
    this.ddlLandMeasurement = "";
    this.aKanal = "";
    this.aMarla = "";
    this.ddlRoads = "";
    this.projectPackage = "";
    this.bridgeName = "";
    this.bridgeLength = "";
    this.nationalizationDate = new Date();
    this.cfDate = new Date();
    this.ctDate = new Date();
    this.constructionCost = "";
    this.landCost = "";
    this.remarks = "";
    this.txtSearchBridgeData = "";

    this.lblOpeningCost = 0;
    this.lblAddition = 0;
    this.lblOpeningReval = 0;
    this.lblReval = 0;
    this.lblTransactions = 0;
    this.lblSurplus = 0;
    this.lblOpeningSurplus = 0;
    this.lblOpeningDepriciation = 0;
    this.lblDepriciation = 0;

    this.oFaDetailList = [];
    this.aFaDetailList = [];
    this.ovFaDetailList = [];
    this.vFaDetailList = [];
    this.tempTransactionList = [];
  }

  edit(item) {
    this.fixAssetID = item.fixedAssetID;
    this.ddlAccSec = item.officeSecID.toString();
    this.ddlTrailBalance = item.projectID.toString();
    this.ddlProject = item.projectID.toString();
    this.projectPackage = item.packageName;
    this.bridgeName = item.bridgeName;
    this.bridgeLength = item.bridgeLength;
    this.ddlRoads = item.roadId.toString();
    this.ddlLandMeasurement = item.landMeasureTypeID.toString();
    this.aKanal = item.areaAcquiredKanal;
    this.aMarla = item.areaAcquiredMarla;
    this.nationalizationDate = new Date(item.dateofNationalization);
    this.cfDate = new Date(item.constructionFom);
    this.ctDate = new Date(item.constructionTo);
    this.constructionCost = item.constructionCost;
    this.landCost = item.costOfLand;
    this.remarks = item.remarks;

    this.toggleView = "form";

    this.filterFaDetail(item.fixedAssetID, "oc");
    this.filterFaDetail(item.fixedAssetID, "a");
    this.filterFaDetail(item.fixedAssetID, "ov");
    this.filterFaDetail(item.fixedAssetID, "v");
    this.filterFaDetail(item.fixedAssetID, "t");
    this.filterFaDetail(item.fixedAssetID, "td");
    this.filterFaDetail(item.fixedAssetID, "od");
    this.filterFaDetail(item.fixedAssetID, "d");
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

          var SaveData = {
            FixedAssetID: item.fixedAssetID,
            Userid: this.cookie.get("userID"),
            SpType: "Delete",
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "sudland", SaveData, {
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
                this.getBridgeData();
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

  //
  saveOC() {
    if (
      this.txtFaAmount == undefined ||
      this.txtFaAmount == "" ||
      parseFloat(this.txtFaAmount) <= 0
    ) {
      this.toastr.errorToastr("Please Enter Opening Cost", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtFaDate == undefined || this.txtFaDate == null) {
      this.toastr.errorToastr("Please Enter Date", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.fixAssetID == 0) {
      this.toastr.errorToastr("Please Enter Complete Information", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var reqDate = this.app.convertDate(this.txtFaDate);

      var reqSpType = "Insert";
      if (this.FaDetailID > 0) {
        reqSpType = "Update";
      }

      var SaveData = {
        FixedAssetID: this.fixAssetID,
        TypeofEntry: "Cost",
        OpeningCost: this.txtFaAmount,
        Year: reqDate,
        FAdetailID: this.FaDetailID,
        Userid: this.cookie.get("userID"),
        SpType: reqSpType,
      };

      $("#additionOpeningModal").modal("toggle");

      this.loadingBar = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudoc", SaveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.FaDetailID == 0) {
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

            this.clearFaDetail();
            this.reqStatus = true;
            this.getFaDetail();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            this.loadingBar = false;
            $("#additionOpeningModal").modal("toggle");
            return false;
          }
        });
    }
  }

  editOC(item) {
    this.FaDetailID = item.faDetailID;
    this.txtFaAmount = item.openingCost;
    this.txtFaDate = new Date(item.year);
  }

  saveAD() {
    if (this.txtFaAmount == "") {
      this.txtFaAmount = "0";
    }

    if (this.txtFaCost == "") {
      this.txtFaCost = "0";
    }

    if (this.txtFaAmount == undefined || parseFloat(this.txtFaAmount) < 0) {
      this.toastr.errorToastr("Please Enter Addition In Cost", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtFaCost == undefined || parseFloat(this.txtFaCost) < 0) {
      this.toastr.errorToastr("Please Enter Disposal In Cost", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      parseFloat(this.txtFaAmount) == 0 &&
      parseFloat(this.txtFaCost) == 0
    ) {
      this.toastr.errorToastr(
        "Please Enter Addition In Cost / Disposal In Cost",
        "Error !",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (this.txtFaDate == undefined || this.txtFaDate == null) {
      this.toastr.errorToastr("Please Enter Date", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.fixAssetID == 0) {
      this.toastr.errorToastr("Please Enter Complete Information", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var reqDate = this.app.convertDate(this.txtFaDate);

      var reqFaAmount = parseFloat(this.txtFaAmount);
      if (this.txtFaAmount == "") {
        reqFaAmount = 0;
      }

      var reqFaCost = parseFloat(this.txtFaCost);
      if (this.txtFaCost == "") {
        reqFaCost = 0;
      }

      var reqSpType = "Insert";
      if (this.FaDetailID > 0) {
        reqSpType = "Update";
      }

      var SaveData = {
        FixedAssetID: this.fixAssetID,
        TypeofEntry: "Cost",
        AdditioninCost: reqFaAmount,
        DisposalinCost: reqFaCost,
        Year: reqDate,
        FAdetailID: this.FaDetailID,
        Userid: this.cookie.get("userID"),
        SpType: reqSpType,
      };

      $("#additionsAdditionModal").modal("toggle");

      this.loadingBar = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudoc", SaveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.FaDetailID == 0) {
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

            this.clearFaDetail();
            this.reqStatus = true;
            this.getFaDetail();
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

  editAD(item) {
    this.FaDetailID = item.faDetailID;
    this.txtFaAmount = item.additioninCost;
    this.txtFaCost = item.disposalinCost;
    this.txtFaDate = new Date(item.year);
  }

  saveOV() {
    if (this.txtFaAmount == "") {
      this.txtFaAmount = "0";
    }

    if (this.txtFaCost == "") {
      this.txtFaCost = "0";
    }

    if (this.txtFaAmount == undefined || parseFloat(this.txtFaAmount) < 0) {
      this.toastr.errorToastr("Please Enter Opening Cost", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtFaCost == undefined || parseFloat(this.txtFaCost) < 0) {
      this.toastr.errorToastr("Please Enter Surplus Cost", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      parseFloat(this.txtFaAmount) == 0 &&
      parseFloat(this.txtFaCost) == 0
    ) {
      this.toastr.errorToastr(
        "Please Enter Opening Cost / Surplus",
        "Error !",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (this.txtFaDate == undefined || this.txtFaDate == null) {
      this.toastr.errorToastr("Please Enter Date", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.fixAssetID == 0) {
      this.toastr.errorToastr("Please Enter Complete Information", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var reqDate = this.app.convertDate(this.txtFaDate);

      var reqFaAmount = parseFloat(this.txtFaAmount);
      if (this.txtFaAmount == "") {
        reqFaAmount = 0;
      }

      var reqFaCost = parseFloat(this.txtFaCost);
      if (this.txtFaCost == "") {
        reqFaCost = 0;
      }

      var reqSpType = "Insert";
      if (this.FaDetailID > 0) {
        reqSpType = "Update";
      }

      var SaveData = {
        FixedAssetID: this.fixAssetID,
        TypeofEntry: "Revalued",
        OpeningRevaluationAmount: reqFaAmount,
        OpeningRevaluationSurplus: reqFaCost,
        Year: reqDate,
        FAdetailID: this.FaDetailID,
        Userid: this.cookie.get("userID"),
        SpType: reqSpType,
      };

      $("#revaluationsOpeningModal").modal("toggle");

      this.loadingBar = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudoc", SaveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.FaDetailID == 0) {
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

            this.clearFaDetail();
            this.reqStatus = true;
            this.getFaDetail();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            this.loadingBar = false;
            $("#revaluationsOpeningModal").modal("toggle");
            return false;
          }
        });
    }
  }

  editOV(item) {
    this.FaDetailID = item.faDetailID;
    this.txtFaAmount = item.openingRevaluationAmount;
    this.txtFaCost = item.openingRevaluationSurplus;
    this.txtFaDate = new Date(item.year);
  }

  saveRV() {
    if (this.txtFaAmount == "") {
      this.txtFaAmount = "0";
    }

    if (this.txtFaCost == "") {
      this.txtFaCost = "0";
    }

    if (this.txtFaAmount == undefined || parseFloat(this.txtFaAmount) < 0) {
      this.toastr.errorToastr("Please Enter Revaluation Amount", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtFaCost == undefined || parseFloat(this.txtFaCost) < 0) {
      this.toastr.errorToastr("Please Enter Revaluation Surplus", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      parseFloat(this.txtFaAmount) == 0 &&
      parseFloat(this.txtFaCost) == 0
    ) {
      this.toastr.errorToastr(
        "Please Enter Revaluation Amount / Revaluation Surplus",
        "Error !",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (this.txtFaDate == undefined || this.txtFaDate == null) {
      this.toastr.errorToastr("Please Enter Date", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.filePicker == undefined) {
      this.toastr.errorToastr("Please Select Document", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.fixAssetID == 0) {
      this.toastr.errorToastr("Please Enter Complete Information", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var filePath = null;
      if (this.file != undefined) {
        filePath = this.filePicker;
      }

      var fileNameExt = this.filePicker.substr(
        this.filePicker.lastIndexOf(".") + 1
      );

      if (fileNameExt != "pdf") {
        this.toastr.errorToastr("Please Select PDF File", "Error", {
          toastTimeout: 2500,
        });
        return false;
      }

      var reqDate = this.app.convertDate(this.txtFaDate);

      var reqFaAmount = parseFloat(this.txtFaAmount);
      if (this.txtFaAmount == "") {
        reqFaAmount = 0;
      }

      var reqFaCost = parseFloat(this.txtFaCost);
      if (this.txtFaCost == "") {
        reqFaCost = 0;
      }

      var reqSpType = "Insert";
      if (this.FaDetailID > 0) {
        reqSpType = "Update";
      }

      var fPath = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/files";

      var SaveData = {
        FixedAssetID: this.fixAssetID,
        TypeofEntry: "Revalued",
        revaluationAmount: reqFaAmount,
        revalutionSurplus: reqFaCost,
        Year: reqDate,
        FAdetailID: this.FaDetailID,
        File: this.file,
        FilePath: fPath,
        Userid: this.cookie.get("userID"),
        SpType: reqSpType,
      };

      $("#revaluationRevaluationsModal").modal("toggle");

      this.loadingBar = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudoc", SaveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.FaDetailID == 0) {
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

            this.clearFaDetail();
            this.reqStatus = true;
            this.getFaDetail();
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

  editRV(item) {
    this.FaDetailID = item.faDetailID;
    this.txtFaAmount = item.revaluationAmount;
    this.txtFaCost = item.revalutionSurplus;
    this.txtFaDate = new Date(item.year);
  }

  saveOD() {
    if (
      this.txtFaAmount == undefined ||
      this.txtFaAmount == "" ||
      parseFloat(this.txtFaAmount) <= 0
    ) {
      this.toastr.errorToastr("Please Enter Opening Cost", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtFaDate == undefined || this.txtFaDate == null) {
      this.toastr.errorToastr("Please Enter Date", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.fixAssetID == 0) {
      this.toastr.errorToastr("Please Enter Complete Information", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var reqDate = this.app.convertDate(this.txtFaDate);

      var reqSpType = "Insert";
      if (this.FaDetailID > 0) {
        reqSpType = "Update";
      }

      var SaveData = {
        FixedAssetID: this.fixAssetID,
        TypeofEntry: "Depreciation",
        OpeningDepreciation: this.txtFaAmount,
        Year: reqDate,
        FAdetailID: this.FaDetailID,
        Userid: this.cookie.get("userID"),
        SpType: reqSpType,
      };

      $("#depriciationsOpeningModal").modal("toggle");

      this.loadingBar = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudoc", SaveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.FaDetailID == 0) {
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

            this.clearFaDetail();
            this.reqStatus = true;
            this.getFaDetail();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            this.loadingBar = false;
            $("#depriciationsOpeningModal").modal("toggle");
            return false;
          }
        });
    }
  }

  editOD(item) {
    this.FaDetailID = item.faDetailID;
    this.txtFaAmount = item.openingDepreciation;
    this.txtFaDate = new Date(item.year);
  }

  saveD() {
    if (this.txtFaAmount == "") {
      this.txtFaAmount = "0";
    }

    if (this.txtFaCost == "") {
      this.txtFaCost = "0";
    }

    if (this.txtFaAmount == undefined || parseFloat(this.txtFaAmount) < 0) {
      this.toastr.errorToastr("Please Enter Depriciation Amount", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtFaCost == undefined || parseFloat(this.txtFaCost) < 0) {
      this.toastr.errorToastr("Please Enter Disposal In Amount", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      parseFloat(this.txtFaAmount) == 0 &&
      parseFloat(this.txtFaCost) == 0
    ) {
      this.toastr.errorToastr(
        "Please Enter Depriciation Amount / Disposal In Amount",
        "Error !",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (this.txtFaDate == undefined || this.txtFaDate == null) {
      this.toastr.errorToastr("Please Enter Date", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.fixAssetID == 0) {
      this.toastr.errorToastr("Please Enter Complete Information", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var reqDate = this.app.convertDate(this.txtFaDate);

      var reqFaAmount = parseFloat(this.txtFaAmount);
      if (this.txtFaAmount == "") {
        reqFaAmount = 0;
      }

      var reqFaCost = parseFloat(this.txtFaCost);
      if (this.txtFaCost == "") {
        reqFaCost = 0;
      }

      var reqSpType = "Insert";
      if (this.FaDetailID > 0) {
        reqSpType = "Update";
      }

      var SaveData = {
        FixedAssetID: this.fixAssetID,
        TypeofEntry: "Depreciation",
        DepreciationforYear: reqFaAmount,
        DisposalinDepreciation: reqFaCost,
        Year: reqDate,
        FAdetailID: this.FaDetailID,
        Userid: this.cookie.get("userID"),
        SpType: reqSpType,
      };

      $("#depriciationsDepriciationModal").modal("toggle");

      this.loadingBar = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudoc", SaveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.FaDetailID == 0) {
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

            this.clearFaDetail();
            this.reqStatus = true;
            this.getFaDetail();
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

  editD(item) {
    this.FaDetailID = item.faDetailID;
    this.txtFaAmount = item.depreciationforYear;
    this.txtFaCost = item.disposalinDepreciation;
    this.txtFaDate = new Date(item.year);
  }

  deleteFA(item, type) {
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
          var SaveData = {
            FaDetailID: item.faDetailID,
            Userid: this.cookie.get("userID"),
            SpType: "Delete",
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          if (type == "o") {
            $("#additionOpeningModal").modal("toggle");
          } else if (type == "a") {
            $("#additionsAdditionModal").modal("toggle");
          } else if (type == "ov") {
            $("#revaluationsOpeningModal").modal("toggle");
          } else if (type == "v") {
            $("#revaluationRevaluationsModal").modal("toggle");
          } else if (type == "od") {
            $("#depriciationsOpeningModal").modal("toggle");
          } else if (type == "d") {
            $("#depriciationsDepriciationModal").modal("toggle");
          }

          this.loadingBar = true;
          this.http
            .post(this.app.serverUrl + "sudoc", SaveData, {
              headers: reqHeader,
            })
            .subscribe((data: any) => {
              if (data.msg == "Success") {
                this.toastr.successToastr(
                  "Record Deleted Successfully!",
                  "Success!",
                  { toastTimeout: 2500 }
                );
                this.clearFaDetail();
                this.reqStatus = true;
                this.getFaDetail();
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

  clearFaDetail() {
    this.FaDetailID = 0;
    this.txtFaAmount = "";
    this.txtFaCost = "";
    this.txtFaDate = new Date();

    this.filePicker = "";
    this.filePicker = undefined;
    this.file = undefined;
    this.selectedFile = null;

    var fileName = "Choose XLSX file";
    $(".custom-file-input")
      .siblings(".custom-file-label")
      .addClass("selected")
      .html(fileName);
  }

  filterProject(reqProjectID, filterBy) {
    if (filterBy == "") {
      this.ddlProject = "";
      var tempList = this.projectsList.filter(
        (x) => x.projectID == reqProjectID && x.accountCode > 0
      );
      if (tempList.length > 0) {
        this.ddlProject = this.ddlTrailBalance;
      }
    } else {
      this.ddlTrailBalance = this.ddlProject;
    }
  }

  filterFaDetail(reqFixAssetID, filterBy) {
    if (filterBy == "oc") {
      this.oFaDetailList = [];
      var tempList = this.faDetailList.filter(
        (x) => x.fixedAssetID == reqFixAssetID && x.openingCost != 0
      );

      if (tempList.length > 0) {
        this.oFaDetailList = tempList;
      }
    }

    if (filterBy == "a") {
      this.aFaDetailList = [];
      var tempList = this.faDetailList.filter(
        (x) =>
          x.fixedAssetID == reqFixAssetID &&
          (x.additioninCost != 0 || x.disposalinCost != 0)
      );

      if (tempList.length > 0) {
        this.aFaDetailList = tempList;
      }
    }

    if (filterBy == "ov") {
      this.ovFaDetailList = [];
      var tempList = this.faDetailList.filter(
        (x) =>
          x.fixedAssetID == reqFixAssetID && x.openingRevaluationAmount != 0
      );

      if (tempList.length > 0) {
        this.ovFaDetailList = tempList;
      }
    }

    if (filterBy == "v") {
      this.vFaDetailList = [];
      var tempList = this.faDetailList.filter(
        (x) => x.fixedAssetID == reqFixAssetID && x.revaluationAmount != 0
      );

      if (tempList.length > 0) {
        this.vFaDetailList = tempList;
      }
    }

    if (filterBy == "t") {
      this.lblOpeningCost = 0;
      this.lblAddition = 0;
      this.lblOpeningReval = 0;
      this.lblReval = 0;
      this.lblTransactions = 0;
      this.lblSurplus = 0;

      var tempList = this.faSummaryList.filter(
        (x) => x.fixedAssetID == reqFixAssetID
      );

      if (tempList.length > 0) {
        this.lblOpeningCost = tempList[0].openingCost;
        this.lblAddition =
          tempList[0].additioninCost + tempList[0].disposalinCost;
        this.lblOpeningReval = tempList[0].openingRevaluationAmount;
        this.lblReval = tempList[0].revaluationAmount;
        this.lblTransactions = tempList[0].nooftransactions;
        this.lblSurplus = tempList[0].revalutionSurplus;
        this.lblOpeningSurplus = tempList[0].openingRevaluationSurplus;
        this.lblOpeningDepriciation = tempList[0].openingDepreciation;
        this.lblDepriciation =
          tempList[0].depreciationforYear + tempList[0].disposalinDepreciation;
      }
    }

    if (filterBy == "td") {
      this.tempTransactionList = [];
      var tempList = this.transactionList.filter(
        (x) => x.fixedAssetID == reqFixAssetID
      );

      if (tempList.length > 0) {
        this.tempTransactionList = tempList;
      }
    }

    if (filterBy == "od") {
      this.odFaDetailList = [];
      var tempList = this.faDetailList.filter(
        (x) => x.fixedAssetID == reqFixAssetID && x.openingDepreciation != 0
      );

      if (tempList.length > 0) {
        this.odFaDetailList = tempList;
      }
    }

    if (filterBy == "d") {
      this.dFaDetailList = [];
      var tempList = this.faDetailList.filter(
        (x) => x.fixedAssetID == reqFixAssetID && x.depreciationforYear != 0
      );

      if (tempList.length > 0) {
        this.dFaDetailList = tempList;
      }
    }
  }
}

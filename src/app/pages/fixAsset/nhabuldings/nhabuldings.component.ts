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
import { AppComponent } from "../../../app.component";

declare var $: any;

@Component({
  selector: "app-nhabuldings",
  templateUrl: "./nhabuldings.component.html",
  styleUrls: ["./nhabuldings.component.scss"],
})
export class NhabuldingsComponent implements OnInit {
  toggleView = "form";
  // serverUrl = "http://95.217.206.195:2007/api/";
  // serverUrl = "http://192.168.100.162:5090/api/";

  loadingBar = true;
  reqStatus = false;
  disableField = true;

  ddlAccSec = "";
  ddlTrailBalance = "";
  ddlProject = "";
  ddlBuilding = "";
  ddlLandMeasurement = "";

  lblOpeningCost = 0;
  lblAddition = 0;
  lblOpeningDep = 0;
  lblDepriciation = 0;
  lblOpeningReval = 0;
  lblReval = 0;
  lblTransactions = 0;
  lblSurplus = 0;
  lblOpeningSurplus = 0;
  lblFixAssetID = 0;
  lblAccCatID = 14;
  FaDetailID = 0;

  txtFaAmount = "";
  txtFaCost = "";
  txtProPackage = "";
  txtDescription = "";
  txtAddress = "";
  txtAKanal = "";
  txtTKanal = "";
  txtAMarla = "";
  txtTMarla = "";
  txtRemarks = "";
  txtSurplus = "";

  txtConstCost = "";
  txtLandCost = "";

  dtpPurchase = new Date();
  dtpConstFrom = new Date();
  dtpConstTo = new Date();
  dtpFaDate = new Date();

  txtSearch = "";
  txtSearchAccSec = "";
  txtSearchTrailBalance = "";
  txtSearchProject = "";
  txtSearchBuilding = "";

  buildDetailList = [];
  buildingList = [];
  accSecList = [];
  projectsList = [];
  roadsList = [];
  landMeasurementList = [];
  faSummaryList = [];
  faDetailList = [];
  transactionList = [];
  oFaDetailList = [];
  aFaDetailList = [];
  ovFaDetailList = [];
  vFaDetailList = [];
  odFaDetailList = [];
  dFaDetailList = [];
  tempTransactionList = [];

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
    this.getBuildingDetail();
    this.getAccSec();
    this.getBuilding();
    this.getProjects();
    this.getLandMeasurement();
    this.getFaDetail();
  }

  onFileSelected(event) {
    if (event.target.files[0].type == "application/pdf") {
      this.selectedFile = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e) => {
        this.file = reader.result;

        var splitFile = this.file.split(",")[1];
        this.file = splitFile;
      };

      reader.readAsDataURL(this.selectedFile);
    } else {
      this.toastr.errorToastr("Please Select PDF File", "Error", {
        toastTimeout: 2500,
      });

      this.filePicker = "";
      this.filePicker = undefined;
      this.file = undefined;
      this.selectedFile = null;
    }
  }

  getBuildingDetail() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getBuildingDetail", { headers: reqHeader })
      .subscribe((data: any) => {
        this.buildDetailList = data;
        this.loadingBar = false;
      });
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
        // this.projectsList2 = data;
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
        // alert(this.faDetailList.length);
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
        // alert(this.faSummaryList.length);
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
        // alert(this.transactionList.length);
        this.loadingBar = false;

        if (this.reqStatus == true) {
          this.filterFaDetail(this.lblFixAssetID, "oc");
          this.filterFaDetail(this.lblFixAssetID, "a");
          this.filterFaDetail(this.lblFixAssetID, "od");
          this.filterFaDetail(this.lblFixAssetID, "d");
          this.filterFaDetail(this.lblFixAssetID, "ov");
          this.filterFaDetail(this.lblFixAssetID, "v");
          this.filterFaDetail(this.lblFixAssetID, "t");
          this.filterFaDetail(this.lblFixAssetID, "td");

          this.reqStatus = false;
        }
      });
  }

  filterFaDetail(reqFixAssetID, filterBy) {
    // alert(this.faDetailList.length);
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
        (x) =>
          x.fixedAssetID == reqFixAssetID &&
          (x.depreciationforYear != 0 || x.disposalinDepreciation != 0)
      );

      if (tempList.length > 0) {
        this.dFaDetailList = tempList;
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
      this.lblOpeningDep = 0;
      this.lblDepriciation = 0;
      this.lblOpeningReval = 0;
      this.lblReval = 0;
      this.lblTransactions = 0;
      this.lblOpeningSurplus = 0;
      this.lblSurplus = 0;

      var tempList = this.faSummaryList.filter(
        (x) => x.fixedAssetID == reqFixAssetID
      );

      if (tempList.length > 0) {
        this.lblOpeningCost = tempList[0].openingCost;
        this.lblAddition =
          tempList[0].additioninCost + tempList[0].disposalinCost;
        this.lblOpeningDep = tempList[0].openingDepreciation;
        this.lblDepriciation =
          tempList[0].depreciationforYear + tempList[0].disposalinDepreciation;
        this.lblOpeningReval = tempList[0].openingRevaluationAmount;
        this.lblReval = tempList[0].revaluationAmount;
        this.lblTransactions = tempList[0].nooftransactions;
        this.lblSurplus = tempList[0].revalutionSurplus;
        this.lblOpeningSurplus = tempList[0].openingRevaluationSurplus;
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
  }

  filterProject(reqBuildID) {
    var tempList = this.buildingList.filter((x) => x.buildingId == reqBuildID);

    this.txtDescription = tempList[0].buildingDescription;
    this.txtAddress = tempList[0].buildingAddress;
    this.ddlTrailBalance = tempList[0].projectID.toString();

    var projID = this.projectsList.filter(
      (x) => x.projectID == tempList[0].projectID && x.accountCode > 0
    );
    if (projID.length > 0) {
      this.ddlProject = projID[0].projectID.toString();
    }
    // this.ddlProject = tempList[0].projectID.toString();

    // alert(this.ddlProject);
  }

  //main entery CRUD Operation
  save() {
    // alert(this.ddlProject);
    var aKanal, aMarla, tKanal, tMarla;

    if (
      this.txtAKanal == undefined ||
      this.txtAKanal == "" ||
      this.txtAKanal == null
    ) {
      aKanal = 0;
    } else {
      aKanal = this.txtAKanal;
    }

    if (
      this.txtAMarla == undefined ||
      this.txtAMarla == "" ||
      this.txtAMarla == null
    ) {
      aMarla = 0;
    } else {
      aMarla = this.txtAMarla;
    }

    if (
      this.txtTKanal == undefined ||
      this.txtTKanal == "" ||
      this.txtTKanal == null
    ) {
      tKanal = 0;
    } else {
      tKanal = this.txtTKanal;
    }

    if (
      this.txtTMarla == undefined ||
      this.txtTMarla == "" ||
      this.txtTMarla == null
    ) {
      tMarla = 0;
    } else {
      tMarla = this.txtTMarla;
    }

    if (this.ddlAccSec == undefined || this.ddlAccSec == "") {
      this.toastr.errorToastr("Please Select Account Section", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlBuilding == undefined || this.ddlBuilding == "") {
      this.toastr.errorToastr("Please Select Building", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.ddlTrailBalance == undefined ||
      this.ddlTrailBalance == ""
    ) {
      this.toastr.errorToastr("Please Select Trail Balance", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlProject == undefined || this.ddlProject == "") {
      this.toastr.errorToastr("Please Select Project", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.ddlLandMeasurement == undefined ||
      this.ddlLandMeasurement == ""
    ) {
      this.toastr.errorToastr(
        "Please Select Area of Measurement Unit",
        "Error !",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (aKanal == 0 && aMarla == 0) {
      this.toastr.errorToastr("Please Enter Area of Plot", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (tKanal == 0 && tMarla == 0) {
      this.toastr.errorToastr("Please Enter Covered Area", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.dtpPurchase == undefined || this.dtpPurchase == null) {
      this.toastr.errorToastr(
        "Please Select Date of Nationalization",
        "Error !",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (this.dtpConstFrom == undefined || this.dtpConstFrom == null) {
      this.toastr.errorToastr("Please Select Construction From", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.dtpConstTo == undefined || this.dtpConstTo == null) {
      this.toastr.errorToastr("Please Select Construction To", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var reqRemarks = "-";
      if (this.txtRemarks == undefined && this.txtRemarks.trim() == "") {
        reqRemarks = this.txtRemarks;
      }

      var dtpPurchase = this.app.convertDate(this.dtpPurchase);
      var dtConstFrom = this.app.convertDate(this.dtpConstFrom);
      var dtConstTo = this.app.convertDate(this.dtpConstTo);

      var reqSpType = "Insert";
      if (this.lblFixAssetID > 0) {
        reqSpType = "Update";
      }

      var landCost, consCost;
      if (this.txtLandCost == "") {
        landCost = 0;
      } else {
        landCost = parseInt(this.txtLandCost);
      }

      if (this.txtConstCost == "") {
        consCost = 0;
      } else {
        consCost = parseInt(this.txtConstCost);
      }

      debugger;
      var SaveData = {
        AccountsCatID: this.lblAccCatID,
        FixedAssetID: this.lblFixAssetID,
        OfficeSecID: parseInt(this.ddlAccSec),
        ProjectID: parseInt(this.ddlProject),
        BuildingID: parseInt(this.ddlBuilding),
        // PackageName: this.txtProPackage,
        DateofNationalization: dtpPurchase,
        ConstructionFrom: dtConstFrom,
        ConstructionTo: dtConstTo,
        ConstructionCost: consCost,
        LandMeasureTypeID: this.ddlLandMeasurement,
        AreaAcquiredKanal: aKanal,
        AreaAcquiredMarla: aMarla,
        AreaTransferedKanal: tKanal,
        AreaTransferedMarla: tMarla,
        CostOfLand: landCost,
        Remarks: reqRemarks,
        Userid: this.cookie.get("userID"),
        SpType: reqSpType,
      };

      this.loadingBar = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudBuilding", SaveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.lblFixAssetID == 0) {
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
            this.getBuildingDetail();
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
    this.toggleView = "form";

    this.lblFixAssetID = obj.fixedAssetID;
    this.ddlAccSec = obj.officeSecID.toString();
    this.ddlBuilding = obj.buildingID;
    this.ddlTrailBalance = obj.projectID.toString();
    var projID = this.projectsList.filter(
      (x) => x.projectID == obj.projectID && x.accountCode > 0
    );
    if (projID.length > 0) {
      this.ddlProject = projID[0].projectID.toString();
    }
    this.ddlLandMeasurement = obj.landMeasureTypeID.toString();
    if (obj.constructionFom != null) {
      this.dtpConstFrom = new Date(obj.constructionFom);
    }
    if (obj.constructionTo != null) {
      this.dtpConstTo = new Date(obj.constructionTo);
    }
    if (obj.dateofNationalization != null) {
      this.dtpPurchase = new Date(obj.dateofNationalization);
    }
    this.txtAKanal = obj.areaAcquiredKanal;
    this.txtAMarla = obj.areaAcquiredMarla;
    this.txtTKanal = obj.areaTransferedKanal;
    this.txtTMarla = obj.areaTransferedMarla;
    this.txtRemarks = obj.remarks;
    this.txtDescription = obj.buildingDescription;
    this.txtAddress = obj.buildingAddress;
    this.txtConstCost = obj.constructionCost;
    this.txtLandCost = obj.costofLand;

    this.filterFaDetail(obj.fixedAssetID, "oc");
    this.filterFaDetail(obj.fixedAssetID, "a");
    this.filterFaDetail(obj.fixedAssetID, "od");
    this.filterFaDetail(obj.fixedAssetID, "d");
    this.filterFaDetail(obj.fixedAssetID, "ov");
    this.filterFaDetail(obj.fixedAssetID, "v");
    this.filterFaDetail(obj.fixedAssetID, "t");
    this.filterFaDetail(obj.fixedAssetID, "td");
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

          var SaveData = {
            FixedAssetID: obj.fixedAssetID,
            Userid: this.cookie.get("userID"),
            SpType: "Delete",
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "sudBuilding", SaveData, {
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
                this.getBuildingDetail();
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

  //Modal Window Crud Operations
  saveOC() {
    if (
      this.txtFaAmount == undefined ||
      this.txtFaAmount == "" ||
      parseFloat(this.txtFaAmount) <= 0
    ) {
      this.toastr.errorToastr("Please Enter Opening Amount", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.dtpFaDate == undefined || this.dtpFaDate == null) {
      this.toastr.errorToastr("Please Enter Date", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.lblFixAssetID == 0) {
      this.toastr.errorToastr("Please Enter Complete Information", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var reqDate = this.app.convertDate(this.dtpFaDate);

      // alert(reqDate);
      var reqSpType = "Insert";
      if (this.FaDetailID > 0) {
        reqSpType = "Update";
      }

      var SaveData = {
        FixedAssetID: this.lblFixAssetID,
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

  editOC(obj) {
    this.FaDetailID = obj.faDetailID;
    this.txtFaAmount = obj.openingCost;
    this.dtpFaDate = new Date(obj.year);
  }

  saveAD() {
    if (this.txtFaAmount == "") {
      this.txtFaAmount = "0";
    }

    if (this.txtFaCost == "") {
      this.txtFaCost = "0";
    }

    // if (this.txtFaAmount == undefined || parseFloat(this.txtFaAmount) <= 0) {
    //   this.toastr.errorToastr("Please Enter Addition In Cost", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    // } else if (this.txtFaCost == undefined || parseFloat(this.txtFaCost) <= 0) {
    //   this.toastr.errorToastr("Please Enter Disposal In Cost", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    // } else
    if (parseFloat(this.txtFaAmount) == 0 && parseFloat(this.txtFaCost) == 0) {
      this.toastr.errorToastr("Please Enter Addition In Cost", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.dtpFaDate == undefined || this.dtpFaDate == null) {
      this.toastr.errorToastr("Please Enter Date", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.lblFixAssetID == 0) {
      this.toastr.errorToastr("Please Enter Complete Information", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      //var reqDate = this.app.convertDate(this.acquisitionDate);
      var reqFaAmount = parseFloat(this.txtFaAmount);
      if (this.txtFaAmount == "") {
        reqFaAmount = 0;
      }

      var reqFaCost = parseFloat(this.txtFaCost);
      if (this.txtFaCost == "") {
        reqFaCost = 0;
      }

      var reqDate = this.app.convertDate(this.dtpFaDate);

      var reqSpType = "Insert";
      if (this.FaDetailID > 0) {
        reqSpType = "Update";
      }

      var SaveData = {
        FixedAssetID: this.lblFixAssetID,
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
    this.dtpFaDate = new Date(item.year);
  }

  saveOD() {
    if (this.txtFaAmount == "") {
      this.txtFaAmount = "0";
    }

    // if (this.txtFaCost == "") {
    //   this.txtFaCost = "0";
    // }

    if (this.txtFaAmount == undefined || parseFloat(this.txtFaAmount) <= 0) {
      this.toastr.errorToastr(
        "Please Enter Opening Depreciation Amount",
        "Error !",
        {
          toastTimeout: 2500,
        }
      );
      return false;
      // } else if (this.txtFaCost == undefined || parseFloat(this.txtFaCost) < 0) {
      //   this.toastr.errorToastr("Please Enter Disposal In Cost", "Error !", {
      //     toastTimeout: 2500,
      //   });
      //   return false;
    } else if (
      parseFloat(this.txtFaAmount) == 0
      //  &&
      // parseFloat(this.txtFaCost) == 0
    ) {
      this.toastr.errorToastr(
        "Please Enter Opening Depreciation Amount",
        "Error !",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.dtpFaDate == undefined || this.dtpFaDate == null) {
      this.toastr.errorToastr("Please Enter Date", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.lblFixAssetID == 0) {
      this.toastr.errorToastr("Please Enter Complete Information", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      //var reqDate = this.app.convertDate(this.acquisitionDate);
      var reqFaAmount = parseFloat(this.txtFaAmount);
      if (this.txtFaAmount == "") {
        reqFaAmount = 0;
      }

      var reqFaCost = parseFloat(this.txtFaCost);
      if (this.txtFaCost == "") {
        reqFaCost = 0;
      }

      var reqDate = this.app.convertDate(this.dtpFaDate);

      var reqSpType = "Insert";
      if (this.FaDetailID > 0) {
        reqSpType = "Update";
      }

      var SaveData = {
        FixedAssetID: this.lblFixAssetID,
        TypeofEntry: "Depreciation",
        OpeningDepreciation: reqFaAmount,
        // DisposalinCost: reqFaCost,
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
            return false;
          }
        });
    }
  }

  editOD(item) {
    this.FaDetailID = item.faDetailID;
    this.txtFaAmount = item.openingDepreciation;
    // this.txtFaCost = item.disposalinCost;
    this.dtpFaDate = new Date(item.year);
  }

  saveD() {
    if (this.txtFaAmount == "") {
      this.txtFaAmount = "0";
    }

    if (this.txtFaCost == "") {
      this.txtFaCost = "0";
    }

    // if (this.txtFaAmount == undefined || parseFloat(this.txtFaAmount) <= 0) {
    //   this.toastr.errorToastr("Please Enter Depreciation Amount", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    // } else if (this.txtFaCost == undefined || parseFloat(this.txtFaCost) < 0) {
    //   this.toastr.errorToastr("Please Enter Disposal In Cost", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    // } else
    if (parseFloat(this.txtFaAmount) == 0 && parseFloat(this.txtFaCost) == 0) {
      this.toastr.errorToastr("Please Enter Depreciation Amount", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.dtpFaDate == undefined || this.dtpFaDate == null) {
      this.toastr.errorToastr("Please Enter Date", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.lblFixAssetID == 0) {
      this.toastr.errorToastr("Please Enter Complete Information", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      //var reqDate = this.app.convertDate(this.acquisitionDate);
      var reqFaAmount = parseFloat(this.txtFaAmount);
      if (this.txtFaAmount == "") {
        reqFaAmount = 0;
      }

      var reqFaCost = parseFloat(this.txtFaCost);
      if (this.txtFaCost == "") {
        reqFaCost = 0;
      }

      var reqDate = this.app.convertDate(this.dtpFaDate);

      var reqSpType = "Insert";
      if (this.FaDetailID > 0) {
        reqSpType = "Update";
      }

      var SaveData = {
        FixedAssetID: this.lblFixAssetID,
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
    this.dtpFaDate = new Date(item.year);
  }

  saveOV() {
    if (this.txtFaAmount == "") {
      this.txtFaAmount = "0";
    }

    // if (this.txtFaCost == "") {
    //   this.txtFaCost = "0";
    // }

    if (this.txtFaAmount == undefined || parseFloat(this.txtFaAmount) <= 0) {
      this.toastr.errorToastr(
        "Please Enter Opening Revaluation Amount",
        "Error !",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (
      this.txtSurplus == undefined ||
      parseFloat(this.txtSurplus) <= 0
    ) {
      this.toastr.errorToastr("Please Enter Surplus Cost", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      parseFloat(this.txtFaAmount) == 0
      //  &&
      // parseFloat(this.txtFaCost) == 0
    ) {
      this.toastr.errorToastr(
        "Please Enter Opening Revaluation Amount",
        "Error !",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.dtpFaDate == undefined || this.dtpFaDate == null) {
      this.toastr.errorToastr("Please Enter Date", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.lblFixAssetID == 0) {
      this.toastr.errorToastr("Please Enter Complete Information", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      //var reqDate = this.app.convertDate(this.acquisitionDate);
      var reqFaAmount = parseFloat(this.txtFaAmount);
      if (this.txtFaAmount == "") {
        reqFaAmount = 0;
      }

      var reqSurplus = parseFloat(this.txtSurplus);
      if (this.txtSurplus == "") {
        reqSurplus = 0;
      }

      var reqDate = this.app.convertDate(this.dtpFaDate);

      var reqSpType = "Insert";
      if (this.FaDetailID > 0) {
        reqSpType = "Update";
      }

      var SaveData = {
        FixedAssetID: this.lblFixAssetID,
        TypeofEntry: "Revalued",
        OpeningRevaluationAmount: reqFaAmount,
        OpeningRevaluationSurplus: reqSurplus,
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
            return false;
          }
        });
    }
  }

  editOV(item) {
    this.FaDetailID = item.faDetailID;
    this.txtFaAmount = item.openingRevaluationAmount;
    this.txtSurplus = item.openingRevaluationSurplus;
    this.dtpFaDate = new Date(item.year);
  }

  saveV() {
    if (this.txtFaAmount == "") {
      this.txtFaAmount = "0";
    }

    // if (this.txtFaCost == "") {
    //   this.txtFaCost = "0";
    // }

    if (this.txtFaAmount == undefined || parseFloat(this.txtFaAmount) <= 0) {
      this.toastr.errorToastr("Please Enter Revaluation Amount", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.txtSurplus == undefined ||
      parseFloat(this.txtSurplus) <= 0
    ) {
      this.toastr.errorToastr("Please Enter Surplus Cost", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      parseFloat(this.txtFaAmount) == 0
      //  &&
      // parseFloat(this.txtFaCost) == 0
    ) {
      this.toastr.errorToastr("Please Enter Revaluation Amount", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.dtpFaDate == undefined || this.dtpFaDate == null) {
      this.toastr.errorToastr("Please Enter Date", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.filePicker == undefined) {
      this.toastr.errorToastr("Please Select Document", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.lblFixAssetID == 0) {
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

      //var reqDate = this.app.convertDate(this.acquisitionDate);
      var reqFaAmount = parseFloat(this.txtFaAmount);
      if (this.txtFaAmount == "") {
        reqFaAmount = 0;
      }

      var reqSurplus = parseFloat(this.txtSurplus);
      if (this.txtSurplus == "") {
        reqSurplus = 0;
      }

      var reqDate = this.app.convertDate(this.dtpFaDate);

      var reqSpType = "Insert";
      if (this.FaDetailID > 0) {
        reqSpType = "Update";
      }

      var fPath = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/files";

      var SaveData = {
        FixedAssetID: this.lblFixAssetID,
        TypeofEntry: "Revalued",
        RevaluationAmount: reqFaAmount,
        RevalutionSurplus: reqSurplus,
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

  editV(item) {
    this.FaDetailID = item.faDetailID;
    this.txtFaAmount = item.revaluationAmount;
    this.txtSurplus = item.revalutionSurplus;
    this.dtpFaDate = new Date(item.year);
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
          } else if (type == "od") {
            $("#depriciationsOpeningModal").modal("toggle");
          } else if (type == "d") {
            $("#depriciationsDepriciationModal").modal("toggle");
          } else if (type == "ov") {
            $("#revaluationsOpeningModal").modal("toggle");
          } else if (type == "v") {
            $("#revaluationRevaluationsModal").modal("toggle");
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
                this.getFaDetail();
                this.getFaSummary();
                this.reqStatus = true;
                this.getTransactions();
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

  clear() {
    this.lblFixAssetID = 0;
    this.ddlAccSec = "";
    this.ddlTrailBalance = "";
    this.ddlProject = "";
    this.ddlLandMeasurement = "";
    this.ddlBuilding = "";
    this.dtpConstFrom = new Date();
    this.dtpConstTo = new Date();
    this.dtpPurchase = new Date();
    this.txtAKanal = "";
    this.txtAMarla = "";
    this.txtTKanal = "";
    this.txtTMarla = "";
    this.txtRemarks = "";
    this.txtProPackage = "";
    this.txtConstCost = "";
    this.txtLandCost = "";

    this.lblOpeningCost = 0;
    this.lblAddition = 0;
    this.lblOpeningReval = 0;
    this.lblReval = 0;
    this.lblTransactions = 0;
    this.lblSurplus = 0;
    this.lblOpeningSurplus = 0;
  }

  clearFaDetail() {
    this.FaDetailID = 0;
    this.txtFaAmount = "";
    this.txtFaCost = "";
    this.dtpFaDate = new Date();
    this.txtSurplus = "";

    this.filePicker = "";
    this.filePicker = undefined;
    this.file = undefined;
    this.selectedFile = null;
  }
}

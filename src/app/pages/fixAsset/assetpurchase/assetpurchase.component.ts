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
  selector: "app-assetpurchase",
  templateUrl: "./assetpurchase.component.html",
  styleUrls: ["./assetpurchase.component.scss"],
})
export class AssetpurchaseComponent implements OnInit {
  loadingBar = true;
  reqType = "";
  reqStatus = false;
  chkAssetFields = true;
  selectAllAssetFields = false;

  countField = 0;
  //pagination variables for tag list
  tagItemPerPage = "10";
  tagP = 1;

  toggleView = "form";

  imgFile = "";
  lblFileName = "";
  imageUrl = "../../../../../assets/IPCRefImg/dropHereImg.png";

  imgFileSup = "";
  lblFileNameSup = "";
  imageUrlSup = "../../../../../assets/IPCRefImg/dropHereImg.png";

  lblAssetID = 0;
  lblPurchaseID = 0;
  lblOfcType = "";
  lblOfcTypeID = 0;
  editMode = 0;
  lblAssetNo = 0;

  lblLocation = "";
  lblAccountSection = "";
  lblProject = "";
  lblIPC = "";
  lblPurchaseDt = "";
  lblTotalAmount = "";
  lblMode = "";
  lblDescription = "";
  lblMemoNo = "";
  lblMemoIssued = "";
  lblMemoDt = "";
  lblSupplier = "";
  lblSuppInvDt = "";
  lblSuppInvNo = "";

  ddlAccSec = "";
  ddlProject = "";
  ddlRef = "";
  ddlLocation = "";
  ddlPost = "";
  ddlCustody = "";
  ddlOfcSec = "";
  ddlVehicle = "";
  ddlAssetCat = "";
  ddlMode = "";

  dtpPurchase = new Date();
  dtpSupplierInvoice = new Date();
  dtpMemoDate = new Date();

  txtDescription = "";
  txtMemo = "";
  txtSupplier = "";
  txtSupInvoiceNo = "";
  txtTotalAmount = "";
  txtAssetDesc = "";
  txtCost = "";
  txtRemarks = "";
  txtVoucherNo = "";

  rdbAsset = "";

  txtSearchPurchaseData = "";
  txtSearchAccSec = "";
  txtSearchRef = "";
  txtSearchProject = "";
  txtSearchLocation = "";
  txtSearchPost = "";
  txtSearchMemoIssued = "";
  txtSearchCustody = "";
  txtSearchOfcSec = "";
  txtSearchVehicle = "";
  txtSearchAssetCat = "";

  accSecList = [];
  projectsList = [];
  refList = [];
  locList = [];
  purchaseList = [];
  postList = [];
  custodyList = [];
  ofcSecList = [];
  vehList = [];
  assetCatList = [];
  tempAssetCatList = [];
  assetCategorySpecsList = [];
  assetList = [];
  tagList = [];
  modeList = [{ name: "PSDP" }, { name: "RMA" }];

  filePicker = "";
  selectedFile: File = null;
  file;

  filePickerSup = "";
  selectedFileSup: File = null;
  fileSup;

  //asset category sepecificaiton ngModels
  make = "";
  makeList = [];
  model = "";
  modelList = [];
  size = "";
  sizeList = [];
  generation = "";
  generationList = [];
  processor = "";
  processorList = [];
  ram = "";
  ramList = [];
  driveType1 = "";
  driverType1List = [];
  hdSize1 = "";
  hdSize1List = [];
  driveType2 = "";
  driverType2List = [];
  hdSize2 = "";
  hdSize2List = [];
  author = "";
  authorList = [];
  publisher = "";
  publisherList = [];
  volume = "";
  volumeList = [];
  edition = "";
  editionList = [];

  constructor(
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService,
    private toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.rdbAsset = "1";

    this.getProjects();
    this.getLocation();
    this.getCustody();
    this.getVehicle();
    this.getAssetCategory();
    this.getAccSec();
  }

  onFileSelected(event) {
    // alert(event.target.files[0].type);

    if (event.target.files[0].type == "application/pdf") {
      this.selectedFile = <File>event.target.files[0];

      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.file = reader.result;

        var splitImg = this.file.split(",")[1];
        this.file = splitImg;
        this.imageUrl = "../../../../../assets/IPCRefImg/PDF_file_icon.svg";
        // this.showPdf = e.target.result;
        this.lblFileName = this.selectedFile.name;
      };

      reader.readAsDataURL(this.selectedFile);
    } else {
      this.toastr.errorToastr("Please Select PDF File", "Error", {
        toastTimeout: 2500,
      });

      this.file = undefined;
      this.imgFile = undefined;
      this.selectedFile = null;
      this.imageUrl = "../../../../../assets/IPCRefImg/dropHereImg.png";
      this.lblFileName = "";
    }
  }

  onSupFileSelected(event) {
    if (event.target.files[0].type == "application/pdf") {
      this.selectedFileSup = <File>event.target.files[0];

      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.fileSup = reader.result;

        var splitImg = this.fileSup.split(",")[1];
        this.fileSup = splitImg;
        this.imageUrlSup = "../../../../../assets/IPCRefImg/PDF_file_icon.svg";
        // this.showPdf = e.target.result;
        this.lblFileNameSup = this.selectedFileSup.name;
      };

      reader.readAsDataURL(this.selectedFileSup);
    } else {
      this.toastr.errorToastr("Please Select PDF File", "Error", {
        toastTimeout: 2500,
      });

      this.fileSup = undefined;
      this.imgFileSup = undefined;
      this.selectedFileSup = null;
      this.imageUrlSup = "../../../../../assets/IPCRefImg/dropHereImg.png";
      this.lblFileNameSup = "";
    }
  }

  getPurchase() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getPurchase", { headers: reqHeader })
      .subscribe((data: any) => {
        this.purchaseList = data;
        console.log(data);
      });
  }

  getAssetDetail(item) {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getPurchaseAsset?purchaseID=" + item, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.assetList = data;
      });
  }

  getAssetNo() {
    if (
      this.ddlLocation != "" &&
      this.lblOfcTypeID != 0 &&
      this.ddlAssetCat != ""
    ) {
      var saveData = {
        SubLocID: this.ddlLocation,
        OfficeTypeID: this.lblOfcTypeID,
        AssetCatID: this.ddlAssetCat,
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "getassetno", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          this.lblAssetNo = data.msg;
        });
    }
  }

  getAssetCatDescription(assetCatID) {
    if (this.ddlAssetCat != "" || this.ddlAssetCat != undefined) {
      var assetCat = this.assetCatList.filter(
        (x) => x.assetCatID == assetCatID
      );
      this.txtAssetDesc = assetCat[0].assetCatDescription;
      // this.lblAccCategory = assetCat[0].accountsCatagory;
      // this.lblDepRule = assetCat[0].depreciationRule;
      // this.lblBaseRate = assetCat[0].baseRate;
    }
  }

  assetCategorySpecs() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getAssetCategorySpecs?assetCatID=" +
          this.ddlAssetCat,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.assetCategorySpecsList = data;
      });
  }

  assetCategorySpecsData(assetCatID, specID, specListName) {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getAssetCategorySpecsData?assetCatID=" +
          assetCatID +
          "&specID=" +
          specID,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this[specListName] = data;
      });
  }

  // getAccSec(ofcTypeID) {
    getAccSec() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getaccsec", { headers: reqHeader })
      .subscribe((data: any) => {
        // this.accSecList = data.filter((x) => x.officeTypeID == ofcTypeID);
        this.accSecList = data;
        this.loadingBar = false;
      });
  }

  getAssetCategory() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getassetcat", { headers: reqHeader })
      .subscribe((data: any) => {
        this.assetCatList = data;
        this.tempAssetCatList = data;
      });
  }

  getVehicle() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getvehicles", { headers: reqHeader })
      .subscribe((data: any) => {
        this.vehList = data;
      });
  }

  getAssetCat() {
    this.ddlVehicle = "";
    this.assetCatList = this.tempAssetCatList;
    if (this.rdbAsset == "2") {
      this.assetCatList = this.assetCatList.filter(
        (x) => x.accountsCatagory == "VEHICLES"
      );
    }
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
        this.loadingBar = false;
      });
  }

  getLocation() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    if (this.cookie.get("roleName") == "Super User") {
      this.http
        .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
        .subscribe((data: any) => {
          this.locList = data;
        });
    } else {
      this.http
        .get(
          this.app.serverUrl +
            "getuserLocation?userId=" +
            this.cookie.get("userID"),
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          this.locList = data;
        });
    }
  }

  getCustody() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getposts", { headers: reqHeader })
      .subscribe((data: any) => {
        this.custodyList = data;
        this.postList = data;
      });
  }

  getOfcSection(obj) {
    this.ddlOfcSec = "";
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getwingsec?officeTypeID=" + obj, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.ofcSecList = data;
      });
  }

  savePurchaseData() {
    if (this.lblPurchaseID == 0 && this.editMode == 0) {
      this.chkPurchaseAsset();
    } else if (this.lblPurchaseID != 0 && this.editMode == 0) {
      this.chkAsset();
    } else if (this.lblPurchaseID != 0 && this.editMode != 0) {
      this.chkAssetData();
    }
  }

  chkAssetData() {
    if (
      this.ddlCustody != "" ||
      this.ddlOfcSec != "" ||
      this.ddlAssetCat != "" ||
      this.txtAssetDesc != "" ||
      this.txtCost != "" ||
      this.txtRemarks != "" ||
      this.ddlVehicle != ""
    ) {
      this.chkAssetFields = false;
    }

    if (this.chkAssetFields == true) {
      this.chkPurchase();
    } else {
      this.chkPurchaseAsset();
    }
  }

  //main entery CRUD Operation
  chkPurchaseAsset() {
    if (this.ddlLocation == undefined || this.ddlLocation == "") {
      this.toastr.errorToastr("Please Select Location", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlAccSec == undefined || this.ddlAccSec == "") {
      this.toastr.errorToastr("Please Select Account Section", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlProject == undefined || this.ddlProject == "") {
      this.toastr.errorToastr("Please Select Project", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    // } else if (this.ddlRef == undefined || this.ddlRef == "") {
    //   this.toastr.errorToastr("Please Select IPC Reference", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    } else if (this.txtTotalAmount == undefined || this.txtTotalAmount == "") {
      this.toastr.errorToastr("Please Enter Total Amount", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlMode == undefined || this.ddlMode == "") {
      this.toastr.errorToastr("Please Select Mode of Acquistion", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtDescription == undefined || this.txtDescription == "") {
      this.toastr.errorToastr("Please Enter Description", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlMode == "RMA" && this.countField != 8) {
      if (this.txtMemo == undefined || this.txtMemo == "") {
        this.toastr.errorToastr("Please Enter Memo No", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.ddlPost == undefined || this.ddlPost == "") {
        this.toastr.errorToastr("Please Select Memo Issued By", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.dtpMemoDate == undefined) {
        this.toastr.errorToastr("Please Select Memo Date", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.file == undefined || this.file == "") {
        this.toastr.errorToastr("Please Choose Memo Document", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.txtSupplier == undefined || this.txtSupplier == "") {
        this.toastr.errorToastr("Please Enter Supplier Name", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.dtpSupplierInvoice == undefined) {
        this.toastr.errorToastr(
          "Please Select Supplier Invoice Date",
          "Error !",
          {
            toastTimeout: 2500,
          }
        );
        return false;
      } else if (
        this.txtSupInvoiceNo == undefined ||
        this.txtSupInvoiceNo == ""
      ) {
        this.toastr.errorToastr("Please Enter Supplier Invoice No", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.fileSup == undefined || this.fileSup == "") {
        this.toastr.errorToastr("Please Choose Supplier Document", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      }
      this.countField = 8;
    } else if (this.ddlCustody == undefined || this.ddlCustody == "") {
      this.toastr.errorToastr("Please Select Custody", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlOfcSec == undefined || this.ddlOfcSec == "") {
      this.toastr.errorToastr("Please Select Office Section", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.rdbAsset == "2" &&
      (this.ddlVehicle == undefined || this.ddlVehicle == "")
    ) {
      this.toastr.errorToastr("Please Select Vehicle", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlAssetCat == undefined || this.ddlAssetCat == "") {
      this.toastr.errorToastr("Please Select Asset Category", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtAssetDesc == undefined || this.txtAssetDesc == "") {
      this.toastr.errorToastr("Please Enter Asset Description", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtCost == undefined || this.txtCost == "") {
      this.toastr.errorToastr("Please Enter Cost For Each", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.selectAllAssetFields = true;
      this.savePurchase();
    }
  }

  //main entery CRUD Operation
  chkPurchase() {
    if (this.ddlLocation == undefined || this.ddlLocation == "") {
      this.toastr.errorToastr("Please Select Location", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlAccSec == undefined || this.ddlAccSec == "") {
      this.toastr.errorToastr("Please Select Account Section", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlProject == undefined || this.ddlProject == "") {
      this.toastr.errorToastr("Please Select Project", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    // } else if (this.ddlRef == undefined || this.ddlRef == "") {
    //   this.toastr.errorToastr("Please Select IPC Reference", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    } else if (this.txtTotalAmount == undefined || this.txtTotalAmount == "") {
      this.toastr.errorToastr("Please Enter Total Amount", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlMode == undefined || this.ddlMode == "") {
      this.toastr.errorToastr("Please Select Mode of Acquistion", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtDescription == undefined || this.txtDescription == "") {
      this.toastr.errorToastr("Please Enter Description", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlMode == "RMA") {
      if (this.txtMemo == undefined || this.txtMemo == "") {
        this.toastr.errorToastr("Please Enter Memo No", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.ddlPost == undefined || this.ddlPost == "") {
        this.toastr.errorToastr("Please Select Memo Issued By", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.dtpMemoDate == undefined) {
        this.toastr.errorToastr("Please Select Memo Date", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.file == undefined || this.file == "") {
        this.toastr.errorToastr("Please Choose Memo Document", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.txtSupplier == undefined || this.txtSupplier == "") {
        this.toastr.errorToastr("Please Enter Supplier Name", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.dtpSupplierInvoice == undefined) {
        this.toastr.errorToastr(
          "Please Select Supplier Invoice Date",
          "Error !",
          {
            toastTimeout: 2500,
          }
        );
        return false;
      } else if (
        this.txtSupInvoiceNo == undefined ||
        this.txtSupInvoiceNo == ""
      ) {
        this.toastr.errorToastr("Please Enter Supplier Invoice No", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.fileSup == undefined || this.fileSup == "") {
        this.toastr.errorToastr("Please Choose Supplier Document", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      }
    } else {
      this.toastr.errorToastr("Else Condition", "Error !", {
        toastTimeout: 2500,
      });
      this.savePurchase();
    }
  }

  //main entery CRUD Operation
  chkAsset() {
    if (this.ddlCustody == undefined || this.ddlCustody == "") {
      this.toastr.errorToastr("Please Select Custody", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlOfcSec == undefined || this.ddlOfcSec == "") {
      this.toastr.errorToastr("Please Select Office Section", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.rdbAsset == "2" &&
      (this.ddlVehicle == undefined || this.ddlVehicle == "")
    ) {
      this.toastr.errorToastr("Please Select Vehicle", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlAssetCat == undefined || this.ddlAssetCat == "") {
      this.toastr.errorToastr("Please Select Asset Category", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtAssetDesc == undefined || this.txtAssetDesc == "") {
      this.toastr.errorToastr("Please Enter Asset Description", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtCost == undefined || this.txtCost == "") {
      this.toastr.errorToastr("Please Enter Cost For Each", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtVoucherNo == undefined || this.txtVoucherNo == "") {
      this.toastr.errorToastr("Please Enter Voucher No", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.saveAsset();
    }
  }

  savePurchase() {
    var supInvDate, memoDate;
    var purchaseDate = this.app.convertDate(this.dtpPurchase);
    var reqSpType = "INSERT";

    if (this.ddlMode == "RMA") {
      supInvDate = this.app.convertDate(this.dtpSupplierInvoice);
      memoDate = this.app.convertDate(this.dtpMemoDate);
    } else {
      supInvDate = null;
      memoDate = null;
    }

    if (this.lblPurchaseID > 0) {
      reqSpType = "UPDATE";
    }
    var SaveData = {
      subLocID: this.ddlLocation,
      officeSecID: this.ddlAccSec,
      projectID: this.ddlProject,
      iPcRef: parseInt(this.ddlRef),
      purchaseDate: purchaseDate,
      totalAmount: this.txtTotalAmount,
      description: this.txtDescription,
      memoNo: this.txtMemo,
      memoDate: memoDate,
      memoIssuedBy: this.ddlPost,
      memoEDoc: this.imageUrl,
      memoEDocExtension: "pdf",
      memoImgFile: this.file,
      supplier: this.txtSupplier,
      supplierInvNo: this.txtSupInvoiceNo,
      supplierInVDate: supInvDate,
      supplierInvEDoc: this.imageUrlSup,
      supplierEDocExtension: "pdf",
      supplierImgFile: this.fileSup,
      modeofAcq: this.ddlMode,
      voucherNo: this.txtVoucherNo,
      userid: this.cookie.get("userID"),
      SpType: reqSpType,
      purchaseID: this.lblPurchaseID,
    };
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
    this.http
      .post(this.app.serverUrl + "crudPurchase", SaveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "Success") {
          if (this.lblPurchaseID == 0) {
            this.lblPurchaseID = data.purID;
          }
          if (this.selectAllAssetFields == true) {
            this.saveAsset();
          }
          this.countField = 0;
          this.clearPurchase();

          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error !", {
            toastTimeout: 5000,
          });
          return false;
        }
      });
  }

  saveAsset() {
    debugger;
    var vehicleID;
    var purchaseDate = this.app.convertDate(this.dtpPurchase);
    var reqSpType = "INSERT";

    if (this.lblAssetID > 0) {
      reqSpType = "UPDATE";
    }
    var SaveData = {
      subLocID: this.ddlLocation,
      officeTypeID: this.lblOfcTypeID,
      assetCatID: this.ddlAssetCat,
      assetNo: this.lblAssetNo,
      officeSecID: this.ddlOfcSec,
      postID: this.ddlCustody,
      assetLocation: this.txtAssetDesc,
      assetDescription: this.txtAssetDesc,
      vehicleID: vehicleID,
      projectID: this.ddlProject,
      costAmount: this.txtCost,
      purchaseID: this.lblPurchaseID,
      purchaseDate: purchaseDate,
      iPCRef: this.ddlRef,
      make: this.make, //string
      model: this.model,
      size: this.size,
      generation: this.generation,
      processor: this.processor,
      ram: this.ram,
      driveType1: this.driveType1,
      HD1: this.hdSize1,
      driveType2: this.driveType2,
      HD2: this.hdSize2,
      Author: this.author,
      publisher: this.publisher,
      edition: this.edition,
      volume: this.volume,
      spType: reqSpType,
      userid: this.cookie.get("userID"),
      assetID: this.lblAssetID,
    };
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
    this.http
      .post(this.app.serverUrl + "crudPurchaseAsset", SaveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "Success") {
          if (this.lblAssetID == 0) {
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
          this.clearAsset();
          this.clearPurchase();
          this.getAssetDetail(this.lblPurchaseID);
          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error !", {
            toastTimeout: 5000,
          });
          return false;
        }
      });
  }

  clearPurchase() {
    this.editMode = 0;
    var loc = this.locList.filter((x) => x.subLocID == this.ddlLocation);
    this.lblLocation =
      loc[0].subLocationDescription +
      " - " +
      loc[0].subLocationDescription +
      " - " +
      loc[0].officeTypeDescription +
      " - " +
      loc[0].mainLocationDescription +
      " - " +
      loc[0].provinceName;

    var accSec = this.accSecList.filter((x) => x.officeSecID == this.ddlAccSec);
    this.lblAccountSection = accSec[0].officeDescription;

    var project = this.projectsList.filter(
      (x) => x.projectID == this.ddlProject
    );
    this.lblProject =
      project[0].projectShortName + " - " + project[0].projectName;

    var ipc = this.refList.filter((x) => x.ipcRefID == this.ddlRef);
    this.lblIPC = ipc[0].ipcRefDescription;

    this.lblPurchaseDt = this.dtpPurchase.toString();
    this.lblTotalAmount = this.txtTotalAmount;

    var mode = this.modeList.filter((x) => x.name == this.ddlMode);
    if (mode.length != 0) {
      this.lblMode = mode[0].name;
    }

    this.lblDescription = this.txtDescription;
    this.lblMemoNo = this.txtMemo;

    var memoIssued = this.postList.filter((x) => x.postID == this.ddlPost);
    if (memoIssued.length != 0) {
      this.lblMemoIssued = memoIssued[0].postName;
    }

    this.lblMemoDt = this.dtpMemoDate.toString();
    this.lblSupplier = this.txtSupplier;
    this.lblSuppInvDt = this.dtpSupplierInvoice.toString();
    this.lblSuppInvNo = this.txtSupInvoiceNo;
  }

  clearAsset() {
    this.rdbAsset = "1";
    this.ddlVehicle = "";
    this.ddlCustody = "";
    this.ddlOfcSec = "";
    this.ddlAssetCat = "";
    this.txtAssetDesc = "";
    this.txtCost = "";
    this.txtRemarks = "";
    this.lblAssetNo = 0;
    this.lblAssetID = 0;

    this.assetCategorySpecsList = [];
    //empty asset category specification
    this.make = "";
    this.makeList = [];
    this.model = "";
    this.modelList = [];
    this.size = "";
    this.sizeList = [];
    this.generation = "";
    this.generationList = [];
    this.processor = "";
    this.processorList = [];
    this.ram = "";
    this.ramList = [];
    this.driveType1 = "";
    this.driverType1List = [];
    this.hdSize1 = "";
    this.hdSize1List = [];
    this.driveType2 = "";
    this.driverType2List = [];
    this.hdSize2 = "";
    this.hdSize2List = [];
  }

  clear() {
    // this.editMode = 0;
    // this.lblPurchaseID = 0;
    this.ddlAccSec = "";
    this.ddlMode = "";
    this.ddlRef = "";
    this.ddlProject = "";
    this.ddlLocation = "";
    this.lblOfcType = "";
    this.dtpPurchase = new Date();
    this.txtDescription = "";
    this.txtMemo = "";
    this.ddlPost = "";
    this.dtpMemoDate = new Date();
    this.txtSupplier = "";
    this.dtpSupplierInvoice = new Date();
    this.txtSupplier = "";

    this.imgFile = "";
    this.lblFileName = "";
    this.imageUrl = "../../../../../assets/IPCRefImg/dropHereImg.png";

    this.imgFileSup = "";
    this.lblFileNameSup = "";
    this.imageUrlSup = "../../../../../assets/IPCRefImg/dropHereImg.png";

    this.filePicker = "";
    this.selectedFile = null;
    this.file;

    this.filePickerSup = "";
    this.selectedFileSup = null;
    this.fileSup;

    // this.assetCatList = this.tempAssetCatList;
  }

  clearAll() {
    this.editMode = 0;
    this.lblPurchaseID = 0;
    this.ddlAccSec = "";
    this.ddlMode = "";
    this.ddlRef = "";
    this.ddlProject = "";
    this.ddlLocation = "";
    this.lblOfcType = "";
    this.dtpPurchase = new Date();
    this.txtDescription = "";
    this.txtMemo = "";
    this.ddlPost = "";
    this.dtpMemoDate = new Date();
    this.txtSupplier = "";
    this.dtpSupplierInvoice = new Date();
    this.txtSupplier = "";

    this.imgFile = "";
    this.lblFileName = "";
    this.imageUrl = "../../../../../assets/IPCRefImg/dropHereImg.png";

    this.imgFileSup = "";
    this.lblFileNameSup = "";
    this.imageUrlSup = "../../../../../assets/IPCRefImg/dropHereImg.png";

    this.filePicker = "";
    this.selectedFile = null;
    this.file;

    this.filePickerSup = "";
    this.selectedFileSup = null;
    this.fileSup;

    // this.assetCatList = this.tempAssetCatList;
  }

  edit(item) {
    this.editMode = 1;

    this.lblPurchaseID = item.purchaseID;
    this.ddlLocation = item.subLocID.toString();
    this.filterOfficeType(item.subLocID);
    this.ddlAccSec = item.officeSecID.toString();
    this.ddlProject = item.projectID.toString();
    // this.lblOfcType = item.officeType;
    this.filterIPC(this.ddlProject);
    this.dtpPurchase = new Date(item.purchaseDate);
    this.txtTotalAmount = item.totalAmount;
    this.txtDescription = item.description;
    this.ddlRef = item.iPcRef;
    this.txtMemo = item.memoNo;
    this.txtVoucherNo = item.voucherNo;
    
    if (item.memoIssuedBy != null) {
      this.ddlPost = item.memoIssuedBy.toString();
    }
    this.ddlMode = item.modeofAcq;
    if (item.dtpMemoDate != null) {
      this.dtpMemoDate = new Date(item.dtpMemoDate);
    }
    this.txtSupplier = item.supplier;
    if (item.supplierInVDate != null) {
      this.dtpSupplierInvoice = new Date(item.supplierInVDate);
    }
    this.txtSupInvoiceNo = item.supplierInvNo;
    // this.txtSupplier = item.remarks;

    this.toggleView = "form";

    this.getAssetDetail(item.purchaseID);
  }

  editAsset(item) {
    this.lblAssetID = item.assetID;

    if (item.vehicleID == null) {
      this.rdbAsset = "1";
      this.ddlVehicle = "";
    } else {
      this.rdbAsset = "2";
      this.ddlVehicle = item.vehicleID;
    }

    this.ddlCustody = item.postID.toString();
    this.ddlOfcSec = item.officeSecID.toString();
    this.ddlAssetCat = item.assetCatID;
    this.txtAssetDesc = item.assetDescription;
    this.txtCost = item.costAmount;
    this.txtRemarks = item.remarks;
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
            purchaseID: item.purchaseID,
            Userid: this.cookie.get("userID"),
            SpType: "DELETE",
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "crudPurchase", SaveData, {
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

  deleteAsset(item) {
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
            assetID: item.assetID,
            Userid: this.cookie.get("userID"),
            SpType: "DELETE",
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "crudPurchaseAsset", SaveData, {
              headers: reqHeader,
            })
            .subscribe((data: any) => {
              if (data.msg == "Success") {
                this.toastr.successToastr(
                  "Record Deleted Successfully!",
                  "Success!",
                  { toastTimeout: 2500 }
                );
                // this.clearAsset();
                this.clearPurchase();
                this.getAssetDetail(this.lblPurchaseID);
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

  filterIPC(reqProjectID) {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getipc?ProjectId=" + reqProjectID, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.refList = data;
      });
  }

  filterOfficeType(subLoc) {
    var officeType = this.locList.filter((x) => x.subLocID == subLoc);

    this.lblOfcType = officeType[0].officeTypeDescription;
    this.lblOfcTypeID = officeType[0].officeTypeID;

    // this.getAccSec(this.lblOfcTypeID);
    this.getOfcSection(this.lblOfcTypeID);
    this.getAssetNo();
  }

  openPDFFile() {
    window.open(this.imageUrl);
  }

  openPDFFileSup() {
    window.open(this.imageUrlSup);
  }

  
  //print 
  print() {
    var printCss = this.printCSS();

    if(this.lblPurchaseID == 0){
      this.toastr.errorToastr("Please Select Purchase No", "Error !", {
        toastTimeout: 2500,
      });
      return;
    }
    var contents = $("#assetRegister").html();

    var frame1 = $("<iframe />");
    frame1[0].name = "frame1";
    frame1.css({ position: "absolute", top: "-1000000px" });
    $("body").append(frame1);
    var frameDoc = frame1[0].contentWindow
      ? frame1[0].contentWindow
      : frame1[0].contentDocument.document
      ? frame1[0].contentDocument.document
      : frame1[0].contentDocument;
    frameDoc.document.open();

    //Create a new HTML document.
    frameDoc.document.write(
      "<html><head><title>DIV Contents</title>" +
        "<style>" +
        printCss +
        "</style>"
    );

    //Append the external CSS file. <link rel="stylesheet" href="../../../styles.scss" /> <link rel="stylesheet" href="../../../../node_modules/bootstrap/dist/css/bootstrap.min.css" />
    frameDoc.document.write(
      '<style type="text/css" media="print">@page { size: landscape; }</style>'
    );
    frameDoc.document.write(
      '<link rel="stylesheet" href="../../../../assets/css/styles.css" type="text/css"  media="print"/>'
    );
    frameDoc.document.write("</head><body>");

    //Append the DIV contents.
    frameDoc.document.write(contents);
    frameDoc.document.write("</body></html>");

    frameDoc.document.close();

    setTimeout(function () {
      window.frames["frame1"].focus();
      window.frames["frame1"].print();
      frame1.remove();
    }, 500);
  }
  
  public printCSS() {
    var commonCss =
      ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

    var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
    var cssAddress = ".cssAddress {font-size: 16px; }";
    var cssContact = ".cssContact {font-size: 16px; }";

    var tableCss =
      "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

    var printCss = commonCss + cssHeading + cssAddress + cssContact + tableCss;

    return printCss;
  }

}

import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Observable } from "rxjs";
import { AppComponent } from "src/app/app.component";

import { NgxImageCompressService } from "ngx-image-compress";

import * as XLSX from "xlsx";
//import html2canvas from "html2canvas";
//import * as jsPDF from "jspdf";
// import "sweetalert2/src/sweetalert2.scss";

declare var $: any;

// const Swal = require("sweetalert2");

@Component({
  selector: "app-asset-entry",
  templateUrl: "./asset-entry.component.html",
  styleUrls: ["./asset-entry.component.scss"],
})
export class AssetEntryComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2007/api/";
  // serverUrl = "http://58.27.164.137:7001/api/";
  //serverUrl = "http://192.168.100.162:12345/api/";

  // serverUrl = "http://192.168.100.162:6090/api/";

  loadingBar = true;
  //pagination variables for tag list
  tagItemPerPage = "10";
  tagP = 1;

  //pagination variables for main table (asset detail list)
  mainTableItemPerPage = "16";
  mainTableP = 1;

  //pagination variables for previous tag modal window table (old tag list)
  preTagItemPerPage = "10";
  preTagP = 1;

  //* variables for orderby pipe
  order = "info.name";
  reverse = false;
  sortedCollection: any[];

  imgVehiclePath = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/vehicleImg";
  imageVehicleUrl: string =
    "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageVehicle;
  imgFileVehicle;
  selectedVehicleFile: File = null;
  lblFileName = "";

  imgTransPath = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/transferImg";
  imageTransUrl: string = "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageTrans;
  imgFileTrans;
  selectedTransFile: File = null;

  imgAssetPath = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg";
  imageAssetUrl: string = "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageAsset;
  imgFileAsset;
  selectedAssetFile: File = null;

  imgAssetPath2 = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg";
  imageAssetUrl2: string =
    "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageAsset2;
  imgFileAsset2;
  selectedAssetFile2: File = null;

  imgAssetPath3 = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg";
  imageAssetUrl3: string =
    "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageAsset3;
  imgFileAsset3;
  selectedAssetFile3: File = null;

  editMode = true;
  hidden = false;
  disableOfcType = true;
  disableMainProject = false;
  disableProject = true;
  disableCustody = false;
  disableTag = false;
  disableAssetCat = false;
  disableSenderTrans = true;
  disableReceiveTrans = false;
  hiddenFields = true;
  showBtn = true;

  chkSelectAll = false;

  txtPin = "";
  assetID = "";
  assetNo = "";
  rdbAsset = "";
  cmbCustody = "";
  cmbVehicle = "";
  cmbWngSection = "";
  cmbTransWngSection = "";
  cmbSendTransWngSection = "";
  cmbOfcType = "";
  cmbTransOfcType = "";
  cmbSendTransOfcType = "";
  cmbLocation = "";
  cmbTransLocation = "";
  cmbSendTransLocation = "";
  cmbAssetCat = "";
  cmbTransProject = "";

  txtAssetDesc = "";
  txtAssetLoc = "";
  txtIdentification = "";
  txtSerialNo = "";
  cmbProject = "";
  cmbRef = "";
  txtAmount = "";
  txtPreTag = "";
  txtNetBVal = "";
  cmbAssetCond = "";
  txtRemarks = "";
  dtpPurchaseDt;
  dtpTransferDt;
  cmbSearchOfcType = "";
  cmbSearchTransferOfcType = "";
  cmbSearchLocation = "";
  cmbSearchTransferLocation = "";
  cmbSearchWngSection = "";
  cmbResetField = "";
  cmbTransferProject = "";
  cmbTransToPost = "";
  cmbTransByPost = "";
  cmbTransRptRef = "";

  rdbTransType = "";
  rdbTransMode = "";
  rdbTransRptMode = "";
  txtRegNo = "";
  cmbMake = "";
  cmbModel = "";
  cmbType = "";
  txtEngine = "";
  txtChasis = "";
  txtTagNo = "1";
  txtTransDesc = "";
  txtDeploy = "";
  vehID = "";
  cmbVehicleAssetCat = "";

  lblAssetCatID = "";
  lblLocID = "";
  lblOfcTypeID = "";
  lblSectionID = "";
  lblAccCategory = "";
  lblAssetCategory = "";
  lblLocation = "";
  lblOfficeType = "";
  lblSection = "";
  lblDepRule = "";
  lblBaseRate = "";
  lblTransferID = "";
  lblNewTransfer = 0;
  lblTransToComp = "";
  lblTransByComp = "";
  lblTransByPost = "";

  sldUsable = false;
  disableUsable = false;
  sldServiceable = false;
  disableServiceable = false;
  sldSurplus = false;
  disableSurplus = false;
  sldCondemned = false;
  disableCondemned = false;
  disableChkCustody = false;
  sldMissing = false;
  sldTransfered = false;
  chkTag = false;
  chkProject = false;
  chkassetLoc = false;
  chkCustody = false;
  disableFields = false;

  tblSearchTag = "";
  tblSearchTrans = "";
  tblSearch = "";
  searchLocation = "";
  searchSendTransLocation = "";
  searchTransLocation = "";
  searchMake = "";
  searchModel = "";
  searchType = "";
  searchCategory = "";
  searchCustody = "";
  searchProject = "";
  searchRef = "";
  searchVehicle = "";
  searchSection = "";
  searchSendTransSection = "";
  searchTransSection = "";
  advSearchSection = "";
  advSearchLocation = "";
  searchTransProject = "";
  searchTransRptProject = "";
  searchPostTo = "";
  searchPostBy = "";
  searchVehicleAssetCat = "";
  searchTransRptRef = "";

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
  tempSpecID = "";

  oldTagList = [];
  tagList = [];
  locList = [];
  locSendTransList = [];
  locTransList = [];
  ofcTypeList = [];
  ofcTypeSendTransList = [];
  ofcTypeTransList = [];
  wngSectionList = [];
  wngSectSendTransList = [];
  wngSectTransList = [];
  vehicleList = [];
  custodyList = [];
  transferByList = [];
  transferToList = [];
  AssetCatList = [];
  tempAssetCatList = [];
  projectList = [];
  transferProjectList = [];
  refList = [];
  transRefList = [];
  preTagList = [];
  assetCondList = [];
  assetDetailList = [];
  tempDetailList = [];
  transferList = [];
  tempTransList = [];
  transDetailList = [];
  vehAssetCatList = [];
  assetTransfersRptList = [];
  assetCategorySpecsList = [];
  assetCategorySpecsDataList = [];

  vehMakeList = [];
  vehModelList = [];
  vehTypeList = [];

  objList = [];
  paramType = "";

  toggleView = "form";
  regionName = "";
  locationName = "";
  officeName = "";

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService,
    private app: AppComponent,
    private imageCompress: NgxImageCompressService
  ) {}

  // multiple image setting
  // name = "Angular 4";
  urls = [];
  onSelectFile(event) {
    // alert(this.urls.length);
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.urls.push(event.target.result);
        };

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  selectAllData(curPage, itemPerPage, event) {
    curPage = curPage - 1;
    var startPoint;

    if (curPage == 0) {
      startPoint = curPage;
    } else {
      startPoint = curPage * itemPerPage;
    }
    var endPoint = +startPoint + +itemPerPage - 1;

    if (event == "A") {
      for (startPoint; startPoint <= endPoint; startPoint++) {
        if (startPoint > this.assetDetailList.length) {
          startPoint = endPoint + 1;
        } else {
          if (this.tagList.length == 0) {
            this.tagList.push({
              tempid: this.assetDetailList[startPoint].tempid,
              tag: this.assetDetailList[startPoint].tag,
              assetLocation: this.assetDetailList[startPoint].assetLocation,
              custody: this.assetDetailList[startPoint].custody,
              assetId: this.assetDetailList[startPoint].assetID.toString(),
            });
            this.assetDetailList[startPoint].checkbox = true;
          } else {
            var srchTag = this.tagList.filter(
              (x) => x.tag == this.assetDetailList[startPoint].tag
            );
            if (srchTag.length == 0) {
              this.tagList.push({
                tempid: this.assetDetailList[startPoint].tempid,
                tag: this.assetDetailList[startPoint].tag,
                assetLocation: this.assetDetailList[startPoint].assetLocation,
                custody: this.assetDetailList[startPoint].custody,
                assetId: this.assetDetailList[startPoint].assetID.toString(),
              });
              this.assetDetailList[startPoint].checkbox = true;
            }
          }
        }
      }
    } else if (event == "B") {
      // this.tagList = [];
      // for (var i = 0; i < this.assetDetailList.length; i++) {
      //   this.assetDetailList[i].checkbox = false;
      // }

      for (startPoint; startPoint <= endPoint; startPoint++) {
        var i = 0;
        i = this.tagList.findIndex(
          (x) => x.tag == this.assetDetailList[startPoint].tag
        );
        if (i != 0) {
          this.tagList.splice(i, 1);
          this.assetDetailList[startPoint].checkbox = false;
        }
      }
    } else if (event == "C") {
      var found = false;
      for (startPoint; startPoint <= endPoint; startPoint++) {
        found = this.assetDetailList[startPoint].checkbox;
        if (found == false) {
          startPoint = endPoint + 1;
        }
      }
      this.chkSelectAll = found;
    }
  }

  clearTags() {
    // alert(this.tempSpecID);
    // debugger;
    // alert(this.locList);
    setTimeout(() => {
      Swal.fire({
        title: "Do you want to reset tag list?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          var saveData = {
            userId: this.cookie.get("userID"),
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "resettaglist", saveData, {
              headers: reqHeader,
            })
            .subscribe((data: any) => {
              this.getTags();
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "", "error");
        }
      });
    }, 0);
  }

  printTags() {
    // setTimeout(() => {
    //   Swal.fire({
    //     title: "Do you want to reset tag list?",
    //     text: "",
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonText: "Yes",
    //     cancelButtonText: "No",
    //   }).then((result) => {
    //     if (result.value) {
    //       var saveData = {
    //         userId: this.cookie.get("userID"),
    //       };

    //       var reqHeader = new HttpHeaders({
    //         "Content-Type": "application/json",
    //       });

    //       this.http
    //         .post(this.app.serverUrl + "resettaglist", saveData, {
    //           headers: reqHeader,
    //         })
    //         .subscribe((data: any) => {
    //           this.getTags();
    //         });
    //     } else if (result.dismiss === Swal.DismissReason.cancel) {
    //       Swal.fire("Cancelled", "", "error");
    //     }
    //   });
    // }, 1000);
    var printCss = this.printCSS();

    var contents = $("#tagDiv").html();

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
      '<style type="text/css" media="print">/*@page { size: landscape; }*/</style>'
    );
    frameDoc.document.write(
      '<link rel="stylesheet" href="../../../assets/css/styles.css" type="text/css"  media="print"/>'
    );
    frameDoc.document.write(
      '<link rel="stylesheet" href="../../../../assets/css/bootstrap.min.css" type="text/css"  media="print"/>'
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

  pushTag(obj, event) {
    if (this.tagList.length == 0) {
      this.tagList.push({
        tempid: obj.tempid,
        tag: obj.tag,
        assetLocation: obj.assetLocation,
        custody: obj.custody,
        assetId: obj.assetID.toString(),
      });
    } else {
      if (event == "A") {
        var tags = this.tagList.filter((x) => x.tag == obj.tag);
        if (tags.length == 0) {
          this.tagList.push({
            tempid: obj.tempid,
            tag: obj.tag,
            assetLocation: obj.assetLocation,
            custody: obj.custody,
            assetId: obj.assetID.toString(),
          });
        }
      } else {
        var tags = this.tagList.filter((x) => x.tag == obj.tag);
        if (tags.length != 0) {
          const index = this.tagList.findIndex((x) => x.tag === obj.tag);
          if (index > -1) {
            this.tagList.splice(index, 1);
          }
        }
      }
    }
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

  ngOnInit(): void {
    this.rdbTransMode = "Sender";
    this.rdbTransRptMode = "1";
    this.rdbAsset = "1";
    this.disableOfcType = true;    
    this.getTags();
    this.getLocation();
    this.getTransLocation();
    this.getOfficeType();
    this.getVehicle();
    this.getCustody();
    this.getAssetCategory();
    this.getProject();
    this.getAssetCondition();
    this.getVehicleMake();
    this.getVehicleModel();
    this.getVehicleType();
    // this.getOldTags();
    this.getTransfer();
    $("#assetRegister").hide();
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  toggleViewClick() {
    if (this.toggleView == "table") {
      this.toggleView = "form";
    } else {
      this.toggleView = "table";
    }
  }

  getPrevTag(item) {
    this.txtPreTag = item.tag;
    $("#tagModal").modal("hide");
  }

  getOldTags() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getoldtagdata", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.oldTagList = data;
        //alert(data.length);
      });
  }

  getTransfer() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getassettransfer", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.transferList = data.filter((x) => x.projectID == null);
        this.tempTransList = data;
      });
  }

  filterTansTable(tranProject) {
    this.sldTransfered = false;
    this.lblTransferID = "";
    this.clearTransfer();
    this.lblTransToComp = "";
    this.lblTransByComp = "";
    this.lblTransByPost = "";
    this.lblTransferID = "";

    this.disableProject = true;
    this.disableCustody = false;

    this.transferList = this.tempTransList;
    this.transferList = this.transferList.filter(
      (x) => x.projectID == tranProject
    );
  }

  getTransLocData() {
    // alert(this.rdbTransMode);
    if (this.rdbTransMode == "Sender") {
      this.disableSenderTrans = true;
      this.disableReceiveTrans = false;

      this.cmbTransLocation = "";
      this.cmbTransOfcType = "";
      this.cmbSendTransLocation = this.cmbLocation;
      this.cmbSendTransOfcType = this.cmbOfcType;

      // alert(this.cmbSendTransOfcType);
      this.wngSectTransList = [];
      this.wngSectSendTransList = [];
      if (this.cmbSendTransOfcType != "") {
        this.getSendTransWingSection(this.cmbSendTransOfcType);
      }
    } else if (this.rdbTransMode == "Receiver") {
      this.disableSenderTrans = false;
      this.disableReceiveTrans = true;

      this.cmbSendTransLocation = "";
      this.cmbSendTransOfcType = "";
      this.cmbTransLocation = this.cmbLocation;
      this.cmbTransOfcType = this.cmbOfcType;

      this.wngSectSendTransList = [];
      this.wngSectTransList = [];
      if (this.cmbTransOfcType != "") {
        this.getTransWingSection(this.cmbTransOfcType);
      }
    }
  }

  getTags() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "gettags?UserId=" + this.cookie.get("userID"), {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.tagList = data;
        this.tagList.reverse();
      });
  }

  getIPC() {
    // this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getipc?ProjectId=" + this.cmbProject, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.refList = data;
        // this.loadingBar = false;
      });
  }

  getTransLocation() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      // .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
      .get(this.app.serverUrl + "getsubLoc", { headers: reqHeader })
      .subscribe((data: any) => {
        this.locTransList = data;
        this.locSendTransList = data;
      });
  }

  getLocation() {
    // debugger;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    if (this.cookie.get("roleName") == "Super User") {
      this.http
        // .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
        .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
        .subscribe((data: any) => {
          // this.locList = data.filter((x) => x.isActivated == 1);
          this.locList = data;
        });
    } else {
      this.http
        // .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
        .get(
          this.app.serverUrl +
            "getuserLocation?userId=" +
            this.cookie.get("userID"),
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          // this.locList = data.filter((x) => x.isActivated == 1);
          this.locList = data;
        });
    }
  }

  showOfficeType() {
    var ofcType = this.locList.filter((x) => x.subLocID == this.cmbLocation);
    this.cmbOfcType = ofcType[0].officeTypeID;

    this.getWingSection(this.cmbOfcType);
  }

  showSendTransOfcType() {
    var ofcType = this.locSendTransList.filter(
      (x) => x.subLocID == this.cmbSendTransLocation
    );
    this.cmbSendTransOfcType = ofcType[0].officeTypeID;

    this.getSendTransWingSection(this.cmbSendTransOfcType);
  }

  showTransOfcType() {
    var ofcType = this.locTransList.filter(
      (x) => x.subLocID == this.cmbTransLocation
    );
    this.cmbTransOfcType = ofcType[0].officeTypeID;

    this.getTransWingSection(this.cmbTransOfcType);
  }

  showSearchTransferOfficeType() {
    var ofcType = this.locList.filter(
      (x) => x.subLocID == this.cmbSearchTransferLocation
    );
    this.cmbSearchTransferOfcType = ofcType[0].officeTypeID;
  }

  showSearchOfficeType() {
    var ofcType = this.locList.filter(
      (x) => x.subLocID == this.cmbSearchLocation
    );
    this.cmbSearchOfcType = ofcType[0].officeTypeID;

    this.getWingSection(this.cmbSearchOfcType);
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
        this.ofcTypeTransList = data;
        this.ofcTypeSendTransList = data;
      });
  }

  getWingSection(obj) {
    this.cmbWngSection = "";
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getwingsec?officeTypeID=" + obj, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        // this.wngSectionList = data.filter((x) => x.isActivated == 1);
        this.wngSectionList = data;
      });
  }

  getSendTransWingSection(obj) {
    // alert(obj)
    this.cmbSendTransWngSection = "";
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getwingsec?officeTypeID=" + obj, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        // this.wngSectionList = data.filter((x) => x.isActivated == 1);
        this.wngSectSendTransList = data;
      });
  }

  getTransWingSection(obj) {
    this.cmbTransWngSection = "";
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getwingsec?officeTypeID=" + obj, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        // this.wngSectionList = data.filter((x) => x.isActivated == 1);
        this.wngSectTransList = data;
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
        this.vehicleList = data;
      });
  }

  getCustody() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getposts", { headers: reqHeader })
      .subscribe((data: any) => {
        // this.custodyList = data.filter((x) => x.isActivated == 1);
        this.custodyList = data;
        // this.transferByList = data.filter((x) => x.isActivated == 1);
        this.transferByList = data;
        // this.transferToList = data.filter((x) => x.isActivated == 1);
        this.transferToList = data;
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
        this.AssetCatList = data;
        this.vehAssetCatList = data.filter(
          (x) => x.accountsCatagoryDisplay == "VEHICLES"
        );
        this.tempAssetCatList = data;
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
        this.projectList = data;
        this.transferProjectList = data;
        // this.projectList = data.filter((x) => x.isActivated == 1);
        // this.transferProjectList = data.filter((x) => x.isActivated == 1);
        this.loadingBar = false;
      });
  }

  getAssetCondition() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getassetcondition", { headers: reqHeader })
      .subscribe((data: any) => {
        this.assetCondList = data;
      });
  }

  getVehicleMake() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getvehiclemake", { headers: reqHeader })
      .subscribe((data: any) => {
        this.vehMakeList = data;
      });
  }

  getVehicleModel() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getvehiclemodel", { headers: reqHeader })
      .subscribe((data: any) => {
        this.vehModelList = data;
      });
  }

  getVehicleType() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getvehicletype", { headers: reqHeader })
      .subscribe((data: any) => {
        this.vehTypeList = data;
      });
  }

  getAssetCatDescription(assetCatID) {
    if (this.cmbAssetCat != "" || this.cmbAssetCat != undefined) {
      var assetCat = this.AssetCatList.filter(
        (x) => x.assetCatID == assetCatID
      );
      this.txtAssetDesc = assetCat[0].assetCatDescription;
      this.lblAccCategory = assetCat[0].accountsCatagory;
      this.lblDepRule = assetCat[0].depreciationRule;
      this.lblBaseRate = assetCat[0].baseRate;
    }
  }

  getAssetNo() {
    if (
      this.cmbLocation != "" &&
      this.cmbOfcType != "" &&
      this.cmbAssetCat != ""
    ) {
      var saveData = {
        SubLocID: this.cmbLocation,
        OfficeTypeID: this.cmbOfcType,
        AssetCatID: this.cmbAssetCat,
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "getassetno", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          this.assetNo = data.msg;
        });
    }
  }

  getAssetDetail() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getuserassetdetail?UserId=" +
          this.cookie.get("userID"),
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        
    if (this.cmbSearchOfcType == "" && this.cmbSearchWngSection == "") {
      this.assetDetailList = data.filter(
        (x) => x.subLocID == this.cmbSearchLocation
      );

      var locFilter = this.locList.filter(
        (x) => x.subLocID == this.cmbSearchLocation
      );

      this.regionName = locFilter[0].locationDescription;
      this.locationName = locFilter[0].subLocationDescription;
      this.officeName = locFilter[0].officeTypeDescription;
    } else if (this.cmbSearchLocation == "" && this.cmbSearchWngSection == "") {
      this.assetDetailList = data.filter(
        (x) => x.officeTypeID == this.cmbSearchOfcType
      );
    } else if (this.cmbSearchWngSection == "") {
      this.assetDetailList = data.filter(
        (x) =>
          x.subLocID == this.cmbSearchLocation &&
          x.officeTypeID == this.cmbSearchOfcType
      );

      this.locationName = this.assetDetailList[0].subLocationDescription;
      this.officeName = this.assetDetailList[0].officeTypeDescription;
    } else if (this.cmbSearchWngSection == "" && this.cmbSearchLocation == "" && this.cmbSearchWngSection == ""){
      this.assetDetailList=data;
    }
    else {
      this.assetDetailList = data.filter(
        (x) =>
          x.subLocID == this.cmbSearchLocation &&
          x.officeTypeID == this.cmbSearchOfcType &&
          x.officeSecID == this.cmbSearchWngSection
      );
    }
        // this.assetDetailList = data;
        this.tempDetailList = data;
        this.assetDetailList.reverse();
        this.tempDetailList.reverse();

        for (var i = 0; i < this.tagList.length; i++) {
          for (var j = 0; j < this.assetDetailList.length; j++) {
            if (this.tagList[i].tag == this.assetDetailList[j].tag) {
              this.assetDetailList[j].checkbox = true;
            }
          }
          for (var j = 0; j < this.tempDetailList.length; j++) {
            if (this.tagList[i].tag == this.tempDetailList[j].tag) {
              this.tempDetailList[j].checkbox = true;
            }
          }
        }
      });
  }

  editAsset(item) {
    this.imageAsset = undefined;
    this.imgFileAsset = undefined;
    this.selectedAssetFile = null;
    this.imageAssetUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";

    this.imageAsset2 = undefined;
    this.imgFileAsset2 = undefined;
    this.selectedAssetFile2 = null;
    this.imageAssetUrl2 = "../../../../../assets/assetEntryImg/dropHereImg.png";

    this.imageAsset3 = undefined;
    this.imgFileAsset3 = undefined;
    this.selectedAssetFile3 = null;
    this.imageAssetUrl3 = "../../../../../assets/assetEntryImg/dropHereImg.png";

    if (item.vehicleID == 0) {
      this.rdbAsset = "1";
    } else {
      this.rdbAsset = "2";
      this.cmbVehicle = item.vehicleID;
    }
    // this.disableFields = true;
    this.disableTag = true;

    this.lblAssetCatID = item.assetCatID;
    this.lblLocID = item.subLocID;
    this.lblOfcTypeID = item.officeTypeID;
    this.lblSectionID = item.officeSecID;

    this.lblAssetCategory = item.assetCatDescription;
    this.lblLocation = item.subLocationDescription;
    this.lblOfficeType = item.officeTypeDescription;
    this.lblSection = item.officeDescription;
    this.lblAccCategory = item.accountsCatagory;
    this.lblDepRule = item.depreciationRule;
    this.lblBaseRate = item.baseRate;

    this.cmbLocation = item.subLocID;
    this.cmbOfcType = item.officeTypeID;
    this.cmbWngSection = item.officeSecID;
    this.assetNo = item.assetNo;
    this.assetID = item.assetID;
    this.cmbCustody = item.postID;
    this.cmbAssetCat = item.assetCatID;
    this.txtAssetDesc = item.assetDescription;
    this.txtAssetLoc = item.assetLocation;
    this.txtIdentification = item.otherIdentification;
    this.txtSerialNo = item.serialNo;
    this.cmbProject = item.projectID;
    this.cmbRef = item.ipcRef;

    this.getIPC();

    if (item.purchaseDate != null) {
      this.dtpPurchaseDt = new Date(item.purchaseDate);
    }

    this.txtAmount = item.costAmount;
    this.txtPreTag = item.previousTag;
    this.txtNetBVal = item.netBookAmount;
    this.cmbAssetCond = item.assetCondition;
    this.sldUsable = item.isUseable;
    this.sldServiceable = item.isServiceAble;
    this.sldSurplus = item.isSurplus;
    this.sldCondemned = item.isCondemned;
    this.sldMissing = item.isMissing;
    this.txtRemarks = item.remarks;
    if (
      item.eDoc != null &&
      item.eDoc != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
    ) {
      this.imageAssetUrl =
      // "http://192.168.100.162:7000/assets/assetEntryImg/" +
        "http://125.209.107.137:7000/assets/assetEntryImg/" +
        item.assetID +
        "_1.jpg";
    }
    if (
      item.eDoc2 != null &&
      item.eDoc2 != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
    ) {
      this.imageAssetUrl2 =
      // "http://192.168.100.162:7000/assets/assetEntryImg/" +
        "http://125.209.107.137:7000/assets/assetEntryImg/" +
        item.assetID +
        "_2.jpg";
    }
    if (
      item.eDoc3 != null &&
      item.eDoc3 != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
    ) {
      this.imageAssetUrl3 =
      // "http://192.168.100.162:7000/assets/assetEntryImg/" +
        "http://125.209.107.137:7000/assets/assetEntryImg/" +
        item.assetID +
        "_3.jpg";
    }

    this.lblTransferID = item.transferID;
    this.sldTransfered = item.isTransfered;

    this.make = item.make;
    this.model = item.model;
    this.size = item.size;
    this.generation = item.generation;
    this.processor = item.processor;
    this.ram = item.ram;
    this.driveType1 = item.driveType1;
    this.hdSize1 = item.hd1;
    this.driveType2 = item.driveType2;
    this.hdSize2 = item.hd2;
    this.author = item.author;
    this.publisher = item.publisher;
    this.volume = item.volume;
    this.edition = item.edition;

    var trans = this.tempTransList.filter(
      (x) => x.transferID == this.lblTransferID
    );

    if (trans.length != 0) {
      this.lblTransByPost = trans[0].transfee;
      this.lblTransByComp = trans[0].transfeeCompany;
    }

    if (this.sldMissing) {
      this.disableUsable = true;
      this.sldUsable = false;
      this.disableServiceable = true;
      this.sldServiceable = false;
      this.disableSurplus = true;
      this.sldSurplus = false;
      this.disableCondemned = true;
      this.sldCondemned = false;
    } else if (!this.sldMissing) {
      this.disableUsable = false;
      this.disableServiceable = false;
      this.disableSurplus = false;
      this.disableCondemned = false;
    }

    this.toggleView = "form";
  }

  public convertDate(myDate) {
    var oldDate = new Date(myDate);
    var d = oldDate.getDate();
    var m = oldDate.getMonth();
    m += 1; // JavaScript months are 0-11
    var y = oldDate.getFullYear();

    var convertedDate = m + "-" + d + "-" + y;

    return convertedDate;
  }

  save() {
    if (this.cmbLocation == "") {
      this.toastr.errorToastr(
        "Please Select Province Location & Sub Location",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.cmbOfcType == "") {
      this.toastr.errorToastr("Please Select Office Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbWngSection == "") {
      this.toastr.errorToastr("Please Select Wing Section", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.rdbAsset == "") {
      this.toastr.errorToastr("Please Select Asset Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbAssetCat == "") {
      this.toastr.errorToastr("Please Select Asset Category", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtAssetDesc == "") {
      this.toastr.errorToastr("Please Enter Asset Description", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtAssetLoc == "") {
      this.toastr.errorToastr("Please Enter Asset Location", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.sldUsable == false &&
      this.sldServiceable == false &&
      this.sldSurplus == false &&
      this.sldCondemned == false &&
      this.sldMissing == false &&
      this.sldTransfered == false
    ) {
      this.toastr.errorToastr("Please Select Asset Group", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var count = 0;
      if (this.assetCategorySpecsList.length > 0) {
        for (var i = 0; i < this.assetCategorySpecsList.length; i++) {
          if (
            this.assetCategorySpecsList[i].specificationTitle == "Drive Type1"
          ) {
            count++;
          } else if (
            this.assetCategorySpecsList[i].specificationTitle == "HD Size1"
          ) {
            count++;
          } else if (
            this.assetCategorySpecsList[i].specificationTitle == "Drive Type2"
          ) {
            count++;
          } else if (
            this.assetCategorySpecsList[i].specificationTitle == "HD Size2"
          ) {
            count++;
          } else if (
            this[this.assetCategorySpecsList[i].specificationNgModel] == "" ||
            this[this.assetCategorySpecsList[i].specificationNgModel] ==
              undefined
          ) {
            this.toastr.errorToastr(
              "Please Fill Asset Category Specification - " +
                this.assetCategorySpecsList[i].specificationTitle,
              "Error",
              {
                toastTimeout: 2500,
              }
            );
            return false;
          }
        }
      }

      if (count == 4) {
        if (this.driveType1 == "" && this.driveType2 == "") {
          this.toastr.errorToastr(
            "Please Fill Any Asset Category Specification - Drive",
            "Error",
            {
              toastTimeout: 2500,
            }
          );
          return false;
        }
        if (
          (this.driveType1 != "" && this.hdSize1 == "") ||
          (this.driveType2 != "" && this.hdSize2 == "")
        ) {
          this.toastr.errorToastr(
            "Please Fill Correct Asset Category Specification",
            "Error",
            {
              toastTimeout: 2500,
            }
          );
          return false;
        }
        if (this.hdSize1 == "" && this.hdSize2 == "") {
          this.toastr.errorToastr(
            "Please Fill Any Asset Category Specification - Size",
            "Error",
            {
              toastTimeout: 2500,
            }
          );
          return false;
        }
      }

      var vehicleID;
      if (this.rdbAsset == "1") {
        vehicleID = null;
      } else {
        if (this.cmbVehicle == "") {
          this.toastr.errorToastr("Please Select Vehicle", "Error", {
            toastTimeout: 2500,
          });
          return false;
        } else {
          vehicleID = parseInt(this.cmbVehicle);
        }
      }

      if (this.sldMissing == false) {
        if (this.cmbCustody == "") {
          this.toastr.errorToastr("Please Select Custody", "Error", {
            toastTimeout: 2500,
          });
          return false;
        } else if (this.cmbAssetCond == "") {
          this.toastr.errorToastr("Please Select Asset Condition", "Error", {
            toastTimeout: 2500,
          });
          return false;
        }
      } else {
        this.cmbCustody = null;
        this.cmbAssetCond = null;
      }

      if (this.lblTransferID == "") {
        this.lblTransferID = "0";
      }

      var purchaseDate;
      var saveData;
      var ipcRef;
      var transferID;
      var newTrans;
      var projectID;
      if (
        this.cmbProject == "" ||
        this.cmbProject == undefined ||
        this.cmbProject == null
      ) {
        projectID = null;
      } else {
        projectID = parseInt(this.cmbProject);
        if (
          this.cmbRef == "" ||
          this.cmbRef == undefined ||
          this.cmbRef == null
        ) {
          this.toastr.errorToastr("Please Select IPC Reference", "Error", {
            toastTimeout: 2500,
          });
          return false;
        }
      }
      debugger;

      this.loadingBar = true;

      if (this.lblTransferID == "" || this.lblTransferID == "0") {
        transferID = null;
        newTrans = 0;
      } else {
        transferID = parseInt(this.lblTransferID);
        newTrans = this.lblNewTransfer;
      }
      if (this.dtpPurchaseDt == undefined || this.dtpPurchaseDt == "") {
        purchaseDate = null;
      } else {
        purchaseDate = this.convertDate(this.dtpPurchaseDt);
      }

      if (this.cmbRef == "" || this.cmbRef == null) {
        ipcRef = null;
      } else {
        ipcRef = parseInt(this.cmbRef);
      }
      var amount, netBal;
      if (this.txtAmount == "") {
        amount = 0.0;
      } else {
        amount = parseFloat(this.txtAmount);
      }

      if (this.txtNetBVal == "") {
        netBal = 0.0;
      } else {
        netBal = this.txtNetBVal;
      }

      if (this.cmbProject == "") {
        this.cmbProject = "0";
      }
      var imgAsset, imgAsset2, imgAsset3;
      var imgPath, imgPath2, imgPath3;
      if (this.imageAsset == undefined) {
        imgAsset = null;
        imgPath = null;
      } else {
        imgAsset = this.imageAsset;
        imgPath = this.imgAssetPath;
      }
      if (this.imageAsset2 == undefined) {
        imgAsset2 = null;
        imgPath2 = null;
      } else {
        imgAsset2 = this.imageAsset2;
        imgPath2 = this.imgAssetPath2;
      }

      if (this.imageAsset3 == undefined) {
        imgAsset3 = null;
        imgPath3 = null;
      } else {
        imgAsset3 = this.imageAsset3;
        imgPath3 = this.imgAssetPath3;
      }

      if (this.assetID == "") {
        // alert(parseInt(this.cmbLocation)); //int
        // alert(parseInt(this.cmbOfcType)); //int
        // alert(parseInt(this.cmbAssetCat)); //int
        // alert(parseInt(this.assetNo)); //int
        // alert(parseInt(this.cmbWngSection)); //int
        // alert(parseInt(this.cmbCustody)); //int
        // alert(this.txtAssetLoc); //string
        // alert(this.txtAssetDesc); //string
        // alert(this.txtIdentification); //string
        // alert(this.txtSerialNo); //string
        // alert(vehicleID); //int
        // alert(projectID); //int
        // alert(this.txtPreTag); //string
        // alert(this.txtAmount); //float
        // alert(this.txtNetBVal); //int
        // alert(purchaseDate); //string
        // alert(ipcRef); //string
        // alert(this.cmbAssetCond); //int
        // alert(this.sldUsable); //bool
        // alert(this.sldSurplus); //bool
        // alert(this.sldServiceable); //bool
        // alert(this.sldCondemned); //bool
        // alert(this.sldMissing); //bool
        // alert(this.sldTransfered); //bool
        // alert(this.txtRemarks); //string
        // alert(this.cookie.get("userID")); //int
        // alert(purchaseDate); //date
        // alert("Insert"); //string
        // alert(0); //int
        // alert(parseInt(this.txtTagNo)); //int
        // alert(this.imgAssetPath);
        // alert("jpg");
        // alert(imgAsset);
        // alert(transferID); // int

        saveData = {
          SubLocID: parseInt(this.cmbLocation), //int
          OfficeTypeID: parseInt(this.cmbOfcType), //int
          AssetCatID: parseInt(this.cmbAssetCat), //int
          AssetNo: parseInt(this.assetNo), //int
          OfficeSecID: parseInt(this.cmbWngSection), //int
          PostID: parseInt(this.cmbCustody), //int
          AssetLocation: this.txtAssetLoc, //string
          AssetDescription: this.txtAssetDesc, //string
          otherIdentification: this.txtIdentification, //string
          SerialNo: this.txtSerialNo, //string
          VehicleID: vehicleID, //int
          ProjectID: projectID, //int
          PreviousTag: this.txtPreTag, //string
          costAmount: amount, //float
          NetBookAmount: netBal, //int
          PurchaseDate: purchaseDate, //string
          IPCRef: ipcRef, //string
          AssetCondition: this.cmbAssetCond, //int
          IsUseable: this.sldUsable, //bool
          IsSurplus: this.sldSurplus, //bool
          IsServiceAble: this.sldServiceable, //bool
          IsCondemned: this.sldCondemned, //bool
          IsMissing: this.sldMissing, //bool
          isTransfer: this.sldTransfered, //bool
          Remarks: this.txtRemarks, //string
          Userid: this.cookie.get("userID"), //int
          IsDeleted: 0, //bool
          DeletionDate: purchaseDate, //date
          DeleteBy: 0, //int
          IsUpdated: 0, //int
          UpdatedDate: null, //date
          Updatedby: 0, //int
          SpType: "Insert", //string
          AssetID: 0, //int
          Qty: parseInt(this.txtTagNo), //int
          EDoc: imgPath,
          EDoc2: imgPath2,
          EDoc3: imgPath3,
          EDocExtension: "jpg",
          imgFile: imgAsset,
          imgFile2: imgAsset2,
          imgFile3: imgAsset3,
          TransferID: transferID, // int
          newTransfer: newTrans, // int
          make: this.make, //string
          model: this.model,
          size: this.size,
          generation: this.generation,
          processor: this.processor,
          ram: this.ram,
          driveType1: this.driveType1,
          hd1: this.hdSize1,
          driveType2: this.driveType2,
          hd2: this.hdSize2,
          author: this.author,
          publisher: this.publisher,
          volume: this.volume,
          edition: this.edition,
        };
      } else {
        // var imgAsset;
        // if (this.imageAsset == undefined) {
        //   imgAsset = null;
        // } else {
        //   imgAsset = this.imageAsset;
        // }

        saveData = {
          SubLocID: parseInt(this.lblLocID), //int
          OfficeTypeID: parseInt(this.lblOfcTypeID), //int
          AssetCatID: parseInt(this.lblAssetCatID), //int
          AssetNo: parseInt(this.assetNo), //int
          OfficeSecID: parseInt(this.lblSectionID), //int
          PostID: parseInt(this.cmbCustody), //int
          AssetLocation: this.txtAssetLoc, //string
          AssetDescription: this.txtAssetDesc, //string
          otherIdentification: this.txtIdentification, //string
          SerialNo: this.txtSerialNo, //string
          VehicleID: vehicleID, //int
          ProjectID: projectID, //int
          PreviousTag: this.txtPreTag, //string
          costAmount: amount, //float
          NetBookAmount: netBal, //int
          PurchaseDate: purchaseDate, //string
          IPCRef: ipcRef, //string
          AssetCondition: this.cmbAssetCond, //int
          IsUseable: this.sldUsable, //bool
          IsSurplus: this.sldSurplus, //bool
          IsServiceAble: this.sldServiceable, //bool
          IsCondemned: this.sldCondemned, //bool
          IsMissing: this.sldMissing, //bool
          isTransfer: this.sldTransfered, //bool
          Remarks: this.txtRemarks, //string
          Userid: this.cookie.get("userID"), //int
          IsDeleted: 0, //bool
          DeletionDate: purchaseDate, //date
          DeleteBy: 0, //int
          IsUpdated: 1, //int
          UpdatedDate: purchaseDate, //date
          Updatedby: 1, //int
          SpType: "Update", //string
          AssetID: this.assetID, //int
          Qty: this.txtTagNo, //int
          EDoc: imgPath,
          EDoc2: imgPath2,
          EDoc3: imgPath3,
          EDocExtension: "jpg",
          imgFile: imgAsset,
          imgFile2: imgAsset2,
          imgFile3: imgAsset3,
          TransferID: transferID, // int
          newTransfer: newTrans, // int
          make: this.make, //string
          model: this.model,
          size: this.size,
          generation: this.generation,
          processor: this.processor,
          ram: this.ram,
          driveType1: this.driveType1,
          hd1: this.hdSize1,
          driveType2: this.driveType2,
          hd2: this.hdSize2,
          author: this.author,
          publisher: this.publisher,
          volume: this.volume,
          edition: this.edition,
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "saveasset", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.assetID == "") {
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

            this.disableCustody = false;
            this.disableCustody = false;
            if (this.chkCustody == false) {
              this.cmbCustody = "";
            }
            if (this.chkProject == false) {
              this.cmbProject = "";
            }

            if (this.chkassetLoc == false) {
              this.txtAssetLoc = "";
            }
            this.clear();
            // this.getAssetDetail();
            this.getTags();
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

  saveVehicle() {
    if (this.txtRegNo == "") {
      this.toastr.errorToastr("Please Enter Registration No.", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbMake == "") {
      this.toastr.errorToastr("Please Select Make / Brand", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbModel == "") {
      this.toastr.errorToastr("Please Select Model", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbType == "") {
      this.toastr.errorToastr("Please Select Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbVehicleAssetCat == "") {
      this.toastr.errorToastr("Please Select Asset Category", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtEngine == "") {
      this.toastr.errorToastr("Please Enter Engine No.", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtChasis == "") {
      this.toastr.errorToastr("Please Enter Chasis No.", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtDeploy == "") {
      this.toastr.errorToastr("Please Enter Deployed With", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;

      this.imgVehiclePath =
        "C:/inetpub/wwwroot/FAR/FAR_Project/assets/vehicleImg";
      if (this.imageVehicle == undefined) {
        this.imgVehiclePath = null;
        this.imageVehicle = null;
      }
      // alert(this.imgVehiclePath);
      // alert(this.imageVehicle);
      if (this.vehID == "") {
        saveData = {
          assetCatID: parseInt(this.cmbVehicleAssetCat),
          VehID: this.txtRegNo,
          Make: this.cmbMake,
          Model: this.cmbModel,
          Type: this.cmbType,
          ChasisNum: this.txtChasis,
          EngineNum: this.txtEngine,
          deployedWith: this.txtDeploy,
          eDoc: this.imgVehiclePath,
          eDocExtension: "pdf",
          imgFile: this.imageVehicle,
          ID: 0,
          Userid: this.cookie.get("userID"),
          SPType: "Insert",
        };
      } else {
        saveData = {
          assetCatID: parseInt(this.cmbVehicleAssetCat),
          VehID: this.txtRegNo,
          Make: this.cmbMake,
          Model: this.cmbModel,
          Type: this.cmbType,
          ChasisNum: this.txtChasis,
          EngineNum: this.txtEngine,
          deployedWith: this.txtDeploy,
          eDoc: this.imgVehiclePath,
          eDocExtension: "pdf",
          imgFile: this.imageVehicle,
          ID: this.vehID,
          Userid: this.cookie.get("userID"),
          SPType: "Update",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "savevehicle", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.vehID == "") {
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

            this.clearVehicle();
            this.getVehicle();
            $("#vehicleModal").modal("hide");

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
            Userid: this.cookie.get("userID"), //int
            SpType: "Delete", //string
            AssetID: item.assetID, //int
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "saveasset", saveData, {
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
                this.getAssetDetail();

                const index = this.tagList.findIndex((x) => x.tag === item.tag);
                if (index > -1) {
                  this.tagList.splice(index, 1);
                }

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

  clear() {
    this.clearTransfer();
    this.lblTransToComp = "";
    this.lblTransByComp = "";
    this.lblTransByPost = "";
    this.lblTransferID = "";

    this.disableMainProject = false;
    this.disableTag = false;
    this.disableCustody = false;

    this.disableFields = false;
    this.disableCustody = false;
    this.chkTag = false;
    this.lblLocID = "";
    this.lblOfcTypeID = "";
    this.lblAssetCatID = "";
    this.lblSectionID = "";

    this.txtTagNo = "1";
    this.lblAssetCategory = "";
    this.lblLocation = "";
    this.lblOfficeType = "";
    this.lblSection = "";
    this.assetID = "";
    this.rdbAsset = "1";
    this.cmbVehicle = "";
    this.cmbAssetCat = "";
    this.txtAssetDesc = "";
    this.txtIdentification = "";
    this.txtSerialNo = "";
    this.cmbRef = "";
    this.dtpPurchaseDt = "";
    this.txtAmount = "";
    this.txtPreTag = "";
    this.txtNetBVal = "";
    this.cmbAssetCond = "";
    this.sldUsable = false;
    this.sldServiceable = false;
    this.sldSurplus = false;
    this.sldCondemned = false;
    this.sldMissing = false;
    this.sldTransfered = false;
    // this.disableOfcType = false;
    this.disableServiceable = false;
    this.disableSurplus = false;
    this.disableUsable = false;
    this.disableCondemned = false;
    this.disableChkCustody = false;
    this.txtRemarks = "";
    this.lblAccCategory = "";
    this.assetNo = "";
    this.lblTransferID = "";
    this.imageAsset = undefined;
    this.imgFileAsset = undefined;
    this.selectedAssetFile = null;
    this.imageAssetUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";

    this.imageAsset2 = undefined;
    this.imgFileAsset2 = undefined;
    this.selectedAssetFile2 = null;
    this.imageAssetUrl2 = "../../../../../assets/assetEntryImg/dropHereImg.png";

    this.imageAsset3 = undefined;
    this.imgFileAsset3 = undefined;
    this.selectedAssetFile3 = null;
    this.imageAssetUrl3 = "../../../../../assets/assetEntryImg/dropHereImg.png";
    this.AssetCatList = this.tempAssetCatList;
    this.disableAssetCat = false;

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

  clearAll() {
    this.clearTransfer();
    this.lblTransToComp = "";
    this.lblTransByComp = "";
    this.lblTransByPost = "";
    this.lblTransferID = "";

    this.disableMainProject = false;
    this.disableTag = false;
    this.disableCustody = false;

    this.disableFields = false;
    this.disableCustody = false;
    this.chkTag = false;
    this.lblLocID = "";
    this.lblOfcTypeID = "";
    this.lblAssetCatID = "";
    this.lblSectionID = "";

    if (this.chkProject == false) {
      this.cmbProject = "";
    }
    if (this.chkassetLoc == false) {
      this.txtAssetLoc = "";
    }
    if (this.chkCustody == false) {
      this.cmbCustody = "";
    }
    this.cmbWngSection = "";
    this.cmbOfcType = "";
    this.cmbLocation = "";
    this.txtTagNo = "1";
    this.lblAssetCategory = "";
    this.lblLocation = "";
    this.lblOfficeType = "";
    this.lblSection = "";
    this.assetID = "";
    this.rdbAsset = "1";
    this.cmbVehicle = "";
    this.cmbAssetCat = "";
    this.txtAssetDesc = "";
    this.txtIdentification = "";
    this.txtSerialNo = "";
    this.cmbRef = "";
    this.dtpPurchaseDt = "";
    this.txtAmount = "";
    this.txtPreTag = "";
    this.txtNetBVal = "";
    this.cmbAssetCond = "";
    this.sldUsable = false;
    this.sldServiceable = false;
    this.sldSurplus = false;
    this.sldCondemned = false;
    this.sldMissing = false;
    this.sldTransfered = false;
    // this.disableOfcType = false;
    this.disableServiceable = false;
    this.disableSurplus = false;
    this.disableUsable = false;
    this.disableCondemned = false;
    this.disableChkCustody = false;
    this.txtRemarks = "";
    this.lblAccCategory = "";
    this.assetNo = "";
    this.lblTransferID = "";
    this.imageAsset = undefined;
    this.imgFileAsset = undefined;
    this.selectedAssetFile = null;
    this.imageAssetUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";

    this.imageAsset2 = undefined;
    this.imgFileAsset2 = undefined;
    this.selectedAssetFile2 = null;
    this.imageAssetUrl2 = "../../../../../assets/assetEntryImg/dropHereImg.png";

    this.imageAsset3 = undefined;
    this.imgFileAsset3 = undefined;
    this.selectedAssetFile3 = null;
    this.imageAssetUrl3 = "../../../../../assets/assetEntryImg/dropHereImg.png";

    this.AssetCatList = this.tempAssetCatList;
    this.disableAssetCat = true;

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

  setCondemned() {
    if (this.sldUsable) {
      this.disableCondemned = true;
      this.sldCondemned = false;
    } else if (!this.sldUsable) {
      this.disableCondemned = false;
    }
  }

  setProject() {
    this.cmbTransferProject = this.cmbProject;
    this.disableProject = true;
    this.getIPC();
  }

  getAssetCat() {
    this.cmbVehicle = "";
    this.AssetCatList = this.tempAssetCatList;
    if (this.rdbAsset == "2") {
      this.AssetCatList = this.AssetCatList.filter(
        (x) => x.accountsCatagory == "VEHICLES"
      );
      this.lblAccCategory = "";
    } else {
      this.disableAssetCat = false;
      this.cmbAssetCat = "";
      this.lblAccCategory = "";
    }
  }

  getAssetCatVehicle(vehID) {
    var vehData = this.vehicleList.filter((x) => x.id == vehID);

    this.cmbAssetCat = vehData[0].assetCatID;
    this.disableAssetCat = true;
    this.getAssetCatDescription(this.cmbAssetCat);
    this.getAssetNo();
  }

  setTransfer() {
    if (this.sldTransfered) {
      $("#assetTransferModal").modal("show");
      setTimeout(() => this.removeTransfer(), 10);
    } else {
      this.clearTransfer();
      this.lblTransToComp = "";
      this.lblTransByComp = "";
      this.lblTransByPost = "";
      this.lblTransferID = "";

      this.disableProject = true;
      this.disableCustody = false;
      // this.cmbProject = "";
      this.cmbCustody = "";
      $("#assetTransferModal").modal("hide");
    }
  }

  removeTransfer() {
    this.clearTransfer();
    this.disableSenderTrans = true;
    this.disableReceiveTrans = false;
    if (this.lblTransferID == "") {
      this.sldTransfered = false;
      this.cmbSendTransLocation = this.cmbLocation;
      this.cmbSendTransOfcType = this.cmbOfcType;

      if (this.cmbSendTransOfcType != "") {
        this.getSendTransWingSection(this.cmbSendTransOfcType);
      }
    }
  }

  getTransByPost() {
    var postByCom = this.transferByList.filter(
      (x) => x.postID == this.cmbTransByPost
    );
    this.lblTransByComp = postByCom[0].companyName;

    this.cmbCustody = this.cmbTransByPost;

    this.disableCustody = true;
  }

  getTransToPost() {
    var postToCom = this.transferToList.filter(
      (x) => x.postID == this.cmbTransToPost
    );
    this.lblTransToComp = postToCom[0].companyName;
    this.lblTransByPost = postToCom[0].postName;
  }

  openTransferModal() {
    $("#assetTransferModal").modal("show");

    if (this.lblTransferID != "") {
      var trans = this.transferList.filter(
        (x) => x.transferID == this.lblTransferID
      );
      if (this.cmbLocation == "") {
        this.toastr.errorToastr("Please Select Main Location", "Error !", {
          toastTimeout: 5000,
        });
        return false;
      }

      if (this.cmbLocation == trans[0].tSubLocID) {
        this.rdbTransMode = "Sender";
        this.disableSenderTrans = true;
        this.disableReceiveTrans = false;
      } else if (this.cmbLocation == trans[0].rSubLocID) {
        this.rdbTransMode = "Receiver";
        this.disableSenderTrans = false;
        this.disableReceiveTrans = true;
      }
      this.sldTransfered = true;
      this.lblTransferID = trans[0].transferID;
      this.rdbTransType = trans[0].transferType;

      this.cmbSendTransLocation = trans[0].tSubLocID;
      this.cmbSendTransOfcType = trans[0].tOfficeTypeID;

      this.getSendTransWingSection(trans[0].tOfficeTypeID);

      this.cmbSendTransWngSection = trans[0].tOfficeSecID;

      this.cmbTransLocation = trans[0].rSubLocID;
      this.cmbTransOfcType = trans[0].officeTypeID;

      this.getTransWingSection(trans[0].rOfficeTypeID);

      this.cmbTransWngSection = trans[0].rOfficeSecID;

      this.rdbTransType = trans[0].transferType;
      this.cmbTransferProject = trans[0].projectID;
      this.cmbTransByPost = trans[0].tPostID;
      this.cmbTransToPost = trans[0].rPostID;
      this.dtpTransferDt = new Date(trans[0].dateofTransfer);
      this.txtTransDesc = trans[0].transferDescription;
      if (trans[0].eDoc != null) {
        this.imageTransUrl =
        // "http://192.168.100.162:7000/assets/transferImg/" +
            "http://125.209.107.137:7000/assets/transferImg/" +
          this.lblTransferID +
          ".jpg";
      }

      var transBy = this.transferByList.filter(
        (x) => x.postID == this.cmbTransByPost
      );

      var transTo = this.transferToList.filter(
        (x) => x.postID == this.cmbTransToPost
      );

      this.lblTransByPost = transBy[0].postName;
      this.lblTransToComp = transTo[0].companyName;
      this.lblTransByComp = transBy[0].companyName;
    }
  }

  setMissingYes() {
    if (this.sldMissing) {
      this.disableUsable = true;
      this.sldUsable = false;
      this.disableServiceable = true;
      this.sldServiceable = false;
      this.disableSurplus = true;
      this.sldSurplus = false;
      this.disableCondemned = true;
      this.sldCondemned = false;

      this.cmbCustody = null;
      this.cmbAssetCond = null;
      this.disableChkCustody = true;
    } else if (!this.sldMissing) {
      this.disableUsable = false;
      this.disableServiceable = false;
      this.disableSurplus = false;
      this.disableCondemned = false;
      this.disableChkCustody = false;
    }
  }

  clearLocation() {
    this.cmbSearchLocation = "";
    this.cmbSearchOfcType = "";
    this.cmbSearchWngSection = "";

    this.assetDetailList = this.tempDetailList;
  }

  clearTransferReport() {
    this.cmbSearchTransferLocation = "";
    this.cmbSearchTransferOfcType = "";
    this.cmbTransProject = "";

    this.assetTransfersRptList = [];
  }

  searchTransferTableData() {
    var locFilter = this.locList.filter(
      (x) => x.subLocID == this.cmbSearchTransferLocation
    );

    this.regionName = locFilter[0].locationDescription;
    this.locationName = locFilter[0].subLocationDescription;
    this.officeName = locFilter[0].officeTypeDescription;
  }

  searchTableData() {
    // debugger;
    this.assetDetailList = [];
    this.assetDetailList = this.tempDetailList;

    if(this.tempDetailList.length==0){
      this.getAssetDetail();
    }
    // alert(this.tempDetailList.length)
    
    if (this.cmbSearchOfcType == "" && this.cmbSearchWngSection == "") {
      this.assetDetailList = this.assetDetailList.filter(
        (x) => x.subLocID == this.cmbSearchLocation
      );

      var locFilter = this.locList.filter(
        (x) => x.subLocID == this.cmbSearchLocation
      );

      this.regionName = locFilter[0].locationDescription;
      this.locationName = locFilter[0].subLocationDescription;
      this.officeName = locFilter[0].officeTypeDescription;
    } else if (this.cmbSearchLocation == "" && this.cmbSearchWngSection == "") {
      this.assetDetailList = this.assetDetailList.filter(
        (x) => x.officeTypeID == this.cmbSearchOfcType
      );
    } else if (this.cmbSearchWngSection == "") {
      this.assetDetailList = this.assetDetailList.filter(
        (x) =>
          x.subLocID == this.cmbSearchLocation &&
          x.officeTypeID == this.cmbSearchOfcType
      );

      this.locationName = this.assetDetailList[0].subLocationDescription;
      this.officeName = this.assetDetailList[0].officeTypeDescription;
    } else {
      this.assetDetailList = this.assetDetailList.filter(
        (x) =>
          x.subLocID == this.cmbSearchLocation &&
          x.officeTypeID == this.cmbSearchOfcType &&
          x.officeSecID == this.cmbSearchWngSection
      );
    }
    // alert(this.locationName);
  }

  //*function for sort table data
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  setOldTagList() {
    //load previousTag
    debugger;
    if (this.oldTagList.length == 0) {
      this.getOldTags();
    }
  }

  //print Asset Register Report
  printAssetRegister() {
    var printCss = this.printCSS();

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

  saveTransfer() {
    // alert(this.dtpTransferDt);
    if (this.rdbTransType == "") {
      this.toastr.errorToastr("Please Select Transfer Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbSendTransLocation == "") {
      this.toastr.errorToastr(
        "Please Select Sender Transfer Province Location & Sub Location",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.cmbSendTransOfcType == "") {
      this.toastr.errorToastr(
        "Please Select Sender Transfer Office Type",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.cmbSendTransWngSection == "") {
      this.toastr.errorToastr(
        "Please Select Sender Transfer Wing Section",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.cmbTransLocation == "") {
      this.toastr.errorToastr(
        "Please Select Receiver Transfer Province Location & Sub Location",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.cmbTransOfcType == "") {
      this.toastr.errorToastr(
        "Please Select Receiver Transfer Office Type",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.cmbTransWngSection == "") {
      this.toastr.errorToastr(
        "Please Select Receiver Transfer Wing Section",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.cmbTransByPost == "") {
      this.toastr.errorToastr(
        "Please Select Transferred By Custody Name",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.cmbTransToPost == "") {
      this.toastr.errorToastr(
        "Please Select Transferred To Custody Name",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.txtTransDesc == "") {
      this.toastr.errorToastr("Please Enter Transfer Description", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.dtpTransferDt == "" || this.dtpTransferDt == undefined) {
      this.toastr.errorToastr("Please Select Transfer Date", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.imageTrans == null && this.lblTransferID == "") {
      this.toastr.errorToastr("Please Select Image", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbTransLocation == this.cmbSendTransLocation) {
      this.toastr.errorToastr(
        "Same Sender & Receiver Locations are not Allowed",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else {
      this.loadingBar = true;

      if (this.cmbTransferProject == "") {
        this.cmbTransferProject = "0";
      }

      var transferDate = this.convertDate(this.dtpTransferDt);
      var saveData;
      var projectID;

      if (this.cmbTransferProject == "0") {
        projectID = null;
      } else {
        projectID = parseInt(this.cmbTransferProject);
      }

      if (this.lblTransferID == "") {
        saveData = {
          tSubLocID: parseInt(this.cmbSendTransLocation), //int
          tofficeTypeID: parseInt(this.cmbSendTransOfcType), //int
          tOfficeSecID: parseInt(this.cmbSendTransWngSection), //int
          rSubLocID: parseInt(this.cmbTransLocation), //int
          officeTypeID: parseInt(this.cmbTransOfcType), //int
          rOfficeSecID: parseInt(this.cmbTransWngSection), //int
          TPostID: parseInt(this.cmbTransByPost), //int
          RPostID: parseInt(this.cmbTransToPost), //int
          DateofTransfer: transferDate, //int
          TransferType: this.rdbTransType, //int
          TransferDescription: this.txtTransDesc, //int
          EDoc: this.imgTransPath,
          EDocExtension: "jpg",
          Userid: this.cookie.get("userID"), //int
          TransferID: 0, //int
          ProjectID: projectID, //int
          SpType: "INSERT", //string
          imgFile: this.imageTrans,
        };
      } else {
        saveData = {
          tSubLocID: parseInt(this.cmbSendTransLocation), //int
          tofficeTypeID: parseInt(this.cmbSendTransOfcType), //int
          tOfficeSecID: parseInt(this.cmbSendTransWngSection), //int
          rSubLocID: parseInt(this.cmbTransLocation), //int
          officeTypeID: parseInt(this.cmbTransOfcType), //int
          rOfficeSecID: parseInt(this.cmbTransWngSection), //int
          TPostID: parseInt(this.cmbTransByPost), //int
          RPostID: parseInt(this.cmbTransToPost), //int
          DateofTransfer: transferDate, //int
          TransferType: this.rdbTransType, //int
          TransferDescription: this.txtTransDesc, //int
          EDoc: this.imgTransPath,
          EDocExtension: "jpg",
          Userid: this.cookie.get("userID"), //int
          TransferID: this.lblTransferID, //int
          ProjectID: projectID, //int
          SpType: "UPDATE", //string
          imgFile: this.imageTrans,
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudassettransfer", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "SUCCESS") {
            this.clearTransfer();
            if (this.lblTransferID == "") {
              this.toastr.successToastr(
                "Record Saved Successfully!",
                "Success!",
                {
                  toastTimeout: 2500,
                }
              );
              this.lblTransferID = data.transID;
            } else {
              this.toastr.successToastr(
                "Record Updated Successfully!",
                "Success!",
                {
                  toastTimeout: 2500,
                }
              );
            }
            this.disableMainProject = true;
            this.sldTransfered = true;
            this.getTransfer();
            $("#assetTransferModal").modal("hide");
            // this.lblTransferID=data.ID;
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

  editTransfer(obj) {
    var count = 0;
    if (this.cmbLocation == "") {
      this.toastr.errorToastr("Please Select Main Location", "Error !", {
        toastTimeout: 5000,
      });
      return false;
    } else if (this.cmbLocation != obj.rSubLocID) {
      count++;
    } else if (this.cmbLocation != obj.tSubLocID) {
      count++;
    }

    if (count > 1) {
      this.toastr.errorToastr("Main Location Not Match", "Error !", {
        toastTimeout: 5000,
      });
      return false;
    }
    if (this.cmbLocation == obj.tSubLocID) {
      this.rdbTransMode = "Sender";
      this.disableSenderTrans = true;
      this.disableReceiveTrans = false;
    } else if (this.cmbLocation == obj.rSubLocID) {
      this.rdbTransMode = "Receiver";
      this.disableSenderTrans = false;
      this.disableReceiveTrans = true;
    }
    this.sldTransfered = true;
    this.lblTransferID = obj.transferID;
    this.rdbTransType = obj.transferType;

    this.cmbTransferProject = obj.projectID;
    this.cmbSendTransLocation = obj.tSubLocID;
    this.cmbSendTransOfcType = obj.tofficeTypeID;

    this.getSendTransWingSection(obj.tofficeTypeID);

    this.cmbSendTransWngSection = obj.tOfficeSecID;

    this.cmbTransLocation = obj.rSubLocID;
    this.cmbTransOfcType = obj.officeTypeID;

    this.getTransWingSection(obj.officeTypeID);
    this.cmbTransWngSection = obj.rOfficeSecID;
    this.cmbTransByPost = obj.tPostID;
    this.cmbTransToPost = obj.rPostID;
    this.dtpTransferDt = new Date(obj.dateofTransfer);
    this.txtTransDesc = obj.transferDescription;
    if (obj.eDoc != null) {
      this.imageTransUrl =
      // "http://192.168.100.162:7000/assets/transferImg/" +
          "http://125.209.107.137:7000/assets/transferImg/" +
        obj.transferID +
        ".jpg";
    }

    var transBy = this.transferByList.filter(
      (x) => x.postID == this.cmbTransByPost
    );

    var transTo = this.transferToList.filter(
      (x) => x.postID == this.cmbTransToPost
    );

    this.lblTransByPost = transBy[0].postName;
    this.lblTransToComp = transTo[0].companyName;
    this.lblTransByComp = transBy[0].companyName;

    // this.cmbTransferProject = this.cmbProject;
    this.disableProject = true;
    this.cmbCustody = this.cmbTransToPost;
    this.disableCustody = true;
    this.disableMainProject = true;
    this.getIPC();
  }

  deleteTransfer(obj) {
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
            SpType: "Delete", //string
            TransferID: obj.transferID, //int
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "sudassettransfer", saveData, {
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
                this.clearTransfer();
                this.getTransfer();
                $("#assetTransferModal").modal("hide");
                this.lblTransToComp = "";
                this.lblTransByPost = "";
                this.lblTransferID = "";

                this.cmbProject = "";
                this.cmbCustody = "";

                this.sldTransfered = false;
                this.disableCustody = false;
                this.disableProject = true;

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

  deleteTransferDetail(item) {
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
            TransferID: item.transferID, //int
            AssetID: item.assetID, //int
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "deltransferdetail", saveData, {
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
                this.getTransferDetail(item);
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

  getTransferDetail(obj) {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getassettransferdetail", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.transDetailList = data.filter(
          (x) => x.transferID == obj.transferID
        );
        $("#assetTransferDetailModal").modal("show");
      });
  }

  clearTransfer() {
    this.rdbTransMode = "Sender";
    this.rdbTransType = "";
    this.cmbSendTransLocation = "";
    this.cmbSendTransOfcType = "";
    this.cmbSendTransWngSection = "";
    this.cmbTransLocation = "";
    this.cmbTransOfcType = "";
    this.cmbTransWngSection = "";
    this.cmbTransferProject = "";
    this.cmbTransByPost = "";
    this.cmbTransToPost = "";
    this.dtpTransferDt = "";
    this.txtTransDesc = "";
    this.lblTransToComp = "";
    this.imageTrans = undefined;
    this.imgFileTrans = undefined;
    this.selectedTransFile = null;
    this.imageTransUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";
  }

  clearTransferDetail(param) {
    if (param == "New") {
      this.lblNewTransfer = 1;
    } else {
      this.lblNewTransfer = 0;
    }

    this.sldTransfered = false;
    this.rdbTransMode = "Sender";
    this.rdbTransType = "";
    this.cmbTransferProject = "";
    this.cmbSendTransLocation = this.cmbLocation;
    this.cmbSendTransOfcType = this.cmbOfcType;

    this.getSendTransWingSection(this.cmbSendTransOfcType);

    this.cmbSendTransWngSection = "";
    this.cmbTransLocation = "";
    this.cmbTransOfcType = "";
    this.cmbTransWngSection = "";
    this.lblTransferID = "";
    this.cmbTransByPost = "";
    this.cmbTransToPost = "";
    this.dtpTransferDt = "";
    this.txtTransDesc = "";
    this.lblTransToComp = "";
    this.lblTransByComp = "";
    this.lblTransByPost = "";
    this.disableCustody = false;
    this.cmbCustody = "";
    this.imageTrans = undefined;
    this.imgFileTrans = undefined;
    this.selectedTransFile = null;
    this.imageTransUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";
  }

  clearVehicle() {
    this.cmbVehicleAssetCat = "";
    this.vehID = "";
    this.txtRegNo = "";
    this.cmbMake = "";
    this.cmbModel = "";
    this.cmbType = "";
    this.txtEngine = "";
    this.txtChasis = "";
    this.txtDeploy = "";
    this.imageVehicle = undefined;
    this.imgFileVehicle = undefined;
    this.selectedVehicleFile = null;
    this.imageVehicleUrl =
      "../../../../../assets/assetEntryImg/dropHereImg.png";
    this.lblFileName = "";
  }

  onVehicleFileSelected(event) {
    if (event.target.files[0].type == "application/pdf") {
      this.selectedVehicleFile = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.imageVehicle = reader.result;

        var splitImg = this.imageVehicle.split(",")[1];
        this.imageVehicle = splitImg;
        this.imageVehicleUrl = "";
        this.lblFileName = event.target.files[0].name;
      };

      reader.readAsDataURL(this.selectedVehicleFile);
    } else {
      this.toastr.errorToastr("Please Select PDF File", "Error", {
        toastTimeout: 2500,
      });

      this.imageVehicle = undefined;
      this.imgFileVehicle = undefined;
      this.selectedVehicleFile = null;
      this.lblFileName = "";
      this.imageVehicleUrl =
        "../../../../../assets/assetEntryImg/dropHereImg.png";
    }
  }

  onTransFileSelected(event) {
    alert('OK')
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/jpeg"
    ) {
      var fileName: any;
      this.selectedTransFile = event.target.files[0];
      fileName = this.selectedTransFile["name"];

      // this.selectedTransFile = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.imageTrans = e.target.result;
        this.compressFile(this.imageTrans, fileName, "imageTrans");

        // this.imageTrans = reader.result;

        // var splitImg = this.imageTrans.split(",")[1];
        // this.imageTrans = splitImg;
        // this.imageTransUrl = e.target.result;
      };

      reader.readAsDataURL(this.selectedTransFile);
    } else {
      this.toastr.errorToastr("Please Select JPEG / PNG Image", "Error", {
        toastTimeout: 2500,
      });

      this.imageTrans = undefined;
      this.imgFileTrans = undefined;
      this.selectedTransFile = null;
      this.imageTransUrl = "../../../../../assets/assetCatImg/dropHereImg.png";
    }
  }

  zoomTransImage() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    // var img = document.getElementById("myImg");
    // var modalImg = document.getElementById("img01");
    // var captionText = document.getElementById("caption");

    if (
      this.imageTransUrl ==
      "../../../../../assets/assetEntryImg/dropHereImg.png"
    ) {
      this.toastr.errorToastr("Please Select Image", "Error", {
        toastTimeout: 2500,
      });
    } else {
      modal.style.display = "block";
      (<HTMLImageElement>(
        document.querySelector("#img01")
      )).src = this.imageTransUrl;
    }
  }

  onAssetFileSelected(event) {
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/jpeg"
    ) {
      var fileName: any;
      this.selectedAssetFile = event.target.files[0];
      fileName = this.selectedAssetFile["name"];

      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.imageAssetUrl = e.target.result;
        this.compressFile(this.imageAssetUrl, fileName, "imageAsset");
        // this.imageAsset = reader.result;
        // var splitImg = this.imageAsset.split(",")[1];

        // this.imageAsset = splitImg;
        // alert(this.imageAsset);
        // this.imageAssetUrl = e.target.result;
      };

      reader.readAsDataURL(this.selectedAssetFile);
    } else {
      this.toastr.errorToastr("Please Select JPEG / PNG Image", "Error", {
        toastTimeout: 2500,
      });

      this.imageAsset = undefined;
      this.imgFileAsset = undefined;
      this.selectedAssetFile = null;
      this.imageAssetUrl = "../../../../../assets/assetCatImg/dropHereImg.png";
    }
  }

  compressFile(image, fileName, imageAsset) {
    var orientation = -1;
    // this.sizeOfOriginalImage =
    //   this.imageCompress.byteCount(image) / (1024 * 1024);
    // console.warn("Size in bytes is now:", this.sizeOfOriginalImage);
    this.imageCompress
      .compressFile(image, orientation, 50, 50)
      .then((result) => {
        // create file from byte
        const imageName = fileName;

        if (imageAsset == "imageAsset") {
          this.imageAsset = result;

          // call method that creates a blob from dataUri
          const imageBlob = this.dataURItoBlob(this.imageAsset.split(",")[1]);

          this.imageAsset = this.imageAsset.split(",")[1];
        } else if (imageAsset == "imageAsset2") {
          this.imageAsset2 = result;

          // call method that creates a blob from dataUri
          const imageBlob = this.dataURItoBlob(this.imageAsset2.split(",")[1]);

          this.imageAsset2 = this.imageAsset2.split(",")[1];
        } else if (imageAsset == "imageAsset3") {
          this.imageAsset3 = result;

          // call method that creates a blob from dataUri
          const imageBlob = this.dataURItoBlob(this.imageAsset3.split(",")[1]);

          this.imageAsset3 = this.imageAsset3.split(",")[1];
        } else if (imageAsset == "imageTrans") {
          this.imageTrans = result;

          // call method that creates a blob from dataUri
          const imageBlob = this.dataURItoBlob(this.imageTrans.split(",")[1]);

          this.imageTrans = this.imageTrans.split(",")[1];
        }

        //imageFile created below is the new compressed file which can be send to API in form data
        const imageFile = new File([result], imageName, { type: "image/jpeg" });
      });
  }
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpeg" });
    return blob;
  }

  onAssetFileSelected2(event) {
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/jpeg"
    ) {
      var fileName: any;
      this.selectedAssetFile2 = event.target.files[0];
      fileName = this.selectedAssetFile2["name"];

      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        // this.imageAsset2 = reader.result;

        this.imageAssetUrl2 = e.target.result;
        this.compressFile(this.imageAssetUrl2, fileName, "imageAsset2");

        // var splitImg = this.imageAsset2.split(",")[1];
        // this.imageAsset2 = splitImg;
        // this.imageAssetUrl2 = e.target.result;
      };

      reader.readAsDataURL(this.selectedAssetFile2);
    } else {
      this.toastr.errorToastr("Please Select JPEG / PNG Image", "Error", {
        toastTimeout: 2500,
      });

      this.imageAsset2 = undefined;
      this.imgFileAsset2 = undefined;
      this.selectedAssetFile2 = null;
      this.imageAssetUrl2 = "../../../../../assets/assetCatImg/dropHereImg.png";
    }
  }

  onAssetFileSelected3(event) {
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/jpeg"
    ) {
      var fileName: any;
      this.selectedAssetFile3 = event.target.files[0];
      fileName = this.selectedAssetFile3["name"];

      // this.selectedAssetFile3 = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        // this.imageAsset3 = reader.result;

        this.imageAssetUrl3 = e.target.result;
        this.compressFile(this.imageAssetUrl3, fileName, "imageAsset3");

        // var splitImg = this.imageAsset3.split(",")[1];
        // this.imageAsset3 = splitImg;
        // this.imageAssetUrl3 = e.target.result;
      };

      reader.readAsDataURL(this.selectedAssetFile3);
    } else {
      this.toastr.errorToastr("Please Select JPEG / PNG Image", "Error", {
        toastTimeout: 2500,
      });

      this.imageAsset3 = undefined;
      this.imgFileAsset3 = undefined;
      this.selectedAssetFile3 = null;
      this.imageAssetUrl3 = "../../../../../assets/assetCatImg/dropHereImg.png";
    }
  }

  zoomAssetImage() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    // var img = document.getElementById("myImg");
    // var modalImg = document.getElementById("img01");
    // var captionText = document.getElementById("caption");

    if (
      this.imageAssetUrl ==
      "../../../../../assets/assetEntryImg/dropHereImg.png"
    ) {
      this.toastr.errorToastr("Please Select Image", "Error", {
        toastTimeout: 2500,
      });
    } else {
      modal.style.display = "block";
      (<HTMLImageElement>(
        document.querySelector("#img01")
      )).src = this.imageAssetUrl;
    }
  }

  zoomAssetImage2() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    // var img = document.getElementById("myImg");
    // var modalImg = document.getElementById("img01");
    // var captionText = document.getElementById("caption");

    if (
      this.imageAssetUrl2 ==
      "../../../../../assets/assetEntryImg/dropHereImg.png"
    ) {
      this.toastr.errorToastr("Please Select Image", "Error", {
        toastTimeout: 2500,
      });
    } else {
      modal.style.display = "block";
      (<HTMLImageElement>(
        document.querySelector("#img01")
      )).src = this.imageAssetUrl2;
    }
  }

  zoomAssetImage3() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    // var img = document.getElementById("myImg");
    // var modalImg = document.getElementById("img01");
    // var captionText = document.getElementById("caption");

    if (
      this.imageAssetUrl3 ==
      "../../../../../assets/assetEntryImg/dropHereImg.png"
    ) {
      this.toastr.errorToastr("Please Select Image", "Error", {
        toastTimeout: 2500,
      });
    } else {
      modal.style.display = "block";
      (<HTMLImageElement>(
        document.querySelector("#img01")
      )).src = this.imageAssetUrl3;
    }
  }

  closeModal() {
    var modal = document.getElementById("myModal");

    modal.style.display = "none";
  }

  genPin(obj, param) {
    // alert(this.cookie.get("pinstatus"));
    if (this.cookie.get("pinstatus") == "true") {
      this.txtPin = "";
      this.objList = [];
      this.paramType = "";
      this.objList = obj;
      this.paramType = param;

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
            if (this.paramType == "editAsset") {
              this.editAsset(this.objList);
            } else if (this.paramType == "deleteAsset") {
              this.delete(this.objList);
            } else if (this.paramType == "editTransfer") {
              this.editTransfer(this.objList);
            } else if (this.paramType == "deleteTransfer") {
              this.deleteTransfer(this.objList);
            } else if (this.paramType == "deleteTransferDetail") {
              this.deleteTransferDetail(this.objList);
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

  // Edit Vehicle
  editVehicle(item) {
    this.imageVehicle = undefined;
    this.imgFileVehicle = undefined;
    this.selectedVehicleFile = null;
    this.imageVehicleUrl =
      "../../../../../assets/assetEntryImg/dropHereImg.png";
    this.lblFileName = "";

    $("#vehicleModal").modal("show");
    this.vehID = item.id;
    this.txtRegNo = item.vehID;
    this.cmbMake = item.make;
    this.cmbModel = item.model;
    this.cmbType = item.type;
    this.cmbVehicleAssetCat = item.assetCatID;
    this.txtDeploy = item.deployedWith;
    this.txtEngine = item.engineNum;
    this.txtChasis = item.chasisNum;
    this.cmbVehicle = "";
    if (item.eDoc != null) {
      this.imageVehicleUrl =
      // "http://192.168.100.162:7000/assets/vehicleImg/" + item.id + ".pdf";
           "http://125.209.107.137:7000/assets/vehicleImg/" + item.id + ".pdf";
      this.lblFileName = "Open Uploaded File";
    }
  }

  exportExcel() {
    this.app.exportExcel("assetRegister", "Asset Register");
  }

  exportPdf() {
    // // this.app.exportPdf("assetRegister", "Asset Register");
    // var data = document.getElementById("assetRegister");
    // html2canvas(data).then((canvas) => {
    //   // Few necessary setting options
    //   var imgWidth = 208;
    //   var pageHeight = 295;
    //   var imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   var heightLeft = imgHeight;
    //   const contentDataURL = canvas.toDataURL("image/png");
    //   let pdf = new jsPDF("p", "mm", "a4"); // A4 size page of PDF
    //   var position = 0;
    //   pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
    //   pdf.save("MYPdf.pdf"); // Generated PDF
    // });
  }

  openPDFFile() {
    if (this.imageVehicleUrl != "") {
      window.open(this.imageVehicleUrl);
    }
  }

  transfersReport(rptMode) {
    if (this.locationName == "" || this.locationName == undefined) {
      this.toastr.errorToastr(
        "select province - location - sublocation from advance search",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else {
      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: "Bearer " + Token,
      });

      this.http
        .get(
          this.app.serverUrl +
            "getassetTransfersReport?rptMode=" +
            rptMode +
            "&subLocation=" +
            this.locationName +
            "&officeType=" +
            this.officeName +
            "&projectID=" +
            this.cmbTransProject,
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          this.assetTransfersRptList = data;
        });
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
          this.cmbAssetCat,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.assetCategorySpecsList = data;
      });
  }

  // asset category specification data
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

  //print report
  printReport(divID) {
    this.app.printReport(divID);
  }

  /*** Capture Enter key ***/
  getKeyPressed(e) {
    if (e.keyCode == 13) {
      this.allowUpdation();
    }
  }

  getTransIPC() {
    // this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getipc?ProjectId=" + this.cmbProject, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.transRefList = data;
        // this.loadingBar = false;
      });
  }

  editIPC(item) {
    item.showBtn = 1;

    this.cmbTransRptRef = item.iPCRef;
  }

  saveIPC(item) {
    if (
      this.cmbTransRptRef == "" ||
      this.cmbTransRptRef == null ||
      this.cmbTransRptRef == undefined ||
      this.cmbTransRptRef == "0"
    ) {
      this.toastr.errorToastr("Please Select IPC Reference", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var saveData = {
        AssetID: item.assetID,
        IPCRef: parseInt(this.cmbTransRptRef),
        ProjectID: item.projectID,
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "editIPC", saveData, {
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
            item.showBtn = undefined;

            this.transfersReport(this.rdbTransRptMode);
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
}

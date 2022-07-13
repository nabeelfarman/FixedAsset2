import { Component, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { UserIdleService } from "angular-user-idle";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Location } from "@angular/common";
import * as XLSX from "xlsx";
//import html2canvas from "html2canvas";
//import * as jsPDF from "jspdf";
import { NgxImageCompressService } from "ngx-image-compress";

declare var $: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  // // serverUrl = "http://58.27.164.137:7001/api/";
  serverUrl = "http://125.209.107.137:7001/api/";
  // // serverUrl = "http://192.168.100.162:6090/api/";
  // // serverUrl = "http://192.168.100.162:7001/api/";

  //offline server
  // serverUrl = "http://localhost:6090/api/";

  title = "FixedAssets";
  userName = "";
  userRole = "";
  _cuId;
  _cuName;
  element = document.querySelector(".sidenav");
  loadingBar = false;

  txtOldPw = "";
  txtNewPw = "";
  txtConfirmPw = "";

  txtAssetID = "";

  txtPin = "";
  txtConfirmPin = "";

  lblAccCategory = "";
  lblAssetCategory = "";
  lblPost = "";
  lblAssetLocation = "";
  lblAssetDescription = "";
  lblOfficeType = "";
  lblLocation = "";
  lblSection = "";
  lblTag = "";
  lblProject = "";
  lblIPCRef = "";
  lblSerialNo = "";
  lblOtherIdentification = "";
  lblCondition = "";
  lblEDoc = "";
  lblCreatedBy = "";
  lblModifiedBy = "";
  lblCreationDate = "";
  lblModificationDate = "";

  imageUrl: string = "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageUrl2: string = "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageUrl3: string = "../../../../../assets/assetEntryImg/dropHereImg.png";

  // imageUrl: string = "";
  // imageUrl2: string = "";
  // imageUrl3: string = "";

  qrLogList = [];

  imgAssetPath = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg";
  imageAssetUrl: string = "../assets/assetCatImg/dropHereImg.png";
  imageAsset;
  imgFileAsset;
  selectedAssetFile: File = null;

  imgAssetPath2 = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg";
  imageAssetUrl2: string = "../assets/assetCatImg/dropHereImg.png";
  imageAsset2;
  imgFileAsset2;
  selectedAssetFile2: File = null;

  imgAssetPath3 = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg";
  imageAssetUrl3: string = "../assets/assetCatImg/dropHereImg.png";
  imageAsset3;
  imgFileAsset3;
  selectedAssetFile3: File = null;

  constructor(
    private location: Location,
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService,
    private toastr: ToastrManager,
    private http: HttpClient,
    private imageCompress: NgxImageCompressService
  ) {}

  ngOnInit(): void {
    // alert(this.cookie.get("userID"));
    if (this.cookie.get("userID") == "") {
      this.router.navigate([""]);
      // $(".sideNav-backdrop").hide();
      // $(".sidenav").hide();
      // $("#menuId").hide();
    } else {
      this._cuId = this.cookie.get("userID");
      this._cuName = this.cookie.get("userName");
      this.userRole = this.cookie.get("roleName");
      // this.router.navigate(["home"]);
      this.userName = this.cookie.get("userName");
      $("#menuId").show();
      // $(".sidenav").hide();
      $(".sideNav-backdrop").hide();
      // this.closeNav();
      // $(".sidenav").hide();
      if (this.location.path() == "") {
        this.router.navigate(["home"]);
      }
    }
  }

  // QR Scanner
  qrResultString: string;

  clearResult(): void {
    this.qrResultString = null;
    this.imageAssetUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";
    this.imageAssetUrl2 = "../../../../../assets/assetEntryImg/dropHereImg.png";
    this.imageAssetUrl3 = "../../../../../assets/assetEntryImg/dropHereImg.png";
    // this.imageUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";
    // this.imageUrl2 = "../../../../../assets/assetEntryImg/dropHereImg.png";
    // this.imageUrl3 = "../../../../../assets/assetEntryImg/dropHereImg.png";
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    this.txtAssetID = this.qrResultString;
    this.getQrCodeData();
  }

  //logout function
  Logout() {
    this.stopWatching();
    document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "pinstatus=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "roleName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    this.router.navigate([""]);

    // this._cuId = "";
    // this._cuName = "";

    $("#menuId").hide();
  }

  //user idle functions
  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  subscribeIdle() {
    this.userIdle.onTimerStart().subscribe((count) => this.Logout());
  }

  restart() {
    this.userIdle.resetTimer();
  }

  getQrCodeData() {
    this.qrLogList = [];
    this.imageAssetUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";
    this.imageAssetUrl2 = "../../../../../assets/assetEntryImg/dropHereImg.png";
    this.imageAssetUrl3 = "../../../../../assets/assetEntryImg/dropHereImg.png";
    // this.imageUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";
    // this.imageUrl2 = "../../../../../assets/assetEntryImg/dropHereImg.png";
    // this.imageUrl3 = "../../../../../assets/assetEntryImg/dropHereImg.png";
    this.lblAccCategory = "";
    this.lblAssetCategory = "";
    this.lblPost = "";
    this.lblAssetLocation = "";
    this.lblAssetDescription = "";
    this.lblOfficeType = "";
    this.lblLocation = "";
    this.lblSection = "";
    this.lblTag = "";
    this.lblProject = "";
    this.lblIPCRef = "";
    this.lblSerialNo = "";
    this.lblOtherIdentification = "";
    this.lblCondition = "";
    this.lblEDoc = "";
    this.lblCreatedBy = "";
    this.lblModifiedBy = "";
    this.lblCreationDate = "";
    this.lblModificationDate = "";

    setTimeout(() => this.getQrData(), 500);
  }

  getQrData() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      // .get(this.serverUrl + "getsubloc", { headers: reqHeader })
      .get(
        this.serverUrl + "getMoveableAssetsListTag?assetID=" + this.txtAssetID,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.lblAccCategory = data[0].accountsCatagory;
          this.lblAssetCategory = data[0].assetCatDescription;
          this.lblPost = data[0].postName;
          this.lblAssetLocation = data[0].assetLocation;
          this.lblAssetDescription = data[0].assetDescription;
          this.lblOfficeType = data[0].officeTypeDescription;
          this.lblLocation = data[0].subLocationDescription;
          this.lblSection = data[0].officeDescription;
          this.lblTag = data[0].tag;
          this.lblProject = data[0].projectShortName;
          this.lblIPCRef = data[0].ipcRef;
          this.lblSerialNo = data[0].serialNo;
          this.lblOtherIdentification = data[0].otherIdentification;
          this.lblCondition = data[0].assetCondition;
          this.lblEDoc = "eDoc";
          this.lblCreatedBy = data[0].createdBy;
          this.lblCreationDate = data[0].createdDate;
          this.lblModifiedBy = data[0].modifiedBy;
          this.lblModificationDate = data[0].modificationDate;
          if (
            data[0].eDoc != null &&
            data[0].eDoc !=
              "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
          ) {
            // this.imageAssetUrl =
            // "http://192.168.100.162:7000/assets/assetEntryImg/" +
            // data[0].assetID +
            // "_1.jpg";
            this.imageAssetUrl =
              "http://125.209.107.137:7000/assets/assetEntryImg/" +
              data[0].assetID +
              "_1.jpg";
          }
          if (
            data[0].eDoc2 != null &&
            data[0].eDoc2 !=
              "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
          ) {
            this.imageAssetUrl2 =
              // "http://192.168.100.162:7000/assets/assetEntryImg/" +
              "http://125.209.107.137:7000/assets/assetEntryImg/" +
              data[0].assetID +
              "_2.jpg";
          }
          if (
            data[0].eDoc3 != null &&
            data[0].eDoc3 !=
              "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
          ) {
            this.imageAssetUrl3 =
              // "http://192.168.100.162:7000/assets/assetEntryImg/" +
              "http://125.209.107.137:7000/assets/assetEntryImg/" +
              data[0].assetID +
              "_3.jpg";
          }
        }
      });

    this.http
      // .get(this.serverUrl + "getsubloc", { headers: reqHeader })
      .get(
        this.serverUrl + "getAssetLocationClass?assetID=" + this.txtAssetID,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.qrLogList = data;
      });
  }
  resetPw() {
    if (this.txtOldPw == undefined || this.txtOldPw == "") {
      this.toastr.errorToastr("Please Enter Old Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtNewPw == undefined || this.txtNewPw == "") {
      this.toastr.errorToastr("Please Enter New Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtConfirmPw == undefined || this.txtConfirmPw == "") {
      this.toastr.errorToastr("Please Enter Confirm Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtNewPw != this.txtConfirmPw) {
      this.toastr.errorToastr("Password Doesn't Match", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var saveData = {
        UserName: this.cookie.get("userName"),
        OldHashPassword: this.txtOldPw,
        HashPassword: this.txtNewPw,
        UpdatedBY: this.cookie.get("userID"),
        SpType: "PASSWORD",
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "changepw", saveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            this.toastr.successToastr(
              "Password Changed Successfully!",
              "Success!",
              { toastTimeout: 2500 }
            );
            this.txtOldPw = "";
            this.txtNewPw = "";
            this.txtConfirmPw = "";
            $("#closeResetNav").click();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          }
        });
    }
  }

  genPin() {
    if (this.txtPin == undefined || this.txtPin == "") {
      this.toastr.errorToastr("Please Enter Pin", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtConfirmPin == undefined || this.txtConfirmPin == "") {
      this.toastr.errorToastr("Please Enter Confirm Pin", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtPin != this.txtConfirmPin) {
      this.toastr.errorToastr("Pin Doesn't Match", "Error", {
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
        .post(this.serverUrl + "resetpw", saveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            this.toastr.successToastr(
              "Pin Generated Successfully!",
              "Success!",
              { toastTimeout: 2500 }
            );
            this.clearPin(); //$("#closeResetNav").click();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          }
        });
    }
  }

  clearPin() {
    this.txtPin = "";
    this.txtConfirmPin = "";
  }

  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }

  //function for convert date format
  public convertDate(reqDate) {
    var oldDate = new Date(reqDate);
    var d = oldDate.getDate();
    var m = oldDate.getMonth();
    m += 1; // JavaScript months are 0-11
    var y = oldDate.getFullYear();

    var convertedDate = m + "-" + d + "-" + y;

    return convertedDate;
  }

  // export in excel call from any child page
  exportExcel(elementName, fileName) {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      document.getElementById(elementName)
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, fileName + ".xlsx");
  }

  //export pdf from any child page
  exportPdf(elementName, fileName) {
    // var data = document.getElementById(elementName);
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
    //   pdf.save(fileName + ".pdf"); // Generated PDF
    // });
  }

  //print Report
  printReport(divID) {
    var printCss = this.printCSS();

    var contents = $(divID).html();

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
      "<html><head><title></title>" + "<style>" + printCss + "</style>"
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

  onAssetFileSelected(event) {
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/jpeg"
    ) {
      var fileName: any;
      this.selectedAssetFile = event.target.files[0];
      fileName = this.selectedAssetFile["name"];

      // this.selectedAssetFile = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.imageAssetUrl = e.target.result;
        this.compressFile(this.imageAssetUrl, fileName, "imageAsset");

        // this.imageAsset = reader.result;

        // var splitImg = this.imageAsset.split(",")[1];
        // this.imageAsset = splitImg;
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
      this.imageAssetUrl = "../assets/assetCatImg/dropHereImg.png";
    }
  }

  onAssetFileSelected2(event) {
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/jpeg"
    ) {
      var fileName: any;
      this.selectedAssetFile2 = event.target.files[0];
      fileName = this.selectedAssetFile2["name"];

      // this.selectedAssetFile2 = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.imageAssetUrl2 = e.target.result;
        this.compressFile(this.imageAssetUrl2, fileName, "imageAsset2");

        // this.imageAsset2 = reader.result;

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
      this.imageAssetUrl2 = "../assets/assetCatImg/dropHereImg.png";
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
        this.imageAssetUrl3 = e.target.result;
        this.compressFile(this.imageAssetUrl3, fileName, "imageAsset3");

        // this.imageAsset3 = reader.result;

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
      this.imageAssetUrl3 = "../assets/assetCatImg/dropHereImg.png";
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

  updateAssetPic() {
    if (this.txtAssetID == "" || this.txtAssetID == undefined) {
      this.toastr.errorToastr("Please Enter Asset ID", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.imageAsset == undefined &&
      this.imageAsset2 == undefined &&
      this.imageAsset3 == undefined
    ) {
      this.toastr.errorToastr(
        "Please Select At Least One Asset Image",
        "Error",
        { toastTimeout: 2500 }
      );
      return false;
    } else {
      this.loadingBar = true;

      var imgAsset, imgAsset2, imgAsset3;
      var imgPath, imgPath2, imgPath3;
      if (this.imageAsset == undefined) {
        imgAsset = null;
        if (
          this.imageAssetUrl ==
          // "http://192.168.100.162:7000/assets/assetEntryImg/" +
          "http://125.209.107.137:7000/assets/assetEntryImg/" +
            this.txtAssetID +
            "_1.jpg"
        ) {
          imgPath = this.txtAssetID;
        } else {
          imgPath = null;
        }
      } else {
        imgAsset = this.imageAsset;
        imgPath = this.imgAssetPath;
      }
      if (this.imageAsset2 == undefined) {
        imgAsset2 = null;
        if (
          this.imageAssetUrl2 ==
          // "http://192.168.100.162:7000/assets/assetEntryImg/" +
          "http://125.209.107.137:7000/assets/assetEntryImg/" +
            this.txtAssetID +
            "_2.jpg"
        ) {
          imgPath2 = this.txtAssetID;
        } else {
          imgPath2 = null;
        }
      } else {
        imgAsset2 = this.imageAsset2;
        imgPath2 = this.imgAssetPath2;
      }

      if (this.imageAsset3 == undefined) {
        imgAsset3 = null;
        if (
          this.imageAssetUrl3 ==
          // "http://192.168.100.162:7000/assets/assetEntryImg/" +
          "http://125.209.107.137:7000/assets/assetEntryImg/" +
            this.txtAssetID +
            "_3.jpg"
        ) {
          imgPath3 = this.txtAssetID;
        } else {
          imgPath3 = null;
        }
      } else {
        imgAsset3 = this.imageAsset3;
        imgPath3 = this.imgAssetPath3;
      }

      var saveData = {
        Userid: this.cookie.get("userID"),
        AssetID: this.txtAssetID,
        EDoc: imgPath,
        EDoc2: imgPath2,
        EDoc3: imgPath3,
        EDocExtension: "jpg",
        imgFile: imgAsset,
        imgFile2: imgAsset2,
        imgFile3: imgAsset3,
      };

      // $('#qrScannerModal').modal('toggle');
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "updateassetimgs", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            this.toastr.successToastr(
              "Record Updated Successfully!",
              "Success!",
              { toastTimeout: 2500 }
            );
            this.loadingBar = false;

            this.imageAsset = undefined;
            this.imgFileAsset = undefined;
            this.selectedAssetFile = null;

            this.imageAsset2 = undefined;
            this.imgFileAsset2 = undefined;
            this.selectedAssetFile2 = null;

            this.imageAsset3 = undefined;
            this.imgFileAsset3 = undefined;
            this.selectedAssetFile3 = null;

            this.imageAssetUrl = "../assets/assetCatImg/dropHereImg.png";
            this.imageAssetUrl2 = "../assets/assetCatImg/dropHereImg.png";
            this.imageAssetUrl3 = "../assets/assetCatImg/dropHereImg.png";
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            this.loadingBar = false;
            return false;
          }
        });
      this.loadingBar = false;
    }
  }
}

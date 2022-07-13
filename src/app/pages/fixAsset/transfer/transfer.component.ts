import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CookieService } from 'ngx-cookie-service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AppComponent } from 'src/app/app.component';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {

  loadingBar = true;

  imgTransPath = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/transferImg";
  imageTransUrl: string = "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageTrans;
  imgFileTrans;
  selectedTransFile: File = null;

  // editMode = true;
  // hidden = false;
  disableOfcType = true;
  // disableMainProject = false;
  disableProject = true;
  // disableCustody = false;
  // disableTag = false;
  // disableAssetCat = false;
  disableSenderTrans = true;
  disableReceiveTrans = false;
  // hiddenFields = true;
  // showBtn = true;

  txtPin = "";
  // assetID = "";
  // assetNo = "";
  // rdbAsset = "";
  // cmbCustody = "";
  // cmbVehicle = "";
  // cmbWngSection = "";
  cmbTransWngSection = "";
  cmbSendTransWngSection = "";
  // cmbOfcType = "";
  cmbTransOfcType = "";
  cmbSendTransOfcType = "";
  // cmbLocation = "";
  cmbTransLocation = "";
  cmbSendTransLocation = "";
  // cmbAssetCat = "";
  // cmbTransProject = "";

  // txtAssetDesc = "";
  // txtAssetLoc = "";
  // txtIdentification = "";
  // txtSerialNo = "";
  // cmbProject = "";
  // cmbRef = "";
  // txtAmount = "";
  // txtPreTag = "";
  // txtNetBVal = "";
  // cmbAssetCond = "";
  // txtRemarks = "";
  // dtpPurchaseDt;
  dtpTransferDt;
  // cmbSearchOfcType = "";
  // cmbSearchTransferOfcType = "";
  // cmbSearchLocation = "";
  // cmbSearchTransferLocation = "";
  // cmbSearchWngSection = "";
  // cmbResetField = "";
  cmbTransferProject = "";
  cmbTransToPost = "";
  cmbTransByPost = "";
  // cmbTransRptRef = "";

  rdbTransType = "";
  rdbTransMode = "";
  // rdbTransRptMode = "";
  // txtRegNo = "";
  // cmbMake = "";
  // cmbModel = "";
  // cmbType = "";
  // txtEngine = "";
  // txtChasis = "";
  // txtTagNo = "1";
  txtTransDesc = "";
  // txtDeploy = "";
  // vehID = "";
  // cmbVehicleAssetCat = "";

  // lblAssetCatID = "";
  // lblLocID = "";
  // lblOfcTypeID = "";
  // lblSectionID = "";
  // lblAccCategory = "";
  // lblAssetCategory = "";
  // lblLocation = "";
  // lblOfficeType = "";
  // lblSection = "";
  // lblDepRule = "";
  // lblBaseRate = "";
  // lblTransferID = "";
  lblNewTransfer = 0;
  lblTransToComp = "";
  lblTransByComp = "";
  // lblTransByPost = "";

  // sldUsable = false;
  // disableUsable = false;
  // sldServiceable = false;
  // disableServiceable = false;
  // sldSurplus = false;
  // disableSurplus = false;
  // sldCondemned = false;
  // disableCondemned = false;
  // disableChkCustody = false;
  // sldMissing = false;
  // sldTransfered = false;
  // chkTag = false;
  // chkProject = false;
  // chkassetLoc = false;
  // chkCustody = false;
  disableFields = false;

  lblTransferID = "";

  // tblSearchTag = "";
  tblSearchTrans = "";
  // tblSearch = "";
  // searchLocation = "";
  searchSendTransLocation = "";
  searchTransLocation = "";
  // searchMake = "";
  // searchModel = "";
  // searchType = "";
  // searchCategory = "";
  // searchCustody = "";
  // searchProject = "";
  // searchRef = "";
  // searchVehicle = "";
  // searchSection = "";
  searchSendTransSection = "";
  searchTransSection = "";
  // advSearchSection = "";
  // advSearchLocation = "";
  searchTransProject = "";
  // searchTransRptProject = "";
  searchPostTo = "";
  searchPostBy = "";
  // searchVehicleAssetCat = "";
  // searchTransRptRef = "";

  // oldTagList = [];
  // tagList = [];
  // locList = [];
  locSendTransList = [];
  locTransList = [];
  // ofcTypeList = [];
  ofcTypeSendTransList = [];
  ofcTypeTransList = [];
  // wngSectionList = [];
  wngSectSendTransList = [];
  wngSectTransList = [];
  // vehicleList = [];
  // custodyList = [];
  transferByList = [];
  transferToList = [];
  // AssetCatList = [];
  // tempAssetCatList = [];
  // projectList = [];
  transferProjectList = [];
  // refList = [];
  // transRefList = [];
  // preTagList = [];
  // assetCondList = [];
  // assetDetailList = [];
  // tempDetailList = [];
  transferList = [];
  tempTransList = [];
  // transDetailList = [];
  // vehAssetCatList = [];
  // assetTransfersRptList = [];
  // assetCategorySpecsList = [];
  // assetCategorySpecsDataList = [];

  objList = [];
  paramType = "";

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService,
    private app: AppComponent,
    private imageCompress: NgxImageCompressService
  ) {}

  ngOnInit(): void {
    this.rdbTransMode = "Sender";
    this.getTransfer();
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

  getTransToPost() {
    var postToCom = this.transferToList.filter(
      (x) => x.postID == this.cmbTransToPost
    );
    this.lblTransToComp = postToCom[0].companyName;
    // this.lblTransByPost = postToCom[0].postName;
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
        
        if (imageAsset == "imageTrans") {
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

  getTransByPost() {
    var postByCom = this.transferByList.filter(
      (x) => x.postID == this.cmbTransByPost
    );
    this.lblTransByComp = postByCom[0].companyName;

    // this.cmbCustody = this.cmbTransByPost;

    // this.disableCustody = true;
  }
  
  showTransOfcType() {
    var ofcType = this.locTransList.filter(
      (x) => x.subLocID == this.cmbTransLocation
    );
    this.cmbTransOfcType = ofcType[0].officeTypeID;

    this.getTransWingSection(this.cmbTransOfcType);
  }

  nsLocData() {
    // alert(this.rdbTransMode);
    if (this.rdbTransMode == "Sender") {
      this.disableSenderTrans = true;
      this.disableReceiveTrans = false;

      this.cmbTransLocation = "";
      this.cmbTransOfcType = "";
      // this.cmbSendTransLocation = this.cmbLocation;
      // this.cmbSendTransOfcType = this.cmbOfcType;

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
      // this.cmbTransLocation = this.cmbLocation;
      // this.cmbTransOfcType = this.cmbOfcType;

      this.wngSectSendTransList = [];
      this.wngSectTransList = [];
      if (this.cmbTransOfcType != "") {
        this.getTransWingSection(this.cmbTransOfcType);
      }
    }
  }
  
  filterTansTable(tranProject) {
    // this.sldTransfered = false;
    this.lblTransferID = "";
    this.clearTransfer();
    this.lblTransToComp = "";
    this.lblTransByComp = "";
    // this.lblTransByPost = "";
    this.lblTransferID = "";

    this.disableProject = true;
    // this.disableCustody = false;

    this.transferList = this.tempTransList;
    this.transferList = this.transferList.filter(
      (x) => x.projectID == tranProject
    );
  }

  showSendTransOfcType() {
    var ofcType = this.locSendTransList.filter(
      (x) => x.subLocID == this.cmbSendTransLocation
    );
    this.cmbSendTransOfcType = ofcType[0].officeTypeID;

    this.getSendTransWingSection(this.cmbSendTransOfcType);
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

            this.getTransfer();
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
    // if (this.cmbLocation == "") {
    //   this.toastr.errorToastr("Please Select Main Location", "Error !", {
    //     toastTimeout: 5000,
    //   });
    //   return false;
    // } else if (this.cmbLocation != obj.rSubLocID) {
    //   count++;
    // } else if (this.cmbLocation != obj.tSubLocID) {
    //   count++;
    // }

    if (count > 1) {
      this.toastr.errorToastr("Main Location Not Match", "Error !", {
        toastTimeout: 5000,
      });
      return false;
    }
    // if (this.cmbLocation == obj.tSubLocID) {
    //   this.rdbTransMode = "Sender";
    //   this.disableSenderTrans = true;
    //   this.disableReceiveTrans = false;
    // } else if (this.cmbLocation == obj.rSubLocID) {
    //   this.rdbTransMode = "Receiver";
    //   this.disableSenderTrans = false;
    //   this.disableReceiveTrans = true;
    // }
    // this.sldTransfered = true;
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

    // this.lblTransByPost = transBy[0].postName;
    this.lblTransToComp = transTo[0].companyName;
    this.lblTransByComp = transBy[0].companyName;

    // this.cmbTransferProject = this.cmbProject;
    this.disableProject = true;
    // this.cmbCustody = this.cmbTransToPost;
    // this.disableCustody = true;
    // this.disableMainProject = true;
    // this.getIPC();
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
                // $("#assetTransferModal").modal("hide");
                this.lblTransToComp = "";
                // this.lblTransByPost = "";
                this.lblTransferID = "";

                // this.cmbProject = "";
                // this.cmbCustody = "";

                // this.sldTransfered = false;
                // this.disableCustody = false;
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
        // this.transDetailList = data.filter(
        //   (x) => x.transferID == obj.transferID
        // );
        // $("#assetTransferDetailModal").modal("show");
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

    // this.sldTransfered = false;
    this.rdbTransMode = "Sender";
    this.rdbTransType = "";
    this.cmbTransferProject = "";
    // this.cmbSendTransLocation = this.cmbLocation;
    // this.cmbSendTransOfcType = this.cmbOfcType;

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
    // this.lblTransByPost = "";
    // this.disableCustody = false;
    // this.cmbCustody = "";
    this.imageTrans = undefined;
    this.imgFileTrans = undefined;
    this.selectedTransFile = null;
    this.imageTransUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";
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
            if (this.paramType == "editTransfer") {
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

  /*** Capture Enter key ***/
  getKeyPressed(e) {
    if (e.keyCode == 13) {
      this.allowUpdation();
    }
  }

  closeModal() {
    var modal = document.getElementById("myModal");

    modal.style.display = "none";
  }

  getTransLocData() {
    // alert(this.rdbTransMode);
    if (this.rdbTransMode == "Sender") {
      this.disableSenderTrans = true;
      this.disableReceiveTrans = false;

      this.cmbTransLocation = "";
      this.cmbTransOfcType = "";
      // this.cmbSendTransLocation = this.cmbLocation;
      // this.cmbSendTransOfcType = this.cmbOfcType;

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
      // this.cmbTransLocation = this.cmbLocation;
      // this.cmbTransOfcType = this.cmbOfcType;

      this.wngSectSendTransList = [];
      this.wngSectTransList = [];
      if (this.cmbTransOfcType != "") {
        this.getTransWingSection(this.cmbTransOfcType);
      }
    }
  }

}

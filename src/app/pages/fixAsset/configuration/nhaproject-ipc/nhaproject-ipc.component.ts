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
  selector: "app-nhaproject-ipc",
  templateUrl: "./nhaproject-ipc.component.html",
  styleUrls: ["./nhaproject-ipc.component.scss"],
})
export class NHAProjectIPCComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2007/api/";

  // imgPath = "D:/Flutter App/FixedAssets/src/assets/assetCatImg";
  imgPath = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/IPCRefImg";
  imageUrl: string = "../../../../../assets/IPCRefImg/dropHereImg.png";
  showPdf = "";
  lblFileName = "";
  image;
  imgFile;
  selectedFile: File = null;

  heading = "Add";

  loadingBar = true;
  modalLoadingBar = false;
  disableProject = false;

  txtPin = "";
  ipcID = "";
  ipcDetailID = "";
  cmbProject = "";
  cmbAssetCat = "";
  txtPkgNo = "";
  txtIPCNo = "";
  txtIpcDesc = "";
  txtQty = "";
  txtDesc = "";
  lblProjectName = "";
  lblAccCategory = "";
  searchProject = "";
  searchCategory = "";
  tblSearch = "";
  tblSearchDetail = "";

  projectList = [];
  ipcList = [];
  tempList = [];

  ipcDetailList = [];
  // tempDetailList = [];
  AssetCatList = [];

  objList = [];
  paramType = "";

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.getIPC();
    this.getProjects();
    this.getAssetCategory();
  }

  getIPC() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getipc", { headers: reqHeader })
      .subscribe((data: any) => {
        this.tempList = data.reverse();
        if (this.cmbProject != "") {
          this.ipcList = data.filter((x) => x.projectID == this.cmbProject);
        } else {
          this.ipcList = data;
        }
        this.loadingBar = false;
      });
  }

  filterTable(project) {
    this.ipcList = this.tempList;
    this.ipcList = this.ipcList.filter((x) => x.projectID == project);
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
      });
  }

  getProjects() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getprojects", { headers: reqHeader })
      .subscribe((data: any) => {
        this.projectList = data;
        this.loadingBar = false;
      });
  }

  getAssetCatDescription(assetCatID) {
    // this.ipcDetailList = this.tempDetailList;
    if (this.cmbAssetCat != "" || this.cmbAssetCat != undefined) {
      var assetCat = this.AssetCatList.filter(
        (x) => x.assetCatID == assetCatID
      );
      this.lblAccCategory = assetCat[0].accountsCatagory;

      // this.ipcDetailList = this.ipcDetailList.filter(
      //   (x) => x.assetCatID == assetCatID
      // );
    }
  }

  validateFields(event) {
    escape(event);
  }

  onFileSelected(event) {
    if (event.target.files[0].type == "application/pdf") {
      this.selectedFile = <File>event.target.files[0];

      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.image = reader.result;

        var splitImg = this.image.split(",")[1];
        this.image = splitImg;
        this.imageUrl = "../../../../../assets/IPCRefImg/PDF_file_icon.svg";
        this.showPdf = e.target.result;
        this.lblFileName = this.selectedFile.name;
      };

      reader.readAsDataURL(this.selectedFile);
    } else {
      this.toastr.errorToastr("Please Select PDF File", "Error", {
        toastTimeout: 2500,
      });

      this.image = undefined;
      this.imgFile = undefined;
      this.selectedFile = null;
      this.imageUrl = "";
    }
  }

  zoomImage() {
    // Get the modal
    var modal = document.getElementById("myModal");

    if (this.imageUrl == "") {
      this.toastr.errorToastr("Please Select PDF", "Error", {
        toastTimeout: 2500,
      });
    } else {
      modal.style.display = "block";
      (<HTMLImageElement>document.querySelector("#img01")).src = this.showPdf;
    }
  }

  closeModal() {
    var modal = document.getElementById("myModal");

    modal.style.display = "none";
  }

  getIPCDetail(obj) {
    this.clearDetail();
    this.ipcID = obj;
    this.disableProject = true;
    var projectName = this.ipcList.filter((x) => x.ipcRefID == obj);

    this.lblProjectName = projectName[0].projectShortName;

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getipcdetail?IPCRefID=" + this.ipcID, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.ipcDetailList = data.reverse();
        // this.tempDetailList = data;
        $("#ipcDetailModal").modal("show");
      });
  }

  save() {
    if (this.cmbProject == "") {
      this.toastr.errorToastr("Please Select Project", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtPkgNo == "") {
      this.toastr.errorToastr("Please Enter Package No", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtIPCNo == "0" || this.txtIPCNo == "") {
      this.toastr.errorToastr("Please Enter IPC No", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtIpcDesc == "") {
      this.toastr.errorToastr("Please Enter IPC Description", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;
      if (this.ipcID == "") {
        saveData = {
          ProjectID: parseInt(this.cmbProject),
          ProjectPackage: this.txtPkgNo,
          IPCNo: this.txtIPCNo,
          IPCRefDescription: this.txtIpcDesc,
          EDoc: this.imgPath,
          EDocExtension: "pdf",
          imgFile: this.image,
          IPCRefID: 0,
          userId: this.cookie.get("userID"),
          spType: "INSERT",
        };
      } else {
        saveData = {
          ProjectID: parseInt(this.cmbProject),
          ProjectPackage: this.txtPkgNo,
          IPCNo: this.txtIPCNo,
          IPCRefDescription: this.txtIpcDesc,
          EDoc: this.imgPath,
          EDocExtension: "pdf",
          imgFile: this.image,
          IPCRefID: this.ipcID,
          userId: this.cookie.get("userID"),
          spType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudipcref", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "SUCCESS") {
            if (this.ipcID == "") {
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
            this.getIPC();
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

  openPDFFile() {
    window.open(this.imageUrl);
  }

  edit(obj) {
    this.image = undefined;
    this.imgFile = undefined;
    this.selectedFile = null;
    this.imageUrl = "../../../../../assets/IPCRefImg/dropHereImg.png";

    this.lblFileName = "";
    this.heading = "Edit";

    this.ipcID = obj.ipcRefID;
    this.cmbProject = obj.projectID;
    this.txtPkgNo = obj.projectPackage;
    this.txtIPCNo = obj.ipcNo;
    this.txtIpcDesc = obj.ipcRefDescription;

    if (
      obj.edoc ==
      "C:/inetpub/wwwroot/FAR/FAR_Project/assets/IPCRefImg/" +
        obj.ipcRefID +
        ".pdf"
    ) {
      this.imageUrl =
      // "http://192.168.100.162:7000/assets/IPCRefImg/" + obj.ipcRefID + ".pdf";
      "http://125.209.107.137:7000/assets/IPCRefImg/" + obj.ipcRefID + ".pdf";
    }
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
            IPCRefID: obj.ipcRefID,
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "sudipcref", saveData, {
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
                this.getIPC();
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
    this.disableProject = false;
    this.lblProjectName = "";
    this.lblFileName = "";
    this.ipcID = "";
    this.txtPkgNo = "";
    this.txtIPCNo = "";
    this.txtIpcDesc = "";
    this.searchProject = "";
    this.tblSearch = "";

    this.image = undefined;
    this.imgFile = undefined;
    this.selectedFile = null;
    this.imageUrl = "../../../../../assets/IPCRefImg/dropHereImg.png";
  }

  clearAll() {
    this.disableProject = false;
    this.ipcList = this.tempList;
    this.lblProjectName = "";
    this.lblFileName = "";
    this.ipcID = "";
    this.cmbProject = "";
    this.txtPkgNo = "";
    this.txtIPCNo = "";
    this.txtIpcDesc = "";
    this.searchProject = "";
    this.tblSearch = "";

    this.image = undefined;
    this.imgFile = undefined;
    this.selectedFile = null;
    this.imageUrl = "../../../../../assets/IPCRefImg/dropHereImg.png";
  }

  saveDetail() {
    if (this.cmbAssetCat == "") {
      this.toastr.errorToastr("Please Select Asset Cateogry", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtQty == "") {
      this.toastr.errorToastr("Please Enter Quantity", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtDesc == "") {
      this.toastr.errorToastr("Please Enter Description", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.modalLoadingBar = true;
      var saveData;
      if (this.ipcDetailID == "") {
        saveData = {
          IPCRefID: this.ipcID,
          AssetCatID: parseInt(this.cmbAssetCat),
          Qty: this.txtQty,
          Description: this.txtDesc,
          IPCRefDescription: this.txtIpcDesc,
          IPCRefDetailID: 0,
          userId: this.cookie.get("userID"),
          spType: "INSERT",
        };
      } else {
        saveData = {
          IPCRefID: this.ipcID,
          AssetCatID: parseInt(this.cmbAssetCat),
          Qty: this.txtQty,
          Description: this.txtDesc,
          IPCRefDescription: this.txtIpcDesc,
          IPCRefDetailID: this.ipcDetailID,
          userId: this.cookie.get("userID"),
          spType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudipcrefdetail", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "SUCCESS") {
            if (this.ipcDetailID == "") {
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
            this.getIPCDetail(this.ipcID);
            this.clearDetail();
            this.modalLoadingBar = false;
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            this.modalLoadingBar = false;
            return false;
          }
        });
    }
  }

  editDetail(obj) {
    this.cmbAssetCat = obj.assetCatID;
    this.ipcID = obj.ipcRefID;
    this.txtQty = obj.qty;
    this.txtDesc = obj.description;
    this.ipcDetailID = obj.ipcRefDetailID;

    var accCat = this.AssetCatList.filter(
      (x) => x.assetCatID == obj.assetCatID
    );
    this.lblAccCategory = accCat[0].accountsCatagory;
  }

  deleteDetail(obj) {
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
          this.modalLoadingBar = true;
          var saveData = {
            Userid: this.cookie.get("userID"), //int
            SpType: "DELETE", //string
            IPCRefDetailID: obj.ipcRefDetailID,
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "sudipcrefdetail", saveData, {
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
                this.clearDetail();
                this.getIPCDetail(obj.ipcRefID);
                this.modalLoadingBar = false;
                return false;
              } else {
                this.toastr.errorToastr(data.msg, "Error !", {
                  toastTimeout: 5000,
                });
                this.modalLoadingBar = false;
                return false;
              }
            });
        }
      });
    }, 1000);
  }

  clearDetail() {
    this.cmbAssetCat = "";
    this.lblAccCategory = "";
    this.txtQty = "";
    this.txtDesc = "";
    this.tblSearchDetail = "";
    // this.ipcDetailList = this.tempDetailList;
  }

  genPin(obj, param) {
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
            if (this.paramType == "edit") {
              this.edit(this.objList);
            } else if (this.paramType == "delete") {
              this.delete(this.objList);
            } else if (this.paramType == "editDetail") {
              this.editDetail(this.objList);
            } else if (this.paramType == "deleteDetail") {
              this.deleteDetail(this.objList);
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

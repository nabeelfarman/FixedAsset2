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
  selector: "app-asset-category",
  templateUrl: "./asset-category.component.html",
  styleUrls: ["./asset-category.component.scss"],
})
export class AssetCategoryComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2007/api/";

  // imgPath = "D:/Flutter App/FixedAssets/src/assets/assetCatImg";
  imgPath = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetCatImg";
  imageUrl: string = "../../../../../assets/assetCatImg/dropHereImg.png";
  image;
  imgFile;
  selectedFile: File = null;

  heading = "Add";

  loadingBar = true;

  lblSpecDetailID = 0;
  lblAssetCatID = 0;
  lblSpecID = 0;
  lblMakeID = 0;
  lblAssetCatName = "";
  txtPin = "";
  assetCatID = "";
  txtCatShrtName = "";
  txtCatFullName = "";
  txtSpecTitle = "";
  txtTitle = "";

  cmbAccCategory = "";
  cmbSpec = "";
  cmbType = "";

  lblDepRule = "";
  lblBaseRate = "";

  searchAccCat = "";
  tblSearch = "";
  searchSpec = "";

  assetCatList = [];
  tempList = [];
  accCatList = [];
  specList = [];
  specDetailList = [];
  specDataList = [];
  typeList = [
    { typeID: "DD", typeName: "Drop Down" },
    { typeID: "TB", typeName: "TextBox" },
  ];

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
    this.getAssetCategory();
    this.getAccountCategory();
    this.getAssetsSpecificationsList();
  }

  onFileSelected(event) {
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/jpeg"
    ) {
      this.selectedFile = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.image = reader.result;

        var splitImg = this.image.split(",")[1];
        this.image = splitImg;
        this.imageUrl = e.target.result;
      };

      reader.readAsDataURL(this.selectedFile);
    } else {
      this.toastr.errorToastr("Please Select JPEG / PNG Image", "Error", {
        toastTimeout: 2500,
      });

      this.image = undefined;
      this.imgFile = undefined;
      this.selectedFile = null;
      this.imageUrl = "../../../../../assets/assetCatImg/dropHereImg.png";
    }
  }

  getAccCatDescription(accCatID) {
    if (this.cmbAccCategory != "" || this.cmbAccCategory != undefined) {
      var assetCat = this.accCatList.filter((x) => x.accountsCatID == accCatID);
      this.lblDepRule = assetCat[0].depreciationRule;
      this.lblBaseRate = assetCat[0].baseRate;
    }
  }

  zoomImage() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = document.getElementById("myImg");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");

    if (this.imageUrl == "../../../../../assets/assetCatImg/dropHereImg.png") {
      this.toastr.errorToastr("Please Select Image", "Error", {
        toastTimeout: 2500,
      });
    } else {
      modal.style.display = "block";
      (<HTMLImageElement>document.querySelector("#img01")).src = this.imageUrl;
    }
  }

  closeModal() {
    var modal = document.getElementById("myModal");

    modal.style.display = "none";
  }

  getAssetsSpecificationsList() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getAssetsSpecificationsList", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.specList = data;
      });
  }

  getAssetCatagoriesSpecifications(item) {
    this.lblAssetCatID = item;
    var catName = this.assetCatList.filter((x) => x.assetCatID == item);

    this.lblAssetCatName = catName[0].assetCatDescription;

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getAssetCatagoriesSpecifications?assetCatID=" +
          item,
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.specDetailList = data;
        $("#specsModal").modal("show");
      });
  }

  getAssetCatagoriesSpecificationDATA(assetCatID, specID) {
    this.lblAssetCatID = assetCatID;
    this.lblSpecID = specID;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getAssetCatagoriesSpecificationDATA?assetCatID=" +
          assetCatID +
          "&specID=" +
          specID,
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.specDataList = data;
        $("#specsDataModal").modal("show");
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
        this.tempList = data;
        if (this.cmbAccCategory != "") {
          this.assetCatList = this.assetCatList.filter(
            (x) => x.accountsCatID == this.cmbAccCategory
          );
        } else {
          this.assetCatList = data;
        }
        this.loadingBar = false;
      });
  }

  filterTable(accCat) {
    this.assetCatList = this.tempList;
    this.assetCatList = this.assetCatList.filter(
      (x) => x.accountsCatID == accCat
    );
  }

  getAccountCategory() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getaccountcat", { headers: reqHeader })
      // .get("getaccountcat", { headers: reqHeader })
      .subscribe((data: any) => {
        this.accCatList = data;
      });
  }

  save() {
    if (this.cmbAccCategory == "") {
      this.toastr.errorToastr("Please Select Account Category", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtCatShrtName == "") {
      this.toastr.errorToastr("Please Enter Category Short Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtCatFullName == "") {
      this.toastr.errorToastr("Please Enter Category Full Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;
      var path;
      if (this.image == undefined) {
        path = null;
      } else {
        path = this.imgPath;
      }

      if (this.assetCatID == "") {
        // alert("Account Category: " + parseInt(this.cmbAccCategory));
        // alert("Category Short Name: " + this.txtCatShrtName);
        // alert("Category Full Name: " + this.txtCatFullName);
        // alert("path: " + path);
        // alert("jpg");
        // alert("image: " + this.image);
        // // alert("Account Category ID: " + this.assetCatID);
        // alert("User ID: " + this.cookie.get("userID"));

        saveData = {
          accountsCatID: parseInt(this.cmbAccCategory),
          assetCatCode: this.txtCatShrtName,
          assetCatDescription: this.txtCatFullName,
          edoc: path,
          EDocExtension: "jpg",
          imgFile: this.image,
          assetCatID: 0,
          userId: this.cookie.get("userID"),
          spType: "INSERT",
        };
      } else {
        // alert("Account Category: " + parseInt(this.cmbAccCategory));
        // alert("Category Short Name: " + this.txtCatShrtName);
        // alert("Category Full Name: " + this.txtCatFullName);
        // alert("path: " + this.imgPath);
        // alert("jpg");
        // alert("image: " + this.image);
        // alert("Account Category ID: " + this.assetCatID);
        // alert("User ID: " + this.cookie.get("userID"));

        saveData = {
          accountsCatID: parseInt(this.cmbAccCategory),
          assetCatCode: this.txtCatShrtName,
          assetCatDescription: this.txtCatFullName,
          edoc: path,
          EDocExtension: "jpg",
          imgFile: this.image,
          assetCatID: this.assetCatID,
          userId: this.cookie.get("userID"),
          spType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudassetcatagory", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.assetCatID == "") {
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
            this.getAssetCategory();
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
    this.image = undefined;
    this.imgFile = undefined;
    this.selectedFile = null;
    this.imageUrl = "../../../../../assets/assetCatImg/dropHereImg.png";

    this.heading = "Edit";

    this.assetCatID = obj.assetCatID;
    this.txtCatShrtName = obj.assetCatCode;
    this.txtCatFullName = obj.assetCatDescription;
    this.cmbAccCategory = obj.accountsCatID;

    this.lblDepRule = obj.depreciationRule;
    this.lblBaseRate = obj.baseRate;
    if (
      obj.edoc != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetCatImg" ||
      obj.edoc != null
    ) {
      // http://ambit-erp.southeastasia.cloudapp.azure.com:9000/assets/images/Marker2.png
      // this.imageUrl = "obj.edoc";
      this.imageUrl =
      // "http://192.168.100.162:7000/assets/assetCatImg/" +
      "http://125.209.107.137:7000/assets/assetCatImg/" +
        obj.assetCatID +
        ".jpg";
    }
    this.image = null;
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
            AssetCatID: obj.assetCatID,
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "sudassetcatagory", saveData, {
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
                this.getAssetCategory();
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
    // alert(obj.isActivated);
    if (obj.isActivated == true) {
      setTimeout(() => (this.assetCatList[this.index].isActivated = false), 10);
      type = "DEACTIVATE";
    } else {
      setTimeout(() => (this.assetCatList[this.index].isActivated = true), 10);
      type = "ACTIVATE";
    }

    // this.loadingBar = true;

    var saveData = {
      Userid: this.cookie.get("userID"), //int
      SpType: type, //string
      AssetCatID: obj.assetCatID,
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.app.serverUrl + "sudassetcatagory", saveData, {
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
          // this.clear();
          this.getAssetCategory();
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

  clear() {
    this.heading = "Add";

    this.assetCatID = "";
    this.txtCatShrtName = "";
    this.txtCatFullName = "";

    this.lblDepRule = "";
    this.lblBaseRate = "";

    this.searchAccCat = "";
    this.tblSearch = "";
    this.image = undefined;
    this.imgFile = undefined;
    this.selectedFile = null;
    this.imageUrl = "../../../../../assets/assetCatImg/dropHereImg.png";
  }

  clearAll() {
    this.heading = "Add";

    this.assetCatList = this.tempList;
    this.assetCatID = "";
    this.txtCatShrtName = "";
    this.txtCatFullName = "";
    this.cmbAccCategory = "";

    this.lblDepRule = "";
    this.lblBaseRate = "";

    this.searchAccCat = "";
    this.tblSearch = "";
    this.image = undefined;
    this.imgFile = undefined;
    this.selectedFile = null;
    this.imageUrl = "../../../../../assets/assetCatImg/dropHereImg.png";
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
        // alert(this.objList[0].isActivated);
        // setTimeout(this.sld)
        if (obj.isActivated == false) {
          setTimeout(() => (this.assetCatList[i].isActivated = true), 10);
        } else {
          setTimeout(() => (this.assetCatList[i].isActivated = false), 10);
        }
      }
      $("#genPinModal").modal("show");
    } else {
      if (obj.isActivated == false) {
        setTimeout(() => (this.assetCatList[i].isActivated = true), 10);
      } else {
        setTimeout(() => (this.assetCatList[i].isActivated = false), 10);
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

  saveSpec() {
    if (this.cmbSpec == "") {
      this.toastr.errorToastr("Please Select Specification", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtSpecTitle == "") {
      this.toastr.errorToastr("Please Enter Specification Title", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbType == "") {
      this.toastr.errorToastr("Please Select Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;
      var spType = "Insert";
      if (this.lblSpecDetailID != 0) {
        spType = "Update";
      }

      saveData = {
        specID: parseInt(this.cmbSpec),
        assetCatID: this.lblAssetCatID,
        specificationTitle: this.txtSpecTitle,
        type: this.cmbType,
        userID: this.cookie.get("userID"),
        specDetailID: this.lblSpecDetailID,
        spType: spType,
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudAssetCatSpecDetail", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.lblSpecDetailID == 0) {
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
            this.clearSpec();
            this.getAssetCatagoriesSpecifications(this.lblAssetCatID);
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

  editSpec(item) {
    this.cmbType = item.type;
    this.cmbSpec = item.specID;
    this.txtSpecTitle = item.specificationTitle;
    this.lblSpecDetailID = item.specDetailID;
    this.lblAssetCatID = item.assetCatID;
  }

  deleteSpec(item) {
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
            specDetailID: item.specDetailID,
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "sudAssetCatSpecDetail", saveData, {
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
                this.clearSpec();
                this.getAssetCatagoriesSpecifications(item.assetCatID);
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

  clearSpec() {
    this.cmbType = "";
    this.cmbSpec = "";
    this.txtSpecTitle = "";
    this.txtTitle = "";
    this.lblSpecDetailID = 0;
  }

  clearAllSpec() {
    this.cmbType = "";
    this.cmbSpec = "";
    this.txtSpecTitle = "";
    this.txtTitle = "";
    this.lblSpecDetailID = 0;
    this.lblAssetCatID = 0;
  }

  saveSpecData() {
    if (this.txtTitle == "") {
      this.toastr.errorToastr("Please Enter Title", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;
      var spType = "Insert";
      if (this.lblMakeID != 0) {
        spType = "Update";
      }

      saveData = {
        specID: this.lblSpecID,
        assetCatID: this.lblAssetCatID,
        specificationTitle: this.txtTitle,
        userID: this.cookie.get("userID"),
        makeID: this.lblMakeID,
        spType: spType,
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "sudAssetCatSpecData", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.lblMakeID == 0) {
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
            this.txtTitle = "";
            this.lblMakeID = 0;
            this.getAssetCatagoriesSpecificationDATA(
              this.lblAssetCatID,
              this.lblSpecID
            );
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

  editSpecData(item) {
    this.txtTitle = item.makeTitle;
    this.lblMakeID = item.makeID;
  }

  deleteSpecData(item) {
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
            makeID: item.makeID,
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "sudAssetCatSpecData", saveData, {
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
                this.txtTitle = "";
                this.lblMakeID = 0;
                this.getAssetCatagoriesSpecificationDATA(
                  item.assetCatID,
                  item.specID
                );
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
}

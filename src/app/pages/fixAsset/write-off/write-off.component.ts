import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserIdleService } from 'angular-user-idle';
import { ToastrManager } from 'ng6-toastr-notifications';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppComponent } from '../../../app.component';

declare var $: any;

@Component({
  selector: 'app-write-off',
  templateUrl: './write-off.component.html',
  styleUrls: ['./write-off.component.scss']
})
export class WriteOffComponent implements OnInit {

  loadingBar = true;

  toggleView = "form";
  assetToggleView = "form";
  
  //Search Model
  txtSearchData:string="";
  txtSearchLocation:string="";

  txtSearchAsset:string="";

  wOffDate = new Date();
  refDate:string="";
  
  dateOfPurchase = new Date();
  writeOffID=0;
  empID=0;

  //dropDown model
  ddlLocation:string="";
  ddlInquiry:string="";
  ddlWOAppBy:string="";

  ddlAssets:string="";
  ddlDesignation:string="";

  //Textbox Model
  txtLossDesc:string="";
  txtTotalLoss:string="";
  txtInqRemarks:string="";
  txtAmountApp:string="";
  txtLossRec:string="";
  txtRefNo:String="";
  txtRemarks:string="";
  
  
    //pin variables
    txtPin:string = "";
    paramType:string = "";
    objList = [];
    index = 0;

  assetDetailID = 0;
  lblAssets:string = "";
  txtDescription:string="";
  txtAllocation:string="";
  txtCOAsset=0;
  txtDepCharge=0;
  txtBookValue=0;
  txtRevalAmount=0;
  txtResValue=0;
  txtLossApp=0;
  txtTotLossShr=0;
  txtEmpName:string="";
  txtLossValueShr=0;
  txtDetRemarks:string="";
  totalLossAmount = 0;

  rdbAssetsType:string="V";

  disDepChrg:boolean=false;
  disBookVal:boolean=false;
  disRevalAmount:boolean=false;

  imgAssetPath3 = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg";
  imageAssetUrl: string = "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageAssetUrl2: string = "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageAssetUrl3: string = "../../../../../assets/assetEntryImg/dropHereImg.png";

  filePicker = '';
  selectedFile: File = null;
  file;

  filePickerApproved = '';
  selectedFileApproved: File = null;
  fileApproved;

  //List
  writeOffList=[];
  writeOffDetailList=[];
  locationList=[];
  inquiryList=[];
  approvedList=[];

  assetsForWriteOffList=[];
  designationList=[];
  empList=[];

  constructor(
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService,
    private toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent
  ) { }

  ngOnInit(): void {
    this.getLocation();
    this.getPost();
    this.getWriteOff();
    this.getEmpDetail();
  }

  toggleViewClick() {
    if (this.toggleView == "table") {
        this.toggleView = "form";
    } else {
        this.toggleView = "table";
    }
  }

  assetToggleViewClick() {
    if (this.assetToggleView == "table") {
        this.assetToggleView = "form";
    } else {
        this.assetToggleView = "table";
    }
  }

  getWriteOff() {
    
    var reqHeader = new HttpHeaders({"Content-Type": "application/json",});
    this.http.get(this.app.serverUrl + "getWriteOffList", { headers: reqHeader }).subscribe((data: any) => {            
        this.writeOffList = data;
        this.loadingBar = false;
    });
  }

  getWriteOffDetail() {
    
    var reqHeader = new HttpHeaders({"Content-Type": "application/json",});
    this.http.get(this.app.serverUrl + "getWriteOffDetailList?writeOffID=" + this.writeOffID, { headers: reqHeader }).subscribe((data: any) => {            
        this.writeOffDetailList = data;
        this.loadingBar = false;
    });
  }

  getLocation() {
    // debugger;
      var reqHeader = new HttpHeaders({"Content-Type": "application/json",});
      if (this.cookie.get("roleName") == "Super User") {
              this.http.get(this.app.serverUrl + "getsubloc", { headers: reqHeader }).subscribe((data: any) => {
              this.locationList = data;
              this.loadingBar = false;
          });
      } else {
              this.http.get(this.app.serverUrl + "getuserLocation?userId=" + this.cookie.get("userID"), { headers: reqHeader }).subscribe((data: any) => {
              this.locationList = data;
              this.loadingBar = false;
          });
      }
  }

  getPost() {
      var reqHeader = new HttpHeaders({"Content-Type": "application/json",});
              this.http.get(this.app.serverUrl + "getposts?IsActivated=0", { headers: reqHeader }).subscribe((data: any) => {
              this.inquiryList = data;
              this.approvedList = data;
              this.designationList = data;
              this.loadingBar = false;
          });
  }

  getEmpDetail() {
    
    var reqHeader = new HttpHeaders({"Content-Type": "application/json",});
    this.http.get(this.app.serverUrl + "getEmpDetail?userID=" + this.cookie.get('userID'), { headers: reqHeader }).subscribe((data: any) => {            
        this.empList = data;

        if(data.length>0){
          for(var i = 0; i < data.length; i++){
            this.totalLossAmount+=data[i].valueofLossShare;
          }
        }
        this.loadingBar = false;
    });
}
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    let reader = new FileReader();

    reader.onloadend = (e) => {
    this.file = reader.result;

    var splitFile = this.file.split(',')[1];
    this.file = splitFile;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  fileChange() {
          var fileName = $('#customFile5').val().split('\\').pop();
          $('#customFile5').siblings('.custom-file-label').addClass('selected').html(fileName);
  }


  onFileSelectedApproved(event) {
    this.selectedFileApproved = <File>event.target.files[0];
    let reader = new FileReader();

    reader.onloadend = (e) => {
    this.fileApproved = reader.result;

    var splitFile = this.fileApproved.split(',')[1];
    this.fileApproved = splitFile;
    };

    reader.readAsDataURL(this.selectedFileApproved);
  }

  fileChangeApproved() {
          var fileName = $('#customFile6').val().split('\\').pop();
          $('#customFile6').siblings('.custom-file-label').addClass('selected').html(fileName);
  }

  save(){
    
    if (this.wOffDate == undefined || this.wOffDate == null) {
      this.toastr.errorToastr('Please Enter Write Off Date', 'Error !', {toastTimeout: 2500,});
      return false;
    } else if (this.ddlLocation == undefined || this.ddlLocation == '') {
      this.toastr.errorToastr('Please Select Location', 'Error !', {toastTimeout: 2500,});
      return false;
    } else if (this.txtLossDesc == undefined || this.txtLossDesc.trim() == '') {
      this.toastr.errorToastr('Please Enter loss Description', 'Error !',{ toastTimeout: 2500 });
      return false;
    } else if (this.txtTotalLoss == undefined || this.txtTotalLoss.toString() == '') {
      this.toastr.errorToastr('Please Enter Total Loss', 'Error !', {toastTimeout: 2500,});
      return false;
    } else if (this.ddlInquiry == undefined || this.ddlInquiry == '') {
      this.toastr.errorToastr('Please Select Inquiry Conducted by', 'Error !', {toastTimeout: 2500,});
      return false;
    } else if (this.txtInqRemarks == undefined || this.txtInqRemarks.toString() == '') {
      this.toastr.errorToastr('Please Enter Inquiry Remarks', 'Error !', {toastTimeout: 2500,});
      return false;
    } else if (this.ddlWOAppBy == undefined || this.ddlWOAppBy == '') {
      this.toastr.errorToastr('Please Select WriteOff Approved By', 'Error !', {toastTimeout: 2500,});
      return false;
    } else if (this.txtAmountApp == undefined || this.txtAmountApp.toString() == '') {
      this.toastr.errorToastr('Please Enter Amount Approved', 'Error !', {toastTimeout: 2500,});
      return false;
    } else if (this.txtLossRec == undefined || this.txtLossRec.toString() == '') {
      this.toastr.errorToastr('Please Enter Loss To Recover', 'Error !', {toastTimeout: 2500,});
      return false;
    } else{
      
      
      var wODate = this.app.convertDate(this.wOffDate);
            
      var inqFilePath = null;
      if (this.file != undefined) {
          inqFilePath = this.filePicker;
      }

      var appFilePath = null;
      if (this.fileApproved != undefined) {
          appFilePath = this.filePickerApproved;
      }

      var fileNameExt = this.filePicker.substr(
          this.filePicker.lastIndexOf('.') + 1
      );

      var appFileNameExt = this.filePickerApproved.substr(
          this.filePickerApproved.lastIndexOf('.') + 1
      );

      var inqFPath = 'C:/inetpub/wwwroot/FAR/FAR_Project/assets/Inquiry';
      var appFPath = 'C:/inetpub/wwwroot/FAR/FAR_Project/assets/ApprovedWriteOff';


      var reqSpType = 'Insert';
      if (this.writeOffID > 0) {
          reqSpType = 'Update';
      }
      
      var SaveData = {

        WriteOffID: this.writeOffID,
        LossDate: wODate,
        SubLocID: this.ddlLocation,
        DescriptionofLoss: this.txtLossRec,
        ValueofLoss: this.txtTotalLoss,
        PostID: this.ddlInquiry,
        InquiryRemarks: this.txtInqRemarks,
        InquiryEdoc: inqFPath,
        InquiryEDocExtension: fileNameExt,
        InquiryImgFileImgFile: this.file,
        AuthorityApprovedWriteOff: this.ddlWOAppBy,
        WriteOffAmountApproved: this.txtAmountApp,
        ValueofLossToRecover: this.txtLossRec,
        ApprovalEDocExtension: appFileNameExt,
        ApprovalEdoc: appFPath,
        ApprovedImgFile: this.fileApproved,
        ReferenceNo: this.txtRefNo,
        ReferenceDate: this.refDate,
        Remarks: this.txtRemarks,
        Userid: this.cookie.get('userID'),
        SpType: reqSpType
      };

      this.loadingBar = true;
      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });


      this.http.post(this.app.serverUrl + 'saveWriteOff', SaveData, { headers: reqHeader }).subscribe((data: any) => {                

        if (data.msg == 'Success') {
            if (this.writeOffID == 0) {
                this.toastr.successToastr('Record Saved Successfully!','Success!',{ toastTimeout: 2500 });
                this.loadingBar = false;
            } else {
                this.toastr.successToastr('Record Updated Successfully!','Success!',{ toastTimeout: 2500 });
                this.loadingBar = false;
            }
            //this.clear();
            this.writeOffID = data.id;
            this.getWriteOff();
            // this.getAssetsForDisposal();
            return false;
        } else {
            this.toastr.errorToastr(data.msg, 'Error !', {toastTimeout: 5000,});
            this.loadingBar = false;
            return false;
        }
      });
    }
  }

  edit(item){
    this.writeOffID = item.writeOffID;
    this.wOffDate = new Date(item.lossDate);
    this.txtLossDesc = item.descriptionofLoss;
    this.txtTotalLoss = item.valueofLoss;
    // this.ddlInquiry = item.inquiryOfficer;
    this.txtInqRemarks = item.inquiryRemarks;
    // this.ddlWOAppBy = item.inquiryOfficer;
    this.txtAmountApp = item.writeOffAmountApproved;
    this.txtLossRec = item.valueofLossToRecover;
    this.ddlLocation = item.subLocID;
    
    this.toggleView = 'form';

    this.getWriteOffDetail();
  }

  delete(item){
    setTimeout(() => {
      Swal.fire({
          title: 'Do you want to delete?',
          text: '',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
      }).then((result) => {
          if (result.value) {
              this.loadingBar = true;
  
              var SaveData = {
                  WriteOffID: item.writeOffID,
                  Userid: this.cookie.get('userID'),
                  SpType: 'Delete',
              };
  
              var reqHeader = new HttpHeaders({'Content-Type': 'application/json',});
  
              this.http.post(this.app.serverUrl + 'saveWriteOff', SaveData, {headers: reqHeader,}).subscribe((data: any) => {
                  if (data.msg == 'Success') {
                      this.toastr.successToastr('Record Deleted Successfully!','Success!',{ toastTimeout: 2500 });
                      this.clear();
                      this.getWriteOff();
                      this.toggleView = 'form';
                      return false;
                  } else {
                      this.toastr.errorToastr(data.msg, 'Error !', {toastTimeout: 5000,});
                      this.loadingBar = false;
                      return false;
                  }
              });
          }
      });
    }, 1000);
  }

  clear(){}

  
  changeAssetType() {
      
    this.ddlAssets = '';
    this.clearDetail();
    this.getAssetWriteOff();
    
  }

  getAssetWriteOff() {
    
    var reqHeader = new HttpHeaders({"Content-Type": "application/json",});
    this.http.get(this.app.serverUrl + "getAssetWriteOff?LocId=" + this.ddlLocation + "&VehicleId=" + this.rdbAssetsType, { headers: reqHeader }).subscribe((data: any) => {            
        this.assetsForWriteOffList = data;
        this.loadingBar = false;
    });
}

  clearDetail(){

  }

    filterAssetDetail(reqAssetId) {

        this.imageAssetUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";
        this.imageAssetUrl2 = "../../../../../assets/assetEntryImg/dropHereImg.png";
        this.imageAssetUrl3 = "../../../../../assets/assetEntryImg/dropHereImg.png";

        var tempList = this.assetsForWriteOffList.filter((x) => x.assetID == reqAssetId);

        if (tempList.length > 0) {
            this.txtDescription = tempList[0].assetDescription;
            this.txtAllocation = tempList[0].projectName;

            if(tempList[0].costAmount != 0){
                this.txtCOAsset = tempList[0].costAmount;
            }

            if(tempList[0].accDepreciationCost != 0 && tempList[0].accDepreciationCost != undefined){
                this.txtDepCharge = tempList[0].accDepreciationCost;
                this.disDepChrg = true;
            }
            
            if(tempList[0].netBookAmount != 0 && tempList[0].netBookAmount != undefined){
                this.txtBookValue = tempList[0].netBookAmount;
                this.disBookVal = true;
            } 
            if(tempList[0].revaluedAmount != 0 && tempList[0].revaluedAmount != undefined){
                this.txtRevalAmount = tempList[0].revaluedAmount;
                this.disRevalAmount = true;
            }
            
            
            if (
                tempList[0].edoc != null &&
                tempList[0].edoc != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
            ) {
                this.imageAssetUrl =
                "http://125.209.107.137:7000/assets/assetEntryImg/" +
                tempList[0].assetID +
                "_1.jpg";
            }
            if (
                tempList[0].edoc2 != null &&
                tempList[0].edoc2 != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
            ) {
                this.imageAssetUrl2 =
                "http://125.209.107.137:7000/assets/assetEntryImg/" +
                tempList[0].assetID +
                "_2.jpg";
            }
            if (
                tempList[0].edoc3 != null &&
                tempList[0].edoc3 != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
            ) {
                this.imageAssetUrl3 =
                "http://125.209.107.137:7000/assets/assetEntryImg/" +
                tempList[0].assetID +
                "_3.jpg";
            }
          
        }
        
    }

    saveEmployee(){
      if (this.txtEmpName == undefined || this.txtEmpName.trim() == '') {
        this.toastr.errorToastr('Please Enter Employee Name', 'Error !',{ toastTimeout: 2500 });
        return false;
      } else if (this.ddlDesignation == undefined || this.ddlDesignation == '') {
        this.toastr.errorToastr('Please Select LocatioDesignation', 'Error !', {toastTimeout: 2500,});
        return false;
      } else if (this.txtLossValueShr == undefined || this.txtLossValueShr.toString() == '') {
        this.toastr.errorToastr('Please Enter Value of Loss Share', 'Error !', {toastTimeout: 2500,});
        return false;
      } else{

        var reqSpType = 'Insert';
        if (this.empID > 0) {
            reqSpType = 'Update';
        }
        
        var SaveData = {
  
          ID: this.empID,
          Name: this.txtEmpName,
          PostID: this.ddlDesignation,
          ValueofLossShare: this.txtLossValueShr,
          Remarks: this.txtDetRemarks,
          UserId: this.cookie.get('userID'),
          SpType: reqSpType
        };
  
        this.loadingBar = true;
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  
        this.http.post(this.app.serverUrl + 'saveEmployee', SaveData, { headers: reqHeader }).subscribe((data: any) => {                
  
          if (data.msg == 'Success') {
              if (this.empID == 0) {
                  this.toastr.successToastr('Record Saved Successfully!','Success!',{ toastTimeout: 2500 });
                  this.loadingBar = false;
              } else {
                  this.toastr.successToastr('Record Updated Successfully!','Success!',{ toastTimeout: 2500 });
                  this.loadingBar = false;
              }
              this.clearEmployee();
              this.getEmpDetail();
              return false;
          } else {
              this.toastr.errorToastr(data.msg, 'Error !', {toastTimeout: 5000,});
              this.loadingBar = false;
              return false;
          }
        });
      }
    }

    editEmployee(item){
    
      this.empID = item.id;
      this.txtEmpName = item.name;
      this.ddlDesignation = item.postID.toString();
      this.txtDetRemarks = item.remarks;
      this.txtLossValueShr = item.valueofLossShare;
      
    }
    
    deleteEmployee(item) {
      setTimeout(() => {
          Swal.fire({
              title: 'Do you want to delete?',
              text: '',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
          }).then((result) => {
              if (result.value) {
                  this.loadingBar = true;
      
                  var SaveData = {
                      ID: item.id,
                      Userid: this.cookie.get('userID'),
                      SpType: 'Delete',
                  };
      
                  var reqHeader = new HttpHeaders({'Content-Type': 'application/json',});
      
                  this.http.post(this.app.serverUrl + 'saveEmployee', SaveData, {headers: reqHeader,}).subscribe((data: any) => {
                      if (data.msg == 'Success') {
                          this.toastr.successToastr('Record Deleted Successfully!','Success!',{ toastTimeout: 2500 });
                          this.clearEmployee();
                          this.getEmpDetail();
                          return false;
                      } else {
                          this.toastr.errorToastr(data.msg, 'Error !', {toastTimeout: 5000,});
                          this.loadingBar = false;
                          return false;
                      }
                  });
              }
          });
      }, 1000);
  }
  
  clearEmployee(){

    this.txtEmpName = "";
    this.ddlDesignation = "";
    this.txtDetRemarks = "";
    this.txtLossValueShr = 0;
    this.empID = 0;
  
  }

  saveDetail(){
    
    if (this.ddlAssets == undefined || this.ddlAssets == null) {
      this.toastr.errorToastr('Please Select Asset', 'Error !', {toastTimeout: 2500,});
      return false;
    } else if (this.txtCOAsset == undefined || this.txtCOAsset.toString() == '') {
      this.toastr.errorToastr('Please Enter Cost of Asset', 'Error !', {toastTimeout: 2500,});
      return false;
    }  else if (this.txtDepCharge == undefined || this.txtDepCharge.toString() == '') {
      this.toastr.errorToastr('Please Enter Depreciation Charged', 'Error !',{ toastTimeout: 2500 });
      return false;
    } else if (this.txtBookValue == undefined || this.txtBookValue.toString() == '') {
      this.toastr.errorToastr('Please Enter Book Value', 'Error !', {toastTimeout: 2500,});
      return false;
    } else if (this.txtRevalAmount == undefined || this.txtRevalAmount.toString() == '') {
      this.toastr.errorToastr('Please Enter Revalued Amount', 'Error !', {toastTimeout: 2500,});
      return false;
    }  else if (this.txtResValue == undefined || this.txtResValue.toString() == '') {
      this.toastr.errorToastr('Please Enter Reserved Price', 'Error !', {toastTimeout: 2500,});
      return false;
    }  else if (this.txtResValue == undefined ||this.txtResValue.toString() == '') {
      this.toastr.errorToastr('Please Enter Value of Loss Approved', 'Error !', {toastTimeout: 2500,});
      return false;
    } else if (this.txtTotLossShr == undefined || this.txtTotLossShr.toString() == '') {
        this.toastr.errorToastr('Please Enter Total Value of Loss Share', 'Error !', {toastTimeout: 2500,});
        return false;
    }else if (this.txtTotLossShr != this.totalLossAmount) {
        this.toastr.errorToastr('Total Loss Share & Loss b/w Employees not Equal', 'Error !', {toastTimeout: 2500,});
        return false;
    } else {

      var reqSpType = 'Insert';
      if (this.assetDetailID > 0) {
          reqSpType = 'Update';
      }

      var SaveData = {

        WriteOffID: this.writeOffID,
        AssetID: this.ddlAssets,
        ValofLossApp: this.txtLossApp,
        TotValofLossShr: this.txtTotLossShr,
        ResPrice: this.txtResValue,
        UserId: this.cookie.get('userID'),
        // Remarks: reqRemarks,
        SpType: reqSpType,
        AssetDetID: this.assetDetailID,
    };

    this.loadingBar = true;
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(this.app.serverUrl + 'saveWriteOffDetail', SaveData, { headers: reqHeader }).subscribe((data: any) => {
            if (data.msg == 'Success') {
                if (this.assetDetailID == 0) {
                    this.toastr.successToastr('Record Saved Successfully!','Success!',{ toastTimeout: 2500 });
                    this.loadingBar = false;
                } else {
                    this.toastr.successToastr('Record Updated Successfully!','Success!',{ toastTimeout: 2500 });
                    this.loadingBar = false;
                }
                this.clearDetail();
                this.getWriteOffDetail();
                return false;
            } else {
                this.toastr.errorToastr(data.msg, 'Error !', {toastTimeout: 5000,});
                this.loadingBar = false;
                return false;
            }
        });
    }
  }

  editDetail(item){

    this.assetDetailID = item.assetWriteOffDetail;
    this.lblAssets = item.tag + " - " + item.assetDescription + " - " + item.assetLocation;
    this.ddlAssets = item.assetID.toString();
    this.txtDescription = item.assetDescription;
    this.txtCOAsset = item.costAmount;
    this.dateOfPurchase = item.purchaseDate;
    this.txtAllocation = item.costAmount;
    this.txtDepCharge = item.accDepreciationonCost;
    this.txtBookValue = item.netBookAmount;
    this.txtRevalAmount = item.revaluedAmount;
    // this.txtResValue = item.costAmount;
    this.txtLossApp = item.valueofLossApproved;
    this.txtTotLossShr = item.valueofLossShare;

    if (item.eDoc != null && item.eDoc != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg") {
      this.imageAssetUrl =
      // "http://192.168.100.162:7000/assets/assetEntryImg/" +
      "http://125.209.107.137:7000/assets/assetEntryImg/" +
      item.assetID +
      "_1.jpg";
    }
    if (item.eDoc2 != null && item.eDoc2 != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg") {
        this.imageAssetUrl2 =
        // "http://192.168.100.162:7000/assets/assetEntryImg/" +
        "http://125.209.107.137:7000/assets/assetEntryImg/" + item.assetID + "_2.jpg";
    }
    if (item.eDoc3 != null && item.eDoc3 != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg") {
        this.imageAssetUrl3 =
        // "http://192.168.100.162:7000/assets/assetEntryImg/" +
        "http://125.209.107.137:7000/assets/assetEntryImg/" + item.assetID + "_3.jpg";
    }
    
    this.assetToggleView = 'form';

    // this.getWriteOffDetail();
  }


  deleteDetail(item){
    setTimeout(() => {
      Swal.fire({
          title: 'Do you want to delete?',
          text: '',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
      }).then((result) => {
          if (result.value) {
              this.loadingBar = true;
  
              var SaveData = {
                  AssetDetID: item.assetWriteOffDetail,
                  Userid: this.cookie.get('userID'),
                  SpType: 'Delete',
              };
  
              var reqHeader = new HttpHeaders({'Content-Type': 'application/json',});
  
              this.http.post(this.app.serverUrl + 'saveWriteOffDetail', SaveData, {headers: reqHeader,}).subscribe((data: any) => {
                  if (data.msg == 'Success') {
                      this.toastr.successToastr('Record Deleted Successfully!','Success!',{ toastTimeout: 2500 });
                      this.clearDetail();
                      this.getWriteOffDetail();
                      this.toggleView = 'form';
                      return false;
                  } else {
                      this.toastr.errorToastr(data.msg, 'Error !', {toastTimeout: 5000,});
                      this.loadingBar = false;
                      return false;
                  }
              });
          }
      });
    }, 1000);
  }

  genPin(obj, param, i) {
    if (this.cookie.get("pinstatus") == "true") {
      this.txtPin = "";
      this.paramType = "";
      this.objList = obj;
      this.paramType = param;
      this.index = i;

      $("#genPinModal").modal("show");
    } else {
      this.toastr.errorToastr("PIN Code is not allowed", "Error", {toastTimeout: 2500,});
      return false;
    }
  }

  allowUpdation() {

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

        this.http.post(this.app.serverUrl + "pincode", saveData, { headers: reqHeader }).subscribe((data: any) => {
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

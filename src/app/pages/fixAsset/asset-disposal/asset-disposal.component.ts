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
  selector: 'app-asset-disposal',
  templateUrl: './asset-disposal.component.html',
  styleUrls: ['./asset-disposal.component.scss']
})
export class AssetDisposalComponent implements OnInit {

    loadingBar = true;
    reqType = '';
    reqStatus = false;
    // serverUrl = "http://95.217.206.195:2007/api/";
    //serverUrl = "http://192.168.100.162:12345/api/";

    toggleView = "form";

    //pin variables
    txtPin = "";
    paramType = "";
    objList = [];
    index = 0;

    //accordian variable
    locationList = [];
    disposalDataList = [];
    assetsForDisposalDataList = [];
    disposalDetailList = [];

    step = 0;

    //fixAccountsCatID = 11;
    disposalID = 0;
    disposalPaymentID = 0;



    disAccDep:boolean=false;
    disBookVal:boolean=false;
    disRevalAmount:boolean=false;

    imgAssetPath3 = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg";
    imageAssetUrl: string = "../../../../../assets/assetEntryImg/dropHereImg.png";
    imageAssetUrl2: string = "../../../../../assets/assetEntryImg/dropHereImg.png";
    imageAssetUrl3: string = "../../../../../assets/assetEntryImg/dropHereImg.png";

    projectsList = [];
    projectsList2 = [];
    roadsList = [];
    landMeasurementList = [];
    landDataList = [];
    faDetailList = [];

    transactionList = [];
    tempTransactionList = [];

    txtSearchLandData = '';

    ddlAccSec = '';
    
    ddlTrailBalance = '';
    txtSearchTrailBalance = '';
    ddlProject = '';
    txtSearchProject = '';
    ddlLandMeasurement = '';
    //ddlLandMeasurement2 = '';
    ddlRoads = '';
    txtSearchRoads = '';

    aKanal = '';
    aMarla = '';
    purposeOfPurchase = '';
    
    
    amountPaid;



    filePicker = '';
    selectedFile: File = null;
    file;



    filePickerDetail = '';
    selectedFileDetail: File = null;
    fileDetail;



    //------------------ng modal variables -------Left side portion
    toDate = new Date();
    ddlLocation = '';
    txtSearchLocation = '';
    partyName = '';
    code = '';
    address = '';
    ntnNo = '';
    cnicNo = '';
    totalAmount = 0;
    taxAmount = 0;
    remarks = '';

    //------------------ng modal variables -------Right side portion
    rdbAssetsType  = "V";
    ddlAssets = '';
    txtSearchAsset = '';
    description = '';
    lblAssets = '';
    dateOfPurchase = new Date();
    costOfAsset = 0;
    allocation = ''
    accumlateDepreciation = 0;
    bookValue = 0;
    revaluedAmount = 0;
    disposalValue = 0;
    gainLoss = 0;
    reservePrice = 0;
    currentMarketValue = 0;
    remarksDetail = '';

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
        this.getDisposal();
        //this.getAssetsForDisposal();

        // this.getLandMeasurement();
        // this.getRoads();
        // this.getLandData();
        // this.getFaDetail();
    }


    toggleViewClick() {
        if (this.toggleView == "table") {
            this.toggleView = "form";
        } else {
            this.toggleView = "table";
        }
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

    getDisposal() {
        // debugger;
        var reqHeader = new HttpHeaders({"Content-Type": "application/json",});
        this.http.get(this.app.serverUrl + "assetdisposallist?userId=" + this.cookie.get("userID"), { headers: reqHeader }).subscribe((data: any) => {            
            this.disposalDataList = data;
            this.loadingBar = false;
        });
    }

    getAssetsForDisposal() {
        // debugger;
        // alert(this.rdbAssetsType)
        var reqHeader = new HttpHeaders({"Content-Type": "application/json",});
        this.http.get(this.app.serverUrl + "assetfordisposallist?LocId=" + this.ddlLocation + "&VehicleId=" + this.rdbAssetsType, { headers: reqHeader }).subscribe((data: any) => {            
            this.assetsForDisposalDataList = data;
            this.loadingBar = false;
        });
    }

    getDisposalDetail() {
        // debugger;
        var reqHeader = new HttpHeaders({"Content-Type": "application/json",});
        this.http.get(this.app.serverUrl + "disposaldetail?disposalid=" + this.disposalID, { headers: reqHeader }).subscribe((data: any) => {            
            this.disposalDetailList = data;
            this.loadingBar = false;
        });
    }

    
    

    save() {


        if (this.toDate == undefined || this.toDate == null) {
          this.toastr.errorToastr('Please Enter Date', 'Error !', {toastTimeout: 2500,});
          return false;
        }
        else if (this.ddlLocation == undefined || this.ddlLocation == '') {
          this.toastr.errorToastr('Please Select Location', 'Error !', {toastTimeout: 2500,});
          return false;
        } 
        else if (this.partyName == undefined || this.partyName.trim() == '') {
          this.toastr.errorToastr('Please Enter Party Name', 'Error !',{ toastTimeout: 2500 });
          return false;
        } 
        // else if (this.code == undefined || this.code.trim() == '') {
        //   this.toastr.errorToastr('Please Enter Code', 'Error !', {toastTimeout: 2500,});
        //   return false;
        // }
        else if (this.address == undefined || this.address.trim() == '') {
          this.toastr.errorToastr('Please Enter Address', 'Error !', {toastTimeout: 2500,});
          return false;
        } 
        else if ((this.ntnNo == undefined || this.ntnNo == '' || this.ntnNo.length < 8) && (this.cnicNo == undefined ||this.cnicNo == '' || this.cnicNo.length < 13)) {
          this.toastr.errorToastr('Please Enter NTN Or CNIC Number', 'Error !', {toastTimeout: 2500,});
          return false;
        } 
        // else if (this.cnicNo == undefined ||this.cnicNo == '' || this.cnicNo.length < 13) {
        //   this.toastr.errorToastr('Please Enter CNIC Number', 'Error !', {toastTimeout: 2500,});
        //   return false;
        // }
        else if (this.totalAmount == undefined || this.totalAmount.toString() == '') {
            this.toastr.errorToastr('Please Enter Total Amount', 'Error !', {toastTimeout: 2500,});
            return false;
        }
        else if (this.taxAmount == undefined || this.taxAmount.toString() == '') {
            this.toastr.errorToastr('Please Enter Tax Amount', 'Error !', {toastTimeout: 2500,});
            return false;
        }
        else {

            var reqRemarks = '-';
            if (this.remarks == undefined && this.remarks.trim() == '') {
                reqRemarks = this.remarks.trim();
            }
        
            var reqDate = this.app.convertDate(this.toDate);
            
            var filePath = null;
            if (this.file != undefined) {
                filePath = this.filePicker;
            }

            var fileNameExt = this.filePicker.substr(
                this.filePicker.lastIndexOf('.') + 1
            );

            var fPath = 'C:/inetpub/wwwroot/FAR/FAR_Project/assets/disposal';


            var reqSpType = 'Insert';
            if (this.disposalID > 0) {
                reqSpType = 'Update';
            }
            
            //alert(this.cookie.get('userID'));
            //return false;

            var SaveData = {

                DisposalID: this.disposalID,
                DisposalDate: reqDate,
                SubLocID: this.ddlLocation,
                PurchaserName: this.partyName.trim(),
                PartyCode: this.code,
                PurchaseAddress: this.address.trim(),
                PurchaserNTN: this.ntnNo,
                PurchaserCNIC: this.cnicNo,
                AmountPaid: this.totalAmount,
                TaxAmount: this.taxAmount,
                Remarks: reqRemarks,

                EDocExtension: fileNameExt,
                Edoc: fPath,
                //FilePath: fPath,
                imgFile: this.file,

                Userid: this.cookie.get('userID'),
                SpType: reqSpType

            };
        
            this.loadingBar = true;
            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
        
            this.http.post(this.app.serverUrl + 'suddisposal', SaveData, { headers: reqHeader }).subscribe((data: any) => {                

                if (data.msg == 'Success') {
                    if (this.disposalID == 0) {
                        this.toastr.successToastr('Record Saved Successfully!','Success!',{ toastTimeout: 2500 });
                        this.loadingBar = false;
                    } else {
                        this.toastr.successToastr('Record Updated Successfully!','Success!',{ toastTimeout: 2500 });
                        this.loadingBar = false;
                    }
                    //this.clear();
                    this.disposalID = data.id;
                    this.getDisposal();
                    this.getAssetsForDisposal();
                    return false;
                } else {
                    this.toastr.errorToastr(data.msg, 'Error !', {toastTimeout: 5000,});
                    this.loadingBar = false;
                    return false;
                }
            });
        }
    }
    
    clear() {

        this.disposalID = 0;
        this.ddlLocation = '';
        this.toDate = new Date();
        this.partyName = '';
        this.code = '';
        this.address = '';
        this.ntnNo = '';
        this.cnicNo = '';
        this.totalAmount = 0;
        this.taxAmount = 0;
        this.remarks = '';

        this.disposalDetailList = [];
        this.clearDetail();
        
        var fileName = 'E Document';
        $('#customFile5').siblings('.custom-file-label').addClass('selected').html(fileName); 

        this.filePicker = '';
        this.selectedFile = null;
        this.file = undefined;
    }
    
    edit(item) {
        this.disposalID = item.disposalID;
        this.ddlLocation = item.subLocID;
        this.toDate = new Date(item.disposalDate)
        this.partyName = item.purchaserName;
        this.code = item.partyCode;
        this.address = item.purchaserAddress;
        this.ntnNo = item.purchaserNTN;
        this.cnicNo = item.purchaserCNIC;
        this.totalAmount = item.amountPaid;
        this.taxAmount = item.taxPaid;
        this.remarks = item.remarks;
        
        this.toggleView = 'form';

        this.getAssetsForDisposal();
        this.getDisposalDetail();

    }
    
    delete(item) {
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
                        DisposalID: item.disposalID,
                        Userid: this.cookie.get('userID'),
                        SpType: 'Delete',
                    };
        
                    var reqHeader = new HttpHeaders({'Content-Type': 'application/json',});
        
                    this.http.post(this.app.serverUrl + 'suddisposal', SaveData, {headers: reqHeader,}).subscribe((data: any) => {
                        if (data.msg == 'Success') {
                            this.toastr.successToastr('Record Deleted Successfully!','Success!',{ toastTimeout: 2500 });
                            this.clear();
                            this.getDisposal();
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



    changeAssetType() {
      
        this.ddlAssets = '';
        //this.disposalPaymentID = 0;
        this.clearDetail();
        this.getAssetsForDisposal();
        
        // this.description = '';
        // this.costOfAsset = 0;
        // this.dateOfPurchase = new Date();
        // this.allocation = '';

    }





    saveDetail() {

        if (this.ddlAssets == undefined || this.ddlAssets == null) {
            this.toastr.errorToastr('Please Select Asset', 'Error !', {toastTimeout: 2500,});
            return false;
        }
        else if (this.costOfAsset == undefined || this.ddlLocation.toString() == '') {
          this.toastr.errorToastr('Please Enter Cost of Asset', 'Error !', {toastTimeout: 2500,});
          return false;
        } 
        else if (this.accumlateDepreciation == undefined || this.accumlateDepreciation.toString() == '') {
          this.toastr.errorToastr('Please Enter Accumlate Depreciation', 'Error !',{ toastTimeout: 2500 });
          return false;
        } 
        else if (this.bookValue == undefined || this.bookValue.toString() == '') {
          this.toastr.errorToastr('Please Enter Book Value', 'Error !', {toastTimeout: 2500,});
          return false;
        }
        else if (this.revaluedAmount == undefined || this.revaluedAmount.toString() == '') {
          this.toastr.errorToastr('Please Enter Revalued Amount', 'Error !', {toastTimeout: 2500,});
          return false;
        } 
        else if (this.disposalValue == undefined || this.disposalValue.toString() == '') {
          this.toastr.errorToastr('Please Enter Disposal Value', 'Error !', {toastTimeout: 2500,});
          return false;
        } 
        else if (this.gainLoss == undefined ||this.gainLoss.toString() == '') {
          this.toastr.errorToastr('Please Enter Gain/Loss', 'Error !', {toastTimeout: 2500,});
          return false;
        }
        else if (this.reservePrice == undefined || this.reservePrice.toString() == '') {
            this.toastr.errorToastr('Please Enter Reserve Price', 'Error !', {toastTimeout: 2500,});
            return false;
        }
        else if (this.currentMarketValue == undefined || this.currentMarketValue.toString() == '') {
            this.toastr.errorToastr('Please Enter Current Markeet Value', 'Error !', {toastTimeout: 2500,});
            return false;
        }
        else {

        var reqRemarks = '-';
        if (this.remarksDetail == undefined && this.remarksDetail.trim() == '') {
            reqRemarks = this.remarksDetail.trim();
        }

        //var reqDate = this.app.convertDate(this.toDate);
        
        var filePath = null;
        if (this.fileDetail != undefined) {
            filePath = this.filePickerDetail;
        }

        var fileNameExt = this.filePickerDetail.substr(this.filePickerDetail.lastIndexOf('.') + 1);

        var fPath = 'C:/inetpub/wwwroot/FAR/FAR_Project/assets/disposalDetail';

        var reqSpType = 'Insert';
        if (this.disposalPaymentID > 0) {
            reqSpType = 'Update';
        }
        
        //alert(this.cookie.get('userID'));
        //return false;

        var SaveData = {

            DisposalPaymentID: this.disposalPaymentID,
            DisposalID: this.disposalID,
            AssetID: this.ddlAssets,
            DisposalValue: this.disposalValue,
            ReservePrice: this.reservePrice,
            CurrentMarketvalue: this.currentMarketValue,
            BookValue: this.bookValue,
            GainLoss: this.gainLoss,

            EDocExtension: fileNameExt,
            Edoc: fPath,
            imgFile: this.fileDetail,
            Remarks: reqRemarks,

            Userid: this.cookie.get('userID'),
            SpType: reqSpType

        };

        this.loadingBar = true;
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        this.http.post(this.app.serverUrl + 'suddisposaldetail', SaveData, { headers: reqHeader }).subscribe((data: any) => {
                if (data.msg == 'Success') {
                    if (this.disposalID == 0) {
                        this.toastr.successToastr('Record Saved Successfully!','Success!',{ toastTimeout: 2500 });
                        this.loadingBar = false;
                    } else {
                        this.toastr.successToastr('Record Updated Successfully!','Success!',{ toastTimeout: 2500 });
                        this.loadingBar = false;
                    }
                    this.clearDetail();
                    this.getDisposalDetail();
                    return false;
                } else {
                    this.toastr.errorToastr(data.msg, 'Error !', {toastTimeout: 5000,});
                    this.loadingBar = false;
                    return false;
                }
            });
        }
    }
    
    clearDetail() {

        this.disposalPaymentID = 0;
        this.ddlAssets = '';
        this.description = '';
        this.costOfAsset = 0;
        this.dateOfPurchase = new Date();
        this.allocation = '';
        this.accumlateDepreciation = 0;
        this.bookValue = 0;
        this.revaluedAmount = 0;
        this.disposalValue = 0;
        this.gainLoss = 0;
        this.reservePrice = 0;
        this.currentMarketValue = 0;
        this.remarksDetail = '';
        
        this.disAccDep=false;
        this.disBookVal=false;
        this.disRevalAmount=false;

        this.imageAssetUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";
        this.imageAssetUrl2 = "../../../../../assets/assetEntryImg/dropHereImg.png";
        this.imageAssetUrl3 = "../../../../../assets/assetEntryImg/dropHereImg.png";
        
        var fileName = 'E Document';
        $('#customFile4').siblings('.custom-file-label').addClass('selected').html(fileName); 

        this.filePickerDetail = '';
        this.selectedFileDetail = null;
        this.fileDetail = undefined;

        //this.disposalDetailList = [];
    }
    
    editDetail(item) {

        this.lblAssets = item.tag + " - " + item.assetDescription;

        this.disposalPaymentID = item.disposalPaymentID;
        this.disposalID = item.disposalID;
        this.ddlAssets = item.assetID.toString();
        this.description = item.assetDescription,
        this.costOfAsset = item.costAmount,
        this.dateOfPurchase = new Date();
        this.allocation = item.projectName;
        this.accumlateDepreciation = 0;
        this.bookValue = item.netBookAmount;
        this.revaluedAmount = item.revaluedAmount;
        this.disposalValue = item.bidAmount;
        this.gainLoss = 0;
        this.reservePrice = item.reservePrice;
        this.currentMarketValue = item.currentMarketValue;
        this.remarks = item.remarks;

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
    
    }
    
    deleteDetail(item) {
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
                        DisposalPaymentID: item.disposalPaymentID,
                        AssetID: item.assetID,
                        Userid: this.cookie.get('userID'),
                        SpType: 'Delete',
                    };
        
                    var reqHeader = new HttpHeaders({'Content-Type': 'application/json',});
        
                    this.http.post(this.app.serverUrl + 'suddisposaldetail', SaveData, {headers: reqHeader,}).subscribe((data: any) => {
                        if (data.msg == 'Success') {
                            this.toastr.successToastr('Record Deleted Successfully!','Success!',{ toastTimeout: 2500 });
                            this.clearDetail();
                            this.getDisposalDetail();
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


    filterAssetDetail(reqAssetId) {

        this.imageAssetUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";
        this.imageAssetUrl2 = "../../../../../assets/assetEntryImg/dropHereImg.png";
        this.imageAssetUrl3 = "../../../../../assets/assetEntryImg/dropHereImg.png";

        var tempList = this.assetsForDisposalDataList.filter((x) => x.assetID == reqAssetId);

        if (tempList.length > 0) {
            this.description = tempList[0].assetDescription;
            this.allocation = tempList[0].projectName;

            if(tempList[0].costAmount != 0){
                this.costOfAsset = tempList[0].costAmount;
            }

            if(tempList[0].AccDepreciationonCost != 0 && tempList[0].AccDepreciationonCost != undefined){
                this.accumlateDepreciation = tempList[0].AccDepreciationonCost;
                this.disAccDep=true;
            }
            
            if(tempList[0].NetBookValue != 0 && tempList[0].NetBookValue != undefined){
                this.bookValue = tempList[0].NetBookValue;
                this.disBookVal=true;
            } 
            if(tempList[0].RevaluedAmount != 0 && tempList[0].RevaluedAmount != undefined){
                this.revaluedAmount = tempList[0].RevaluedAmount;
                this.disRevalAmount=true;
            }
            
            // this.disposalValue = tempList[0].openingRevaluationSurplus;
            // this.gainLoss = tempList[0].openingRevaluationSurplus;
            // this.reservePrice = tempList[0].openingRevaluationSurplus;
            
            if (
                tempList[0].eDoc != null &&
                tempList[0].eDoc != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
            ) {
                this.imageAssetUrl =
                // "http://192.168.100.162:7000/assets/assetEntryImg/" +
                "http://125.209.107.137:7000/assets/assetEntryImg/" +
                tempList[0].assetID +
                "_1.jpg";
            }
            if (
                tempList[0].eDoc2 != null &&
                tempList[0].eDoc2 != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
            ) {
                this.imageAssetUrl2 =
                // "http://192.168.100.162:7000/assets/assetEntryImg/" +
                "http://125.209.107.137:7000/assets/assetEntryImg/" +
                tempList[0].assetID +
                "_2.jpg";
            }
            if (
                tempList[0].eDoc3 != null &&
                tempList[0].eDoc3 != "C:/inetpub/wwwroot/FAR/FAR_Project/assets/assetEntryImg"
            ) {
                this.imageAssetUrl3 =
                // "http://192.168.100.162:7000/assets/assetEntryImg/" +
                "http://125.209.107.137:7000/assets/assetEntryImg/" +
                tempList[0].assetID +
                "_3.jpg";
            }
          
        }
        
    }







    // accordian setting
    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }
    //accordian settings end

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



    onFileSelectedDetail(event) {
        this.selectedFileDetail = <File>event.target.files[0];
        let reader = new FileReader();

        reader.onloadend = (e) => {
        this.fileDetail = reader.result;

        var splitFile = this.fileDetail.split(',')[1];
        this.fileDetail = splitFile;
        };

        reader.readAsDataURL(this.selectedFileDetail);
    }

    fileChangeDetail() {
            var fileName = $('#customFile4').val().split('\\').pop();
            $('#customFile4').siblings('.custom-file-label').addClass('selected').html(fileName);
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

    getGainLoss(e){
        this.gainLoss=this.disposalValue - this.bookValue;
    }
}

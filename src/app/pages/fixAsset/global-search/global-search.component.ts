import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CookieService } from 'ngx-cookie-service';
// import { EventEmitter } from 'protractor';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter();

  cmbLocation = "";
  cmbWngSection = "";
  cmbOfcType = "";
  cmbCustody = "";
  cmbAssetCat = "";

  searchLocation = "";
  searchSection = "";
  searchCustody = "";
  searchCategory = "";

  locList = [];
  ofcTypeList = [];
  wngSectionList = [];
  custodyList = [];
  AssetCatList = [];
  assetList = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService,
    private app: AppComponent,
  ) {}

  ngOnInit(): void {
    this.getLocation();
    this.getOfficeType();
      this.getCustody();
    this.getAssetCategory();
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

  getOfficeType() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getofctype", { headers: reqHeader })
      .subscribe((data: any) => {
        this.ofcTypeList = data;
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
        this.custodyList = data;
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

  search(){
    if (this.cmbLocation == "" && this.cmbOfcType == "" && this.cmbWngSection == "" && this.cmbCustody == "" && this.cmbAssetCat == "") {
      this.toastr.errorToastr(
        "Please Select any data to search",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    }else{
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getsearchasset?locID=" + this.cmbLocation + "&ofcTypID="  + 
        this.cmbOfcType + "&secID=" + this.cmbWngSection + "&custodyID=" + this.cmbCustody + 
        "&assetCatID=" + this.cmbAssetCat, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.assetList = data;
        this.getData(data);
      });
    }
  }

  getData(item: any){
    this.eventEmitter.emit(item);

  }
  clear(){
    this.cmbLocation = "";
    this.cmbOfcType = "";
    this.cmbWngSection = "";
    this.cmbCustody = "";
    this.cmbAssetCat = "";
    this.wngSectionList = [];
    this.getData("");
  }
}

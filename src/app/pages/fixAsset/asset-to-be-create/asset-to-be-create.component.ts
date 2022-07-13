import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from 'src/app/app.component';

declare var $: any;

@Component({
  selector: 'app-asset-to-be-create',
  templateUrl: './asset-to-be-create.component.html',
  styleUrls: ['./asset-to-be-create.component.scss']
})
export class AssetToBeCreateComponent implements OnInit {

  lblPackageName = "";
  cmbPackage = "";
  cmbIpc = "";
  
  searchPackage = "";
  searchIpc = "";

  packageList: any = [];
  ipcList: any = [];
  assetList: any = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService,
    private app: AppComponent,
  ) {}

  ngOnInit(): void {
    $("#rptOptionsModal").modal("show");
    
    this.getPackage();
  }

  getPackage(){
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getPackage", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.packageList = data;
      });
  }

  onChangePackage(item: any){
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getipcCreateAsset?packageID=" + item, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.ipcList = data;
      });
  }

  getReport(){
    if (this.cmbPackage == "") {
      this.toastr.errorToastr(
        "Please Select Province Location & Sub Location",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    }
    if (this.cmbIpc == "") {
      this.cmbIpc = '0';
    }
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getassetcreate?packageID=" + this.cmbPackage + "&ipc=" + this.cmbIpc, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        $("#rptOptionsModal").modal("hide");
    
        this.lblPackageName = data[0].package_Name;
        this.assetList = data;
      });
  }
  
  clear(){
    this.cmbPackage = "";
    this.cmbIpc = "";
  }
  
  print(){
    var printCss = this.printCSS();

    if(this.assetList.length == 0){
      this.toastr.errorToastr(
        "No Data Found",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    }
    var contents = $("#assetCreated").html();

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

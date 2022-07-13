import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { AppComponent } from "src/app/app.component";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { CookieService } from "ngx-cookie-service";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrManager } from "ng6-toastr-notifications";
import { MatSort } from "@angular/material/sort";
import { DatePipe } from "@angular/common";

declare var $: any;

export class Group {
  level = 0;
  parent: Group;
  expanded = true;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

export class AssetItems {
  assetDescriptioh: string;
  purchaseDate: string;
  costAmount: string;
  qtyDisposedOff: number;
  reservePrice: string;
  disposalPrice: string;
  purchaseNameWithAddress: string;
  disposalDate: string;
  remarks: string;
  subLocationDescription;
}

@Component({
  selector: "app-admin-disposal-register",
  templateUrl: "./admin-disposal-register.component.html",
  styleUrls: ["./admin-disposal-register.component.scss"],
})
export class AdminDisposalRegisterComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  cmbRegion = "";
  searchRegion = "";
  cmbLoc = "";
  searchLocation = "";

  dtpFromDt: any = '';
  dtpToDt: any = '';

  tempRptTitle = "";
  rptTitle = "Record of Disposal of Assets";
  rptHeader = "";
  rptTitle2nd = "";
  regionTitle = "";

  assetRegisterList = [];
  filterAssetRegisterList = [];
  regionList = [];
  locList = [];
  filteredLocList = [];

  // group by table setting
  title = "Grid Grouping";

  public dataSource = new MatTableDataSource<any | Group>([]);

  // tslint:disable-next-line: variable-name
  _alldata: any[];
  columns: any[];
  displayedColumns: string[];
  groupByColumns: string[] = [];

  constructor(
    private http: HttpClient,
    private app: AppComponent,
    private cookie: CookieService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrManager,
    private datePipe: DatePipe
  ) {
    this.columns = [
      {
        field: "assetDescription",
        title: "Description of Assets",
        display: true,
      },
      {
        field: "purchaseDate",
        title: "Date of Purchase",
        display: true,
      },
      {
        field: "costAmount",
        title: "Cost of Purchase",
        display: true,
      },
      {
        field: "qtyDisposedOff",
        title: "Quantity Disposed Off",
        display: true,
      },
      {
        field: "reservePrice",
        title: "Reserve Price",
        display: true,
      },
      {
        field: "disposalPrice",
        title: "Disposal Price",
        display: true,
      },
      {
        field: "purchaseNameWithAddress",
        title: "Name of Purchase with Address",
        display: true,
      },
      {
        field: "disposalDate",
        title: "Date of Disposal",
        display: true,
      },
      {
        field: "remarks",
        title: "Remarks",
        display: true,
      },
      {
        field: "subLocationDescription",
        title: "Location",
        display: false,
      },
    ];
    // this.availColumns = this.columns.slice();
    this.displayedColumns = this.columns.map((column) => column.field);
    this.groupByColumns = ["headOfPayment"];
  }

  ngOnInit(): void {
    $("#rptOptionsModal").modal("show");
    // this.getReport();
    this.getRegions();
    this.getLocation();
  }

  getRegions() {
    // debugger;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.http
      // .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
      .get(
        this.app.serverUrl + "getRegions?userId=" + this.cookie.get("userID"),
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        // this.locList = data.filter((x) => x.isActivated == 1);
        this.regionList = data;
      });
  }

  getLocation() {
    // debugger;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.http
      // .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
      .get(
        this.app.serverUrl + "getLocations?userId=" + this.cookie.get("userID"),
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        // this.locList = data.filter((x) => x.isActivated == 1);
        this.locList = data;
        this.filteredLocList = data;
      });
  }

  showLocations() {
    this.filteredLocList = this.locList.filter(
      (x) => x.mainLocID == this.cmbRegion
    );
  }

  getReport() {
    // clear filters
    this.rptTitle2nd = "";

    // header setting
    // tslint:disable-next-line: triple-equals
    if (this.tempRptTitle != "") {
      this.rptHeader = this.tempRptTitle;
    }

    if (this.cmbRegion == "" || this.cmbRegion == undefined) {
      this.toastr.errorToastr("Please Select Region", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }

    if (this.dtpFromDt == "" || this.dtpFromDt == undefined) {
      this.toastr.errorToastr("Please Select From Date", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.dtpToDt == "" || this.dtpToDt == undefined) {
      this.toastr.errorToastr("Please Select To Date", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }
    // http call
    // tslint:disable-next-line: prefer-const
    let reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.http
      .get(
        this.app.serverUrl +
          "getDisposedAssetRpt?mainLocId=" +
          this.cmbRegion +
          "&subLocId=" +
          this.cmbLoc +
          "&fromDate=" +
          this.datePipe.transform(this.dtpFromDt, 'yyyy-MM-dd') +
          "&toDate=" +
          this.datePipe.transform(this.dtpToDt, 'yyyy-MM-dd'),
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        // this.assetRegisterList = data;
        // this.filterAssetRegisterList = data;

        data.forEach((item, index) => {
          item.id = index + 1;
        });
        // this._alldata = data;
        this._alldata = data;
        this.filterAssetRegisterList = this._alldata;
        // this.dataSource.sort = this.sort;
        this.dataSource.data = this.addGroups(
          this.filterAssetRegisterList,
          this.groupByColumns
        );
        this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
        this.dataSource.filter = performance.now().toString();
        this.cdr.detectChanges();
        $("#rptOptionsModal").modal("hide");
        // this.dataSource = this.filterAssetRegisterList;
      });
  }

  getDisplayedColumns(): string[] {
    return this.columns
      .filter((cd) => cd.display === true)
      .map((cd) => cd.field);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  getRegionTitle(item) {
    this.regionTitle = item.mainLocationDescription;
  }

  clear() {
    this.cmbRegion = "";
    this.dtpFromDt = "";
    this.dtpToDt = "";

  }

  printDiv() {
    this.app.printReport("#myTable");
  }

  exportExcel() {
    this.app.exportExcel("myTable", "Asset Register");
  }

  groupBy(event, column) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, true);
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  checkGroupByColumn(field, add) {
    let found = null;
    for (const column of this.groupByColumns) {
      if (column === field) {
        found = this.groupByColumns.indexOf(column, 0);
      }
    }
    if (found != null && found >= 0) {
      if (!add) {
        this.groupByColumns.splice(found, 1);
      }
    } else {
      if (add) {
        this.groupByColumns.push(field);
      }
    }
  }

  unGroupBy(event, column) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, false);
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  // below is for grid row grouping
  customFilterPredicate(data: any | Group, filter: string): boolean {
    return data instanceof Group ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: any): boolean {
    // debugger;
    const groupRows = this.dataSource.data.filter((row) => {
      if (!(row instanceof Group)) {
        return false;
      }
      let match = true;
      this.groupByColumns.forEach((column) => {
        if (!row[column] || !data[column] || row[column] !== data[column]) {
          match = false;
        }
      });
      return match;
    });

    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  groupHeaderClick(row) {
    row.expanded = !row.expanded;
    this.dataSource.filter = performance.now().toString(); // bug here need to fix
  }

  addGroups(data: any[], groupByColumns: string[]): any[] {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }

  getSublevel(
    data: any[],
    level: number,
    groupByColumns: string[],
    parent: Group
  ): any[] {
    // tslint:disable-next-line: no-debugger
    debugger;
    if (level >= groupByColumns.length) {
      return data;
    }
    const groups = this.uniqueBy(
      data.map((row) => {
        const result = new Group();
        result.level = level + 1;
        result.parent = parent;
        for (let i = 0; i <= level; i++) {
          result[groupByColumns[i]] = row[groupByColumns[i]];
        }
        return result;
      }),
      JSON.stringify
    );

    // debugger;
    const currentColumn = groupByColumns[level];
    let subGroups = [];
    groups.forEach((group) => {
      const rowsInGroup = data.filter(
        (row) => group[currentColumn] === row[currentColumn]
      );
      group.totalCounts = rowsInGroup.length;
      const subGroup = this.getSublevel(
        rowsInGroup,
        level + 1,
        groupByColumns,
        group
      );
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a, key) {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
  }

  onSortData(sort: MatSort) {
    let data = this.filterAssetRegisterList;
    // tslint:disable-next-line: triple-equals
    const index = data.findIndex((x) => x.level == 1);
    if (sort.active && sort.direction !== "") {
      if (index > -1) {
        data.splice(index, 1);
      }

      data = data.sort((a: AssetItems, b: AssetItems) => {
        const isAsc = sort.direction === "asc";
        switch (sort.active) {
          case "assetDescriptioh":
            return this.compare(a.assetDescriptioh, b.assetDescriptioh, isAsc);
          case "purchaseDate":
            return this.compare(a.purchaseDate, b.purchaseDate, isAsc);
          case "costAmount":
            return this.compare(a.costAmount, b.costAmount, isAsc);
          case "qtyDisposedOff":
            return this.compare(a.qtyDisposedOff, b.qtyDisposedOff, isAsc);
          case "reservePrice":
            return this.compare(a.reservePrice, b.reservePrice, isAsc);
          case "disposalPrice":
            return this.compare(a.disposalPrice, b.disposalPrice, isAsc);
          case "purchaseNameWithAddress":
            return this.compare(
              a.purchaseNameWithAddress,
              b.purchaseNameWithAddress,
              isAsc
            );
          case "disposalDate":
            return this.compare(a.disposalDate, b.disposalDate, isAsc);
          case "remarks":
            return this.compare(a.remarks, b.remarks, isAsc);
          case "subLocationDescription":
            return this.compare(
              a.subLocationDescription,
              b.subLocationDescription,
              isAsc
            );
          default:
            return 0;
        }
      });
    }
    this.dataSource.data = [];
    this.dataSource.data = this.addGroups(data, this.groupByColumns);
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
    this.dataSource.filter = performance.now().toString();
    this.cdr.detectChanges();
  }

  private compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

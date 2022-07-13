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
  assetCatDescription: string;
  fullDescription: string;
  dateOfPurchase: string;
  costOfPurchase: string;
  headOfPayment: string;
  quantityPurchased: number;
  placeOfAllocation: string;
  codeNo: string;
  remarks: string;
}
@Component({
  selector: "app-admin-machinery-register",
  templateUrl: "./admin-machinery-register.component.html",
  styleUrls: ["./admin-machinery-register.component.scss"],
})
export class AdminMachineryRegisterComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  //declarations
  cmbRegion = "";
  searchRegion = "";

  dtpFromDt: any = '';
  dtpToDt: any = '';

  tempRptTitle = "";
  rptTitle = "ENGINEERING EQUIPMENTS / MACIIINERY";
  rptHeader = "";
  rptTitle2nd = "";
  regionTitle = "";

  assetRegisterList = [];
  filterAssetRegisterList = [];
  regionList = [];

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
        field: "assetCatDescription",
        title: "Asset Title",
        display: false,
      },
      {
        field: "fullDescription",
        title: "Full Description",
        display: true,
      },
      {
        field: "dateOfPurchase",
        title: "Date of Purchase",
        display: true,
      },
      {
        field: "costOfPurchase",
        title: "Cost of Purchase",
        display: true,
      },
      {
        field: "headOfPayment",
        title: "Head of Payment",
        display: true,
      },
      {
        field: "quantityPurchased",
        title: "Quantity Purchased",
        display: true,
      },
      {
        field: "placeOfAllocation",
        title: "Place of Allocation",
        display: true,
      },
      {
        field: "codeNo",
        title: "Code No.",
        display: true,
      },
      {
        field: "remarks",
        title: "Remarks",
        display: true,
      },
    ];
    // this.availColumns = this.columns.slice();
    this.displayedColumns = this.columns.map((column) => column.field);
    this.groupByColumns = ["assetCatDescription"];
  }

  ngOnInit(): void {
    // this.getReport();
    this.getRegions();
    $("#rptOptionsModal").modal("show");
  }

  getReport() {
    // clear filters
    this.rptTitle2nd = "";

    // header setting
    // tslint:disable-next-line: triple-equals
    if (this.tempRptTitle != "") {
      this.rptHeader = this.tempRptTitle;
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
    // get
    // http call
    // tslint:disable-next-line: prefer-const
    let reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.http
      .get(
        this.app.serverUrl +
          "getForm47WithoutVehicle?mainLocId=" +
          this.cmbRegion +
          "&accountCatID=7&fromDate=" +
          this.datePipe.transform(this.dtpFromDt, 'yyyy-MM-dd') +
          "&toDate=" +
          this.datePipe.transform(this.dtpToDt, 'yyyy-MM-dd'),
        {
          headers: reqHeader,
        }
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
        // $('#rptOptionsModal').modal('hide');
        // this.dataSource = this.filterAssetRegisterList;
      });
  }

  getRegionTitle(item) {
    this.regionTitle = item.mainLocationDescription;
  }

  getDisplayedColumns(): string[] {
    return this.columns
      .filter((cd) => cd.display === true)
      .map((cd) => cd.field);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
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
          case "fullDescription":
            return this.compare(a.fullDescription, b.fullDescription, isAsc);
          case "dateOfPurchase":
            return this.compare(a.dateOfPurchase, b.dateOfPurchase, isAsc);
          case "costOfPurchase":
            return this.compare(a.costOfPurchase, b.costOfPurchase, isAsc);
          case "headOfPayment":
            return this.compare(a.headOfPayment, b.headOfPayment, isAsc);
          case "placeOfAllocation":
            return this.compare(
              a.placeOfAllocation,
              b.placeOfAllocation,
              isAsc
            );
          case "codeNo":
            return this.compare(a.codeNo, b.codeNo, isAsc);
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

  clear() {
    this.cmbRegion = "";
    this.dtpFromDt = "";
    this.dtpToDt = "";
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
}

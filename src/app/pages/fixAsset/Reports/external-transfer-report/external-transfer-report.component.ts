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
  tSubLocationDescription: string;
  tOfficeTypeDescription: string;
  tOfficeDescription: string;
  tPostName: string;
  assetDescription: string;
  rSubLocationDescription: string;
  rOfficeTypeDescription: string;
  rOfficeDescription: string;
  rPostName: string;
  tag: string;
  projectName: string;
  iPCRef: number;
}

@Component({
  selector: 'app-external-transfer-report',
  templateUrl: './external-transfer-report.component.html',
  styleUrls: ['./external-transfer-report.component.scss']
})
export class ExternalTransferReportComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  tempRptTitle = "";
  rptTitle = "External Transfers Report";
  rptHeader = "";
  rptTitle2nd = "";

  assetRegisterList = [];
  filterAssetRegisterList = [];

  // group by table setting
  title = "Grid Grouping";

  public dataSource = new MatTableDataSource<any | Group>([]);

  // tslint:disable-next-line: variable-name
  _alldata: any[];
  columns: any[];
  displayedColumns: string[];
  groupByColumns: string[] = [];

  // expandedAsset: any[] = [];
  // expandedSubAsset: any[] = [];
  // _allGroup: any[];

  constructor(
    private http: HttpClient,
    private app: AppComponent,
    private cookie: CookieService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrManager
  ) {
    this.columns = [
      {
        field: "tSubLocationDescription",
        title: "From Location",
        display: true,
      },
      {
        field: "tOfficeTypeDescription",
        title: "From Sub-Location",
        display: true,
      },
      {
        field: "tOfficeDescription",
        title: "From Office",
        display: true,
      },
      {
        field: "tPostName",
        title: "From Post",
        display: true,
      },
      {
        field: "assetDescription",
        title: "Asset Description",
        display: true,
      },
      {
        field: "rSubLocationDescription",
        title: "To Location",
        display: true,
      },
      {
        field: "rOfficeTypeDescription",
        title: "To Sub-Location",
        display: true,
      },
      { field: "rOfficeDescription", title: "To Office", display: true },
      {
        field: "rPostName",
        title: "To Post",
        display: true,
      },
      {
        field: "tag",
        title: "Asset Tag",
        display: true,
      },

      {
        field: "projectName",
        title: "Project Name",
        display: false,
      },
      {
        field: "iPCRef",
        title: "IPC Reference",
        display: false,
      },
    ];
    // this.availColumns = this.columns.slice();
    this.displayedColumns = this.columns.map((column) => column.field);
    this.groupByColumns = ["rSubLocationDescription"];
  }

  ngOnInit(): void {
    this.getReport();
  }

  getReport() {
    // clear filters
    this.rptTitle2nd = "";

    // header setting
    // tslint:disable-next-line: triple-equals
    if (this.tempRptTitle != "") {
      this.rptHeader = this.tempRptTitle;
    }

    // http call
    // tslint:disable-next-line: prefer-const
    let reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.http
      .get(this.app.serverUrl + "getExternalAssetTransfersReport", {
        headers: reqHeader,
      })
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
          case "tSubLocationDescription":
            return this.compare(
              a.tSubLocationDescription,
              b.tSubLocationDescription,
              isAsc
            );
          case "tOfficeTypeDescription":
            return this.compare(
              a.tOfficeTypeDescription,
              b.tOfficeTypeDescription,
              isAsc
            );
          case "tOfficeDescription":
            return this.compare(
              a.tOfficeDescription,
              b.tOfficeDescription,
              isAsc
            );
          case "tPostName":
            return this.compare(a.tPostName, b.tPostName, isAsc);
          case "assetDescription":
            return this.compare(a.assetDescription, b.assetDescription, isAsc);
          case "rSubLocationDescription":
            return this.compare(
              a.rSubLocationDescription,
              b.rSubLocationDescription,
              isAsc
            );
          case "rOfficeTypeDescription":
            return this.compare(
              a.rOfficeTypeDescription,
              b.rOfficeTypeDescription,
              isAsc
            );
          case "rOfficeDescription":
            return this.compare(
              a.rOfficeDescription,
              b.rOfficeDescription,
              isAsc
            );
          case "rPostName":
            return this.compare(a.rPostName, b.rPostName, isAsc);
          case "tag":
            return this.compare(a.tag, b.tag, isAsc);
          case "projectName":
            return this.compare(a.projectName, b.projectName, isAsc);
          case "iPCRef":
            return this.compare(a.iPCRef, b.iPCRef, isAsc);
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

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
  subLocationDescription: string = "";
  officeTypeDescription: string = "";
  officeDescription: string = "";
  accountsCatagory: string = "";
  assetCatDescription: string = "";
  tag: string = "";
  postName: string = "";
  assetDescription: string = "";
  make: string = "";
  model: string = "";
  size: string = "";
  processor: string = "";
  generation: string = "";
  ram: string = "";
  driveType1: string = "";
  hd1: string = "";
  driveType2: string = "";
  hd2: string = "";
  vehMake: string = "";
  vehType: string = "";
  vehEngineNum: string = "";
  vehModel: string = "";
  vehChasisNum: string = "";
  author: string = "";
  publisher: string = "";
  volume: string = "";
  edition: string = "";
  ipcRef: string = "";
  projectShortName: string = "";
  purchaseDate: string = "";
  costAmount: string = "";
  assetCondition: string = "";
  previousTag: string = "";
  createdBy: string = "";
}

@Component({
  selector: "app-immovable-asset-rpt",
  templateUrl: "./immovable-asset-rpt.component.html",
  styleUrls: ["./immovable-asset-rpt.component.scss"],
})
export class ImmovableAssetRptComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  tempRptTitle = "";
  rptTitle = "Asset Register Report - General";
  rptHeader = "";
  rptTitle2nd = "";

  assetRegisterList = [];
  filterAssetRegisterList = [];

  //group by table setting
  title = "Grid Grouping";

  public dataSource = new MatTableDataSource<any | Group>([]);

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
        field: "subLocationDescription",
        title: "Main Location",
        display: true,
      },
      {
        field: "officeTypeDescription",
        title: "Sub Location",
        display: true,
      },
      {
        field: "officeDescription",
        title: "Office",
        display: true,
      },
      {
        field: "accountsCatagory",
        title: "Accounts Category",
        display: true,
      },
      {
        field: "assetCatDescription",
        title: "Asset Name",
        display: true,
      },
      {
        field: "tag",
        title: "Tag. ID",
        display: true,
      },
      {
        field: "postName",
        title: "Custodian",
        display: true,
      },
      { field: "assetDescription", title: "Asset Description", display: true },

      // computers extra fields
      { field: "make", title: "Make", display: true },
      { field: "model", title: "Model", display: true },
      { field: "size", title: "Size", display: true },
      { field: "processor", title: "Processor", display: true },
      { field: "generation", title: "Genration", display: true },
      { field: "ram", title: "RAM", display: true },
      { field: "driveType1", title: "Drive-01", display: true },
      { field: "hd1", title: "size", display: true },
      { field: "driveType2", title: "Drive-02", display: true },
      { field: "hd2", title: "size", display: true },

      // vehcile extra fields
      { field: "vehMake", title: "Veh-Make", display: true },
      { field: "vehType", title: "Veh-Type", display: true },
      { field: "vehEngineNum", title: "Veh-Engine No.", display: true },
      { field: "vehModel", title: "Veh-Model", display: true },
      { field: "vehChasisNum", title: "Veh-Chasis No.", display: true },

      // books extra fields
      { field: "author", title: "Author", display: true },
      { field: "publisher", title: "Publisher", display: true },
      { field: "volume", title: "Volume", display: true },
      { field: "edition", title: "Edition", display: true },

      {
        field: "ipcRef",
        title: "IPC/Invoice Ref.",
        display: true,
      },
      {
        field: "projectShortName",
        title: "Project",
        display: true,
      },
      {
        field: "purchaseDate",
        title: "Purchase Date",
        display: true,
      },
      {
        field: "costAmount",
        title: "Cost Price",
        display: true,
      },
      {
        field: "assetCondition",
        title: "Condition",
        display: true,
      },
      {
        field: "previousTag",
        title: "old Tag",
        display: true,
      },
      {
        field: "createdBy",
        title: "Created By",
        display: false,
      },
    ];
    // this.availColumns = this.columns.slice();
    this.displayedColumns = this.columns.map((column) => column.field);
    this.groupByColumns = ["subLocationDescription"];
  }

  ngOnInit(): void {}

  getDisplayedColumns(): string[] {
    return this.columns
      .filter((cd) => cd.display == true)
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
    const index = data.findIndex((x) => x["level"] == 1);
    if (sort.active && sort.direction !== "") {
      if (index > -1) {
        data.splice(index, 1);
      }

      data = data.sort((a: AssetItems, b: AssetItems) => {
        const isAsc = sort.direction === "asc";
        switch (sort.active) {
          case "subLocationDescription":
            return this.compare(
              a.subLocationDescription,
              b.subLocationDescription,
              isAsc
            );
          case "officeTypeDescription":
            return this.compare(
              a.officeTypeDescription,
              b.officeTypeDescription,
              isAsc
            );
          case "officeDescription":
            return this.compare(
              a.officeDescription,
              b.officeDescription,
              isAsc
            );
          case "accountsCatagory":
            return this.compare(a.accountsCatagory, b.accountsCatagory, isAsc);
          case "assetCatDescription":
            return this.compare(
              a.assetCatDescription,
              b.assetCatDescription,
              isAsc
            );
          default:
            return 0;
        }
      });
    }
    this.dataSource.data = [];
    debugger;
    this.dataSource.data = this.addGroups(data, this.groupByColumns);
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
    this.dataSource.filter = performance.now().toString();
    this.cdr.detectChanges();
  }

  private compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

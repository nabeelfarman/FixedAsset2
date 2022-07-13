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
  fixedAssetID: number;
  accountsCatID: number;
  projectID: number;
  roadId: number;
  officeSecID: number;
  landMeasureTypeID: number;
  accountsCatagory: string;
  roadShortName: string;
  roadName: number;
  projectShortName: string;
  projectName: string;
  officeDescription: string;
  landMeasureType: string;
  constructionFrom: string;
  dateofNationalization: string;
  constructionTo: string;
  remarks: string;
  packageName: string;
  areaAcquiredKanal: number;
  areaAcquiredMarla: number;
  areaTransferedKanal: number;
  constructionCost: number;
  costOfLand: number;
  openingcost: number;
  totalCost: number;
  openingRevaluationAmount: number;
  additionINRevaluationSurplus: number;
  openingAccDepreciation: number;
  accDepreciation: number;
  oWDV: number;
  roadLength: number;
  historicalCost: number;
  oProporationforCosttoWDV: number;
  proporationforCosttoWDV: number;
  areaTransferedMarla: number;
  isDeleted: number;

  additionINRevaluationAmount: number;
  wDV: number;
  totalRevaluationAmount: number;
  revaluationSurplus: number;
  openingRevaluationSurplus: number;
  buildingID: number;
  purposeofPurchase: string;
  presentUse: string;
  bridgeName: string;
  bridgeLength: number;
  userId: number;
  spType: string;
  revaluation: number;
  additioninRevaluation: number;
}

@Component({
  selector: "app-nharoad-report",
  templateUrl: "./nharoad-report.component.html",
  styleUrls: ["./nharoad-report.component.scss"],
})
export class NharoadReportComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  tempRptTitle = "";
  rptTitle = "Roads on Land Report";
  rptHeader = "";
  rptTitle2nd = "";

  dtpFromDt: any = '';
  dtpToDt: any = '';

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
    private toastr: ToastrManager,
    private datePipe: DatePipe
  ) {
    this.columns = [
      {
        field: 'officeDescription',
        title: 'account Section',
        display: true,
      },
      {
        field: 'roadShortName',
        title: 'Road',
        display: true,
      },
      {
        field: 'projectShortName',
        title: 'Project',
        display: true,
      },
      { field: 'packageName', title: 'Package Name', display: true},
      {
        field: 'landMeasureType',
        title: 'Measure Type',
        display: true,
      },
      {
        field: 'areaAcquiredKanal',
        title: 'Kanal',
        display: true,
      },
      {
        field: 'areaAcquiredMarla',
        title: 'Marla',
        display: true,
      },
      { field: 'historicalCost', title: 'Historical Cost', display: true},
      { field: 'accDepreciation', title: 'Depreciation', display: true},
      { field: 'wDV', title: 'Written Down Value', display: true },
      {
        field: 'totalCost',
        title: 'Total Cost',
        display: true,
      },
      { field: 'totalRevaluationAmount', title: 'Total Revaluation', display: true },
      { field: 'revaluationSurplus', title: 'Revaluation Surplus', display: true },

      { field: 'openingRevaluationAmount', title: 'OPening Revaluation', display: true },
      {
        field: 'openingRevaluationSurplus',
        title: 'opening Revaluation Surplus',
        display: false,
      },
      {
        field: 'additionINRevaluationAmount',
        title: 'Revaluation Addition',
        display: true,
      },
      {
        field: 'additionINRevaluationSurplus',
        title: 'Revaluation Surplus Addition',
        display: true,
      },
      {
        field: 'dateofNationalization',
        title: 'Nationalization Date',
        display: false,
      },
      { field: 'constructionFrom', title: 'Construction From', display: false },
      { field: 'constructionTo', title: 'Construction To', display: false },
      { field: 'constructionCost', title: 'Construction Cost', display: false },
      { field: 'areaTransferedKanal', title: 'Area Transfered Kanal', display: false},
      { field: 'areaTransferedMarla', title: 'Area Transfered Marla', display: false},
      { field: 'costOfLand', title: 'Cost of Land', display: false},
      { field: 'remarks', title: 'Remarks', display: false},
      { field: 'purposeofPurchase', title: 'Purchase Purpose', display: false},
      { field: 'presentUse', title: 'Present Use', display: false},
      { field: 'bridgeName', title: 'Bridge Name', display: false},
      { field: 'bridgeLength', title: 'Bridge Length', display: false},
      { field: 'spType', title: 'SP Type', display: false},
      { field: 'accountsCatagory', title: 'Accounts Catagory', display: false},
      { field: 'roadLength', title: 'Road Length', display: false},
      { field: 'projectName', title: 'Project Name', display: false},
      { field: 'openingcost', title: 'Opening Cost', display: false},
      { field: 'roporationforCosttoWDV', title: 'WDV Proporttion', display: false},
      { field: 'openingAccDepreciation', title: 'Opening Depreciation', display: false},
      { field: 'oWDV', title: 'Opening Written Down Value', display: false},
      { field: 'oProporationforCostoWDV', title: 'Opening Proportion WDV', display: false},
      { field: 'revaluation', title: 'Revaluation', display: false},
      { field: 'additioninRevaluation', title: 'Revaluation Addition', display: false},
      { field: 'roadName', title: 'Road Full Name', display: false},
    ];
    // this.availColumns = this.columns.slice();
    this.displayedColumns = this.columns.map((column) => column.field);
    this.groupByColumns = ["projectName"];
  }

  ngOnInit(): void {
    // this.getReport();

    $("#rptOptionsModal").modal("show");
  }

  getReport() {

    // clear filters
    this.rptTitle2nd = '';

    // header setting
    // tslint:disable-next-line: triple-equals
    if (this.tempRptTitle != '') {
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
    // http call
    // tslint:disable-next-line: prefer-const
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: "Bearer " + Token,
    });
    this.http
      .get(
        this.app.serverUrl +
          "getRoadDetail?fromDate=" +
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
        // $('#rptOptionsModal').modal('hide');
        // this.dataSource = this.filterAssetRegisterList;
      });
  }

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
    // tslint:disable-next-line: triple-equals
    const index = data.findIndex((x) => x.level == 1);
    if (sort.active && sort.direction !== '') {
      if (index > -1) {
        data.splice(index, 1);
      }

      data = data.sort((a: AssetItems, b: AssetItems) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'fixedAssetID':
            return this.compare(
              a.fixedAssetID,
              b.fixedAssetID,
              isAsc
            );
            case 'accountsCatID':
            return this.compare(
              a.accountsCatID,
              b.accountsCatID,
              isAsc
            );
            case 'projectID':
            return this.compare(
              a.projectID,
              b.projectID,
              isAsc
            );
            case 'roadId':
            return this.compare(
              a.roadId,
              b.roadId,
              isAsc
            );
            case 'officeSecID':
            return this.compare(
              a.officeSecID,
              b.officeSecID,
              isAsc
            );
            case 'landMeasureTypeID':
            return this.compare(
              a.landMeasureTypeID,
              b.landMeasureTypeID,
              isAsc
            );
            case 'accountsCatagory':
            return this.compare(
              a.accountsCatagory,
              b.accountsCatagory,
              isAsc
            );
            case 'roadShortName':
            return this.compare(
              a.roadShortName,
              b.roadShortName,
              isAsc
            );
            case 'roadName':
            return this.compare(
              a.roadName,
              b.roadName,
              isAsc
            );
            case 'projectShortName':
            return this.compare(
              a.projectShortName,
              b.projectShortName,
              isAsc
            );
            case 'projectName':
            return this.compare(
              a.projectName,
              b.projectName,
              isAsc
            );
            case 'officeDescription':
            return this.compare(
              a.officeDescription,
              b.officeDescription,
              isAsc
            );
            case 'landMeasureType':
            return this.compare(a.landMeasureType, b.landMeasureType, isAsc);
            case 'constructionFrom':
            return this.compare(
              a.constructionFrom,
              b.constructionFrom,
              isAsc
            );
            case 'dateofNationalization':
            return this.compare(
              a.dateofNationalization,
              b.dateofNationalization,
              isAsc
            );
            case 'constructionTo':
            return this.compare(
              a.constructionTo,
              b.constructionTo,
              isAsc
            );
            case 'remarks':
            return this.compare(
              a.remarks,
              b.remarks,
              isAsc
            );
            case 'packageName':
            return this.compare(
              a.packageName,
              b.packageName,
              isAsc
            );
            case 'areaAcquiredKanal':
            return this.compare(
              a.areaAcquiredKanal,
              b.areaAcquiredKanal,
              isAsc
            );
            case 'areaAcquiredMarla':
            return this.compare(
              a.areaAcquiredMarla,
              b.areaTransferedMarla,
              isAsc
            );
            case 'areaTransferedKanal':
            return this.compare(
              a.areaTransferedKanal,
              b.areaTransferedKanal,
              isAsc
            );
            case 'constructionCost':
            return this.compare(
              a.constructionCost,
              b.constructionCost,
              isAsc
            );
            case 'costOfLand':
            return this.compare(
              a.costOfLand,
              b.costOfLand,
              isAsc
            );
            case 'openingCost':
            return this.compare(
              a.openingcost,
              b.openingcost,
              isAsc
            );
            case 'totalCost':
            return this.compare(
              a.totalCost,
              b.totalCost,
              isAsc
            );
            case 'openingRevaluationAmount':
            return this.compare(
              a.openingRevaluationAmount,
              b.openingRevaluationAmount,
              isAsc
            );
            case 'additionINRevaluationSurplus':
            return this.compare(
              a.additionINRevaluationSurplus,
              b.additionINRevaluationSurplus,
              isAsc
            );
            case 'openingAccDepreciation':
            return this.compare(
              a.openingAccDepreciation,
              b.openingAccDepreciation,
              isAsc
            );
            case 'accDepreciation':
            return this.compare(
              a.accDepreciation,
              b.accDepreciation,
              isAsc
            );
            case 'oWDV':
            return this.compare(
              a.oWDV,
              b.oWDV,
              isAsc
            );
            case 'roadLength':
            return this.compare(
              a.roadLength,
              b.roadLength,
              isAsc
            );
            case 'historicalCost':
            return this.compare(
              a.historicalCost,
              b.historicalCost,
              isAsc
            );
            case 'oProporationforCosttoWDV':
            return this.compare(
              a.oProporationforCosttoWDV,
              b.oProporationforCosttoWDV,
              isAsc
            );
            case 'proporationforCosttoWDV':
            return this.compare(
              a.proporationforCosttoWDV,
              b.proporationforCosttoWDV,
              isAsc
            );
            case 'areaTransferedMarla':
            return this.compare(
              a.areaTransferedMarla,
              b.areaTransferedMarla,
              isAsc
            );
            case 'isDeleted':
            return this.compare(
              a.isDeleted,
              b.isDeleted,
              isAsc
            );


            case 'wDV':
            return this.compare(
              a.wDV,
              b.wDV,
              isAsc
            );
            case 'totalRevaluationAmount':
            return this.compare(
              a.totalRevaluationAmount,
              b.totalRevaluationAmount,
              isAsc
            );
            case 'revaluationSurplus':
            return this.compare(
              a.revaluationSurplus,
              b.revaluationSurplus,
              isAsc
            );
            case 'openingRevaluationSurplus':
            return this.compare(
              a.openingRevaluationSurplus,
              b.openingRevaluationSurplus,
              isAsc
            );
            case 'additionINRevaluationAmount':
            return this.compare(
              a.additionINRevaluationAmount,
              b.additionINRevaluationAmount,
              isAsc
            );
            case 'buildingID':
            return this.compare(
              a.buildingID,
              b.buildingID,
              isAsc
            );


            case 'purposeofPurchase':
            return this.compare(
              a.purposeofPurchase,
              b.purposeofPurchase,
              isAsc
            );
            case 'presentUse':
            return this.compare(
              a.presentUse,
              b.presentUse,
              isAsc
            );

            case 'bridgeName':
            return this.compare(
              a.bridgeName,
              b.bridgeName,
              isAsc
            );
            case 'bridgeLength':
            return this.compare(
              a.additionINRevaluationAmount,
              b.additionINRevaluationAmount,
              isAsc
            );
            case 'userId':
            return this.compare(
              a.userId,
              b.userId,
              isAsc
            );
            case 'spType':
            return this.compare(
              a.spType,
              b.spType,
              isAsc
            );
            case 'revaluation':
            return this.compare(
              a.revaluation,
              b.revaluation,
              isAsc
            );
            case 'additioninRevaluation':
            return this.compare(
              a.additioninRevaluation,
              b.additioninRevaluation,
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

  clear() {
    this.dtpFromDt = "";
    this.dtpToDt = "";
  }

  private compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

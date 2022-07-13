import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CookieService } from 'ngx-cookie-service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatSort } from '@angular/material/sort';

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
  mainLocationDescription: string = '';
  subLocationDescription: string = '';
  mainLocId: string = '';
  subLocId: string = '';
  furnitureFixture: string = '';
  electricAndGas: string = '';
  drawingSurveyLab: string = '';
  computerAccessories: string = '';
  officeEquipment: string = '';
  plantMachinery: string = '';
  vehicles: string = '';
}

@Component({
  selector: 'app-asset-category-sum-report',
  templateUrl: './asset-category-sum-report.component.html',
  styleUrls: ['./asset-category-sum-report.component.scss']
})
export class AssetCategorySumReportComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  cmbRegion = '';
  searchRegion = '';

  searchLocation = '';
  cmbLocation = '';
  cmbOfficeTypeID = '';
  cmbProject = '';
  searchProject = '';
  cmbAccountsCat = '';
  cmbAssetCat = '';
  searchAssetCat = '';
  tempRptTitle = '';
  rptTitle = 'Asset Category Summary Report';
  rptHeader = '';
  rptTitle2nd = '';

  assetRegisterList = [];
  filterAssetRegisterList = [];
  regionList = [];
  locList = [];
  filteredLocList = [];

  //group by table setting
  title = 'Grid Grouping';

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
        field: 'mainLocationDescription',
        title: 'Region',
        display: true,
      },
      {
        field: 'subLocationDescription',
        title: 'Location',
        display: true,
      },
      {
        field: 'mainLocId',
        title: 'Region Id',
        display: false,
      },
      {
        field: 'subLocId',
        title: 'Location Id',
        display: false,
      },
      {
        field: 'furnitureFixture',
        title: 'Furniture & Fixture',
        display: true,
      },
      {
        field: 'electricAndGas',
        title: 'Electric & Gas',
        display: true,
      },
      {
        field: 'drawingSurveyLab',
        title: 'Drawing, Survey, Lab & Testing Equipments',
        display: true,
      },
      { field: 'computerAccessories',
      title: 'Computer Accessories',
      display: true },
      { field: 'officeEquipment', title: 'Office Equipment', display: true },
      { field: 'plantMachinery', title: 'Plant & Machinery', display: true },
      { field: 'vehicles', title: 'Vehicle', display: true },
    ];
    // this.availColumns = this.columns.slice();
    this.displayedColumns = this.columns.map((column) => column.field);
    this.groupByColumns = ['mainLocationDescription'];
  }

  ngOnInit(): void {
    $('#rptOptionsModal').modal('show');

    this.getRegions();
    this.getLocation();

    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
    this.dataSource.filter = performance.now().toString();
    this.cdr.detectChanges();
  }

  getDisplayedColumns(): string[] {
    return this.columns
      .filter((cd) => cd.display == true)
      .map((cd) => cd.field);
  }

  getRegions() {
    // debugger;
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: "Bearer " + Token,
    });
    this.http
      // .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
      .get(
        this.app.serverUrl + 'getRegions?userId=' + this.cookie.get('userID'),
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
      'Content-Type': 'application/json',
      // Authorization: "Bearer " + Token,
    });
    this.http
      // .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
      .get(
        this.app.serverUrl + 'getLocations?userId=' + this.cookie.get('userID'),
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  printDiv() {
    this.app.printReport('#myTable');
  }

  exportExcel() {
    this.app.exportExcel('myTable', 'Asset Register');
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

  clear() {

    this.cmbRegion = '';
    this.cmbLocation = '';
  }

  getReport() {
    var region = 0;
    var location = 0;
    var regionName = [];
    var locationName = [];
    var userID = this.cookie.get("userID");

    //clear filters
    this.rptTitle2nd = "";

    // header setting
    if (this.tempRptTitle != "") {
      this.rptHeader = this.tempRptTitle;
    }

    if (this.cmbRegion == "" || this.cmbRegion == undefined) {
      region = 0;
    } else {
      region = parseInt(this.cmbRegion);
    }

    if (this.cmbOfficeTypeID == "" || this.cmbOfficeTypeID == undefined) {
      location = 0;
    } else {
      location = parseInt(this.cmbOfficeTypeID);
    }

    // http call
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.http
      .get(
        this.app.serverUrl +
          "getAssetCatSumRpt?mainLocID=" +
          region +
          "&subLocID=" +
          location,
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
        //this.dataSource.sort = this.sort;
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

      if (region !=0){
        regionName = this.regionList.filter(
          (x) => x.mainLocID == region
        );
        this.rptTitle2nd = 'Regional Office - <b>' + regionName[0].mainLocationDescription +'</b>';
      };

      if (location !=0 ){
        locationName = this.filteredLocList.filter(
          (x) => x.subLocID == location
        );
        this.rptTitle2nd = locationName[0].subLocationDescription;
      }

      if (region !=0 && location !=0){
        this.rptTitle2nd = regionName[0].mainLocationDescription + " - " + locationName[0].subLocationDescription;
      }
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
          case "mainLocationDescription":
            return this.compare(
              a.mainLocationDescription,
              b.mainLocationDescription,
              isAsc
            );
          case "subLocationDescription":
            return this.compare(
              a.subLocationDescription,
              b.subLocationDescription,
              isAsc
            );
          case "mainLocId":
            return this.compare(
              a.mainLocId,
              b.mainLocId,
              isAsc
            );
          case "subLocId":
            return this.compare(a.subLocId, b.subLocId, isAsc);
          case "furnitureFixture":
            return this.compare(
              a.furnitureFixture,
              b.furnitureFixture,
              isAsc
            );
            case "electricAndGas":
            return this.compare(
              a.electricAndGas,
              b.electricAndGas,
              isAsc
            );
            case "drawingSurveyLab":
            return this.compare(
              a.drawingSurveyLab,
              b.drawingSurveyLab,
              isAsc
            );
            case "computerAccessories":
            return this.compare(
              a.computerAccessories,
              b.computerAccessories,
              isAsc
            );
            case "officeEquipment":
            return this.compare(
              a.officeEquipment,
              b.officeEquipment,
              isAsc
            );
            case "plantMachinery":
            return this.compare(
              a.plantMachinery,
              b.plantMachinery,
              isAsc
            );
            case "vehicle":
            return this.compare(
              a.vehicles,
              b.vehicles,
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

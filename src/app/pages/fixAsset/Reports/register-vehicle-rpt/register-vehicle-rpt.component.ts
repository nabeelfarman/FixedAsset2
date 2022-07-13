import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
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

@Component({
  selector: "app-register-vehicle-rpt",
  templateUrl: "./register-vehicle-rpt.component.html",
  styleUrls: ["./register-vehicle-rpt.component.scss"],
})
export class RegisterVehicleRptComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2007/api/";
  //serverUrl = "http://192.168.100.162:12345/api/";

  // serverUrl = "http://192.168.100.162:6090/api/";

  // declarations
  searchLocation = "";
  cmbLocation = "";
  cmbOfcType = "";
  cmbWngSection = "";
  searchSection = "";
  tempRptTitle = "";
  rptTitle = "";

  assetRegisterList = [];
  filterAssetRegisterList = [];
  locList = [];
  ofcTypeList = [];
  wngSectionList = [];

  //group by table setting
  title = "Grid Grouping";

  public dataSource = new MatTableDataSource<any | Group>([]);

  _alldata: any[];
  columns: any[];
  displayedColumns: string[];
  groupByColumns: string[] = [];

  availColumns: any[];
  constructor(
    private http: HttpClient,
    private app: AppComponent,
    private cookie: CookieService,
    private cdr: ChangeDetectorRef
  ) {
    this.columns = [
      {
        field: "subLocationDescription",
        title: "Main Location",
      },
      {
        field: "officeTypeDescription",
        title: "Sub Location",
      },
      {
        field: "officeDescription",
        title: "Office",
      },
      {
        field: "accountsCatagory",
        title: "Asset Category",
      },
      {
        field: "assetCatDescription",
        title: "Vehicle Type",
      },
      {
        field: "tag",
        title: "Tag. ID",
      },
      {
        field: "postName",
        title: "Custodian",
      },
      { field: "vehMake", title: "Make" },
      { field: "vehType", title: "Type" },
      { field: "vehEngineNum", title: "Engine No." },
      { field: "vehModel", title: "Model" },
      { field: "vehChasisNum", title: "Chasis No." },
      {
        field: "ipcRef",
        title: "IPC/Invoice Ref.",
      },
      {
        field: "projectShortName",
        title: "Project",
      },
      {
        field: "purchaseDate",
        title: "Purchase Date",
      },
      {
        field: "costAmount",
        title: "Cost Price",
      },
      {
        field: "assetCondition",
        title: "Condition",
      },
      {
        field: "previousTag",
        title: "old Tag",
      },
    ];

    this.availColumns = this.columns.slice();
    this.displayedColumns = this.columns.map((column) => column.field);
    this.groupByColumns = ["subLocationDescription"];
  }

  // displayedColumns: string[] = ["position", "name", "weight", "symbol"];

  // dataSource: any;

  showItem() {
    console.log(this.availColumns[0].title);
    this.getAssetRegister();
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  ngOnInit(): void {
    this.getLocation();
    this.getAssetRegister();
    this.getOfficeType();
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

  showOfficeType() {
    var ofcType = this.locList.filter((x) => x.subLocID == this.cmbLocation);
    this.cmbOfcType = ofcType[0].officeTypeID;

    this.tempRptTitle =
      ofcType[0].subLocationDescription +
      " - " +
      ofcType[0].officeTypeDescription;

    this.getWingSection(this.cmbOfcType);
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

  printDiv() {
    this.app.printReport("#myTable");
  }

  exportExcel() {
    this.app.exportExcel("myTable", "Asset Register");
  }

  clear() {
    this.cmbLocation = "";
    this.cmbOfcType = "";
    this.cmbWngSection = "";
    this.tempRptTitle = "";
    this.rptTitle = "";
  }

  getAssetRegister() {
    debugger;
    var subLocID = 0;
    var officeTypeID = 0;
    var userID = this.cookie.get("userID");

    // header setting
    if (this.tempRptTitle != "") {
      this.rptTitle = this.tempRptTitle;
    }

    if (this.cmbLocation == "" || this.cmbLocation == undefined) {
      subLocID = 0;
    } else {
      subLocID = parseInt(this.cmbLocation);
    }

    if (this.cmbOfcType == "" || this.cmbOfcType == undefined) {
      officeTypeID = 0;
    } else {
      officeTypeID = parseInt(this.cmbOfcType);
    }
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getAssetdetailVehicles?UserId=" +
          userID +
          "&SubLocID=" +
          subLocID +
          "&OfficeTypeID=" +
          officeTypeID,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.assetRegisterList = data;
        this.filterAssetRegisterList = data;

        data.forEach((item, index) => {
          item.id = index + 1;
        });
        this._alldata = data;
        this.dataSource.data = this.addGroups(
          this._alldata,
          this.groupByColumns
        );
        this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
        this.dataSource.filter = performance.now().toString();
        this.cdr.detectChanges();

        // this.dataSource = this.filterAssetRegisterList;
      });
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
}

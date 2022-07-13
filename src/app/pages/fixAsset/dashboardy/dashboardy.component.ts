import { Component, OnInit } from "@angular/core";
import { Chart } from "angular-highcharts";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { AppComponent } from "../../../app.component";

import * as Highcharts from "highcharts";
import Drilldown from "highcharts/modules/drilldown.src.js";
Drilldown(Highcharts);

declare var $: any;

@Component({
  selector: "app-dashboardy",
  templateUrl: "./dashboardy.component.html",
  styleUrls: ["./dashboardy.component.scss"],
})
export class DashboardyComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2007/api/";
  // serverUrl = "http://192.168.100.162:5090/api/";

  loadingBar = true;
  itemPerPage = "10";
  p = 1;

  dtpDate;
  lblUserName = "";
  lblDate = "";
  lblTagSection = "";
  locationName = "";
  allLocation = "";
  comLocation = "";
  remLocation = "";
  allTags = "";
  cmbChartLocation = "";
  cmbTblLocation = "";
  cmbLocation = "";
  cmbOfcType = "";

  searchChartLocation = "";
  searchTblLocation = "";
  searchTag = "";
  searchLocation = "";
  searchTagOfc = "";
  searchTagLoc = "";
  sumTotalTag = 0;

  ofcTypeList = [];
  assetDetailList = [];
  tempLocList = [];
  tempTagList = [];
  allLocDetList = [];
  compLocDetList = [];
  remLocDetList = [];
  tagDetList = [];
  tagDetDtWiseList = [];
  totalTagList = [];
  locList = [];
  chartAssetDetailList = [];
  computerList = [];
  drawingList = [];
  electricList = [];
  furnitureList = [];
  officeList = [];
  plantList = [];
  vehicleList = [];
  tagSecList = [];
  tagLocWiseList = [];
  tagNumList = [];
  tagUserList = [];
  tagUserDateList = [];
  daysList = [];
  monthlyTagsList = [];

  test_chart: Chart;
  locationModalTitle: string;
  timeSeries_chart: Chart;

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.dtpDate = new Date();

    // Create the chart
    // this.testChart();
    this.getTagsSummary();
    this.getLocationDetail();
    this.getCompLocationDetail();
    this.getRemLocationDetail();
    this.getTagDetail();
    this.getTagDateWise();
    this.getLocation();
    // this.getAssetDetail();
    this.getOfficeType();
    this.getChartAssetDetail();
    this.getTagSecWise();
    this.getTimeSeriesChart();
    this.getTagNumWise();
  }

  getTagNumWise() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "gettagsnumberwise?userID=" + this.cookie.get("userID"), { headers: reqHeader })
      .subscribe((data: any) => {
        this.tagNumList = data;
        this.loadingBar = false;
      });
  }

  getTagUserWise(obj) {
    this.searchTag = "";
    this.lblUserName = obj.name;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "gettagsuserwise?UserId=" + obj.userId, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.tagUserList = data;
        // this.tagUserList;
        $("#userTagDateWise").modal("show");
      });
  }

  getTagUserDateWise(obj) {
    this.searchTag = "";
    this.lblDate = obj.createdDate;
    var dt = this.convertDate(obj.createdDate);
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "gettagsuserdatewise?UserId=" +
          obj.userId +
          "&reqDate=" +
          dt,
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.tagUserDateList = data;
        $("#userTagDateWiseLocationWiseModal").modal("show");
      });
  }

  getOfficeType() {
    this.loadingBar = false;

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getofctype", { headers: reqHeader })
      .subscribe((data: any) => {
        this.ofcTypeList = data;
        this.loadingBar = true;
      });
  }

  getChartAssetDetail() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getallassetdetaillocwisedashboard", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.chartAssetDetailList = data;
        for (var i = 0; i < this.chartAssetDetailList.length; i++) {
          if (
            this.chartAssetDetailList[i].accountsCatagoryDisplay == "PLANTS"
          ) {
            this.plantList.push([
              this.chartAssetDetailList[i].assetCatDescription,
              this.chartAssetDetailList[i].tagsCreated,
              this.chartAssetDetailList[i].subLocID,
            ]);
          } else if (
            this.chartAssetDetailList[i].accountsCatagoryDisplay == "COMPUTERS"
          ) {
            this.computerList.push([
              this.chartAssetDetailList[i].assetCatDescription,
              this.chartAssetDetailList[i].tagsCreated,
              this.chartAssetDetailList[i].subLocID,
            ]);
          } else if (
            this.chartAssetDetailList[i].accountsCatagoryDisplay ==
            "DRAWINGEQUIPMENT"
          ) {
            this.drawingList.push([
              this.chartAssetDetailList[i].assetCatDescription,
              this.chartAssetDetailList[i].tagsCreated,
              this.chartAssetDetailList[i].subLocID,
            ]);
          } else if (
            this.chartAssetDetailList[i].accountsCatagoryDisplay ==
            "ELECTRICITEMS"
          ) {
            this.electricList.push([
              this.chartAssetDetailList[i].assetCatDescription,
              this.chartAssetDetailList[i].tagsCreated,
              this.chartAssetDetailList[i].subLocID,
            ]);
          } else if (
            this.chartAssetDetailList[i].accountsCatagoryDisplay == "FURNITURES"
          ) {
            this.furnitureList.push([
              this.chartAssetDetailList[i].assetCatDescription,
              this.chartAssetDetailList[i].tagsCreated,
              this.chartAssetDetailList[i].subLocID,
            ]);
          } else if (
            this.chartAssetDetailList[i].accountsCatagoryDisplay == "VEHICLES"
          ) {
            this.vehicleList.push([
              this.chartAssetDetailList[i].assetCatDescription,
              this.chartAssetDetailList[i].tagsCreated,
              this.chartAssetDetailList[i].subLocID,
            ]);
          } else if (
            this.chartAssetDetailList[i].accountsCatagoryDisplay ==
            "OFFICEEQUIPMENTS"
          ) {
            this.officeList.push([
              this.chartAssetDetailList[i].assetCatDescription,
              this.chartAssetDetailList[i].tagsCreated,
              this.chartAssetDetailList[i].subLocID,
            ]);
          }
        }
        this.testChart();
      });
  }

  getAssetDetail() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getuserassetdetail?UserId=" +
          this.cookie.get("userID"),
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.assetDetailList = data;
        // this.assetDetailList;
      });
  }

  getAssetDetailLocOfcType() {
    if (this.cmbLocation != "" && this.cmbOfcType != "") {
      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: "Bearer " + Token,
      });

      this.http
        .get(
          this.app.serverUrl +
            "getassetdetail?UserId=0&SubLocID=" +
            this.cmbLocation +
            "&OfficeTypeID=" +
            this.cmbOfcType,
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          this.assetDetailList = data;
        });
    } else if (this.cmbLocation != "" && this.cmbOfcType == "") {
      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: "Bearer " + Token,
      });

      this.http
        .get(
          this.app.serverUrl + "getassetdetail?SubLocID=" + this.cmbLocation,
          {
            headers: reqHeader,
          }
        )
        .subscribe((data: any) => {
          this.assetDetailList = data;
        });
    } else if (this.cmbLocation == "" && this.cmbOfcType != "") {
      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: "Bearer " + Token,
      });

      this.http
        .get(
          this.app.serverUrl + "getassetdetail?OfficeTypeID=" + this.cmbOfcType,
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          this.assetDetailList = data;
        });
    }
  }

  editLocationModalTitle(text) {
    this.searchTag = "";
    this.locationModalTitle = text;
    if (text == "Total Locations") {
      this.tempLocList = this.allLocDetList;
    } else if (text == "Completed Locations") {
      this.tempLocList = this.compLocDetList;
    } else if (text == "Remaining Locations") {
      this.tempLocList = this.remLocDetList;
    } else if (text == "Total Tags") {
      this.tempTagList = this.tagDetList;
      this.totalTagSum();
    }
  }

  totalTagSum() {
    var tagSum = 0;
    for (var i = 0; i < this.tempTagList.length; i++) {
      tagSum += this.tempTagList[i].tagsCreated;
    }
    this.sumTotalTag = tagSum;
  }
  testChart() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getallassetdashboard?userID=" + this.cookie.get("userID"), { headers: reqHeader })
      .subscribe((data: any) => {
        let chart = new Chart({
          chart: {
            type: "column",
          },
          title: {
            text: "Asset by Categories",
            // style: {
            //   color: "#ddd",
            // },
          },
          xAxis: {
            type: "category",
          },
          yAxis: {
            title: {
              text: "Total Number of Assets",
            },
          },
          legend: {
            enabled: false,
          },

          tooltip: {
            headerFormat:
              '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat:
              '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>',
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                format: "{y}",
              },
            },
          },
          series: [
            {
              name: data[0].totalTagsCreated,
              data: [
                {
                  name: "Computers",
                  y: data[0].computers,
                  drilldown: "Computers",
                },
                {
                  name: "Drawing Equipment",
                  y: data[0].drawingequipment,
                  drilldown: "Drawing Equipment",
                },
                {
                  name: "Electric Items",
                  y: data[0].electricitems,
                  drilldown: "Electric Items",
                },
                {
                  name: "Furnitures",
                  y: data[0].furnitures,
                  drilldown: "Furnitures",
                },
                {
                  name: "Office Equipements",
                  y: data[0].officeequipments,
                  drilldown: "Office Equipements",
                },
                {
                  name: "Plants",
                  y: data[0].plants,
                  drilldown: "Plants",
                },
                {
                  name: "Vehicles",
                  y: data[0].vehicles,
                  drilldown: "Vehicles",
                },
              ],
            },
          ],
          drilldown: {
            series: [
              {
                name: "Computers",
                id: "Computers",
                data: this.computerList,
              },
              {
                name: "Drawing Equipment",
                id: "Drawing Equipment",
                data: this.drawingList,
              },
              {
                name: "Electric Items",
                id: "Electric Items",
                data: this.electricList,
              },
              {
                name: "Furnitures",
                id: "Furnitures",
                data: this.furnitureList,
              },
              {
                name: "Office Equipements",
                id: "Office Equipements",
                data: this.officeList,
              },
              {
                name: "Plants",
                id: "Plants",
                data: this.plantList,
              },
              {
                name: "Vehicles",
                id: "Vehicles",
                data: this.vehicleList,
              },
            ],
          },
        });

        this.test_chart = chart;
      });
  }

  changeChart() {
    this.daysList = [];
    this.monthlyTagsList = [];

    var oldDate = new Date(this.dtpDate);
    var m = oldDate.getMonth();
    m += 1; // JavaScript months are 0-11
    var y = oldDate.getFullYear();

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getmonthlytottags?month=" + m + "&year=" + y, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.daysList.push(data[i].day1);
          this.monthlyTagsList.push(data[i].tagsCreated);
        }

        let chart = new Chart({
          chart: {
            type: "area",
          },
          title: {
            text: "Last Month Tags Data",
          },
          xAxis: {
            // allowDecimals: true,
            categories: this.daysList,
            // min: this.daysList[0],
            // max: this.daysList[this.daysList.length],
            labels: {
              formatter: function () {
                return this.value; // clean, unformatted number for year
              },
            },
          },
          yAxis: {
            title: {
              text: "Total Tags",
            },
            labels: {
              formatter: function () {
                return this.value;
              },
            },
          },
          plotOptions: {
            area: {
              pointStart: 1,
              marker: {
                enabled: false,
                symbol: "circle",
                radius: 2,
                states: {
                  hover: {
                    enabled: true,
                  },
                },
              },
            },
          },
          series: [
            {
              name: "Tags",
              data: this.monthlyTagsList,
            },
          ],
        });
        this.timeSeries_chart = chart;
      });
  }

  getTimeSeriesChart() {
    var oldDate = new Date(this.dtpDate);
    var m = oldDate.getMonth();
    m += 1; // JavaScript months are 0-11
    var y = oldDate.getFullYear();

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getmonthlytottags?month=" + m + "&year=" + y, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.daysList.push(data[i].day1);
          this.monthlyTagsList.push(data[i].tagsCreated);
        }

        let chart = new Chart({
          chart: {
            type: "area",
          },
          title: {
            text: "Last Month Tags Data",
          },
          xAxis: {
            // allowDecimals: true,
            categories: this.daysList,
            // min: this.daysList[0],
            // max: this.daysList[this.daysList.length],
            labels: {
              formatter: function () {
                return this.value; // clean, unformatted number for year
              },
            },
          },
          yAxis: {
            title: {
              text: "Total Tags",
            },
            labels: {
              formatter: function () {
                return this.value;
              },
            },
          },
          plotOptions: {
            area: {
              pointStart: 1,
              marker: {
                enabled: false,
                symbol: "circle",
                radius: 2,
                states: {
                  hover: {
                    enabled: true,
                  },
                },
              },
            },
          },
          series: [
            {
              name: "Tags",
              data: this.monthlyTagsList,
            },
          ],
        });
        this.timeSeries_chart = chart;
      });
  }

  getChartLocationWise() {
    this.officeList = [];
    this.plantList = [];
    this.computerList = [];
    this.drawingList = [];
    this.electricList = [];
    this.furnitureList = [];
    this.vehicleList = [];

    for (var i = 0; i < this.chartAssetDetailList.length; i++) {
      if (this.chartAssetDetailList[i].subLocID == this.cmbChartLocation) {
        if (this.chartAssetDetailList[i].accountsCatagoryDisplay == "PLANTS") {
          this.plantList.push([
            this.chartAssetDetailList[i].assetCatDescription,
            this.chartAssetDetailList[i].tagsCreated,
            this.chartAssetDetailList[i].subLocID,
          ]);
        } else if (
          this.chartAssetDetailList[i].accountsCatagoryDisplay == "COMPUTERS"
        ) {
          this.computerList.push([
            this.chartAssetDetailList[i].assetCatDescription,
            this.chartAssetDetailList[i].tagsCreated,
            this.chartAssetDetailList[i].subLocID,
          ]);
        } else if (
          this.chartAssetDetailList[i].accountsCatagoryDisplay ==
          "DRAWINGEQUIPMENT"
        ) {
          this.drawingList.push([
            this.chartAssetDetailList[i].assetCatDescription,
            this.chartAssetDetailList[i].tagsCreated,
            this.chartAssetDetailList[i].subLocID,
          ]);
        } else if (
          this.chartAssetDetailList[i].accountsCatagoryDisplay ==
          "ELECTRICITEMS"
        ) {
          this.electricList.push([
            this.chartAssetDetailList[i].assetCatDescription,
            this.chartAssetDetailList[i].tagsCreated,
            this.chartAssetDetailList[i].subLocID,
          ]);
        } else if (
          this.chartAssetDetailList[i].accountsCatagoryDisplay == "FURNITURES"
        ) {
          this.furnitureList.push([
            this.chartAssetDetailList[i].assetCatDescription,
            this.chartAssetDetailList[i].tagsCreated,
            this.chartAssetDetailList[i].subLocID,
          ]);
        } else if (
          this.chartAssetDetailList[i].accountsCatagoryDisplay == "VEHICLES"
        ) {
          this.vehicleList.push([
            this.chartAssetDetailList[i].assetCatDescription,
            this.chartAssetDetailList[i].tagsCreated,
            this.chartAssetDetailList[i].subLocID,
          ]);
        } else if (
          this.chartAssetDetailList[i].accountsCatagoryDisplay ==
          "OFFICEEQUIPMENTS"
        ) {
          this.officeList.push([
            this.chartAssetDetailList[i].assetCatDescription,
            this.chartAssetDetailList[i].tagsCreated,
            this.chartAssetDetailList[i].subLocID,
          ]);
        }
      }
    }

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getallassetlocwisedashboard?LocationID=" +
          this.cmbChartLocation,
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        let chart = new Chart({
          chart: {
            type: "column",
          },
          title: {
            text: "Asset by Categories",
          },
          xAxis: {
            type: "category",
          },
          yAxis: {
            title: {
              text: "Total Number of Assets",
            },
          },
          legend: {
            enabled: false,
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                format: "{y}",
              },
            },
          },
          series: [
            {
              name: data[0].totalTagsCreated,
              data: [
                {
                  name: "Computers",
                  y: data[0].computers,
                  drilldown: "Computers",
                },
                {
                  name: "Drawing Equipment",
                  y: data[0].drawingequipment,
                  drilldown: "Drawing Equipment",
                },
                {
                  name: "Electric Items",
                  y: data[0].electricitems,
                  drilldown: "Electric Items",
                },
                {
                  name: "Furnitures",
                  y: data[0].furnitures,
                  drilldown: "Furnitures",
                },
                {
                  name: "Office Equipements",
                  y: data[0].officeequipments,
                  drilldown: "Office Equipements",
                },
                {
                  name: "Plants",
                  y: data[0].plants,
                  drilldown: "Plants",
                },
                {
                  name: "Vehicles",
                  y: data[0].vehicles,
                  drilldown: "Vehicles",
                },
              ],
            },
          ],
          drilldown: {
            series: [
              {
                name: "Computers",
                id: "Computers",
                data: this.computerList,
              },
              {
                name: "Drawing Equipment",
                id: "Drawing Equipment",
                data: this.drawingList,
              },
              {
                name: "Electric Items",
                id: "Electric Items",
                data: this.electricList,
              },
              {
                name: "Furnitures",
                id: "Furnitures",
                data: this.furnitureList,
              },
              {
                name: "Office Equipements",
                id: "Office Equipements",
                data: this.officeList,
              },
              {
                name: "Plants",
                id: "Plants",
                data: this.plantList,
              },
              {
                name: "Vehicles",
                id: "Vehicles",
                data: this.vehicleList,
              },
            ],
          },
        });

        this.test_chart = chart;
      });
  }

  getTagSecWise() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "gettagssectionwise", { headers: reqHeader })
      .subscribe((data: any) => {
        this.tagSecList = data;
        // this.tagSecList.reverse();
      });
  }

  getTagDateWise() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getalltagsdetaildatewise?userID=" + 
      this.cookie.get("userID"), {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.totalTagList = data;
        this.totalTagList;
      });
  }

  getLocation() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
      .subscribe((data: any) => {
        this.locList = data;
      });
  }

  public convertDate(myDate) {
    var oldDate = new Date(myDate);
    
    var dt =new Date();

    // alert(myDate);
    // alert(dt);
    // alert(oldDate.getDate())
    
    var d = oldDate.getDate();
    var m = oldDate.getMonth();
    m += 1; // JavaScript months are 0-11
    var y = oldDate.getFullYear();

    var convertedDate = y + "-" + m + "-" + d;

    return convertedDate;
  }

  getTblDataLocWise() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "gettagsdetaillocwise?LocationID=" +
          this.cmbTblLocation + 
          "&userID=" + this.cookie.get("userID"),
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.totalTagList = data;
        this.totalTagList;
      });
  }

  getTagLocWise(item) {
    this.searchTag = "";
    this.lblTagSection = item.officeDescription;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "gettagslocationwise?OfficeSecID=" +
          item.officeSecID,
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.tagLocWiseList = data;
        $("#sectionTagLocationWiseModal").modal("show");
      });
  }

  getTagDetailDateWise(item) {
    this.searchTag = "";
    // alert(item.createdDate)
    var dt = this.convertDate(item.createdDate);
    // alert(dt)
    if (this.cmbTblLocation == "") {
      this.locationName = dt;
      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: "Bearer " + Token,
      });

      this.http
        .get(this.app.serverUrl + "gettagsdetaildatewise?reqDate=" + dt, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          this.tagDetDtWiseList = data;
          $("#officeTypeTagsDtWiseModal").modal("show");
        });
    } else if (this.cmbTblLocation != "") {
      for (var i = 0; i < this.locList.length; i++) {
        if (this.locList[i].subLocID == this.cmbTblLocation) {
          this.locationName =
            this.locList[i].subLocationDescription +
            " - " +
            this.locList[i].mainLocationDescription +
            " - " +
            this.locList[i].provinceName;
          i = this.locList.length + 1;
        }
      }

      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: "Bearer " + Token,
      });

      this.http
        .get(
          this.app.serverUrl +
            "gettagsdetaildatewise?reqDate=" +
            dt +
            "&LocationID=" +
            this.cmbTblLocation,
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          this.tagDetDtWiseList = data;
          $("#officeTypeTagsModal").modal("show");
        });
    }
  }

  getTagsSummary() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "gettagssummary?userID=" + this.cookie.get("userID"), { headers: reqHeader })
      .subscribe((data: any) => {
        this.allLocation = data[0].allLocations;
        this.comLocation = data[0].completedLocations;
        this.remLocation = data[0].incompletelocations;
        this.allTags = data[0].totaltags;
      });
  }

  getLocationDetail() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getlocdetail?userID=" + this.cookie.get("userID"), { headers: reqHeader })
      .subscribe((data: any) => {
        this.allLocDetList = data;
      });
  }

  getCompLocationDetail() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getcomplocdetail?userID=" + this.cookie.get("userID"), { headers: reqHeader })
      .subscribe((data: any) => {
        this.compLocDetList = data;
      });
  }

  getRemLocationDetail() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getincomplocdetail?userID=" + this.cookie.get("userID"), { headers: reqHeader })
      .subscribe((data: any) => {
        this.remLocDetList = data;
      });
  }

  getTagDetail() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "gettagsdetaildb?userID=" + this.cookie.get("userID"), { headers: reqHeader })
      .subscribe((data: any) => {
        this.tagDetList = data;
      });
  }

  clear() {
    this.cmbOfcType = "";
    this.cmbChartLocation = "";
    this.cmbTblLocation = "";
    this.cmbLocation = "";

    this.testChart();
    this.getTagDateWise();
    this.getAssetDetail();

    this.officeList = [];
    this.plantList = [];
    this.computerList = [];
    this.drawingList = [];
    this.electricList = [];
    this.furnitureList = [];
    this.vehicleList = [];

    for (var i = 0; i < this.chartAssetDetailList.length; i++) {
      if (this.chartAssetDetailList[i].accountsCatagoryDisplay == "PLANTS") {
        this.plantList.push([
          this.chartAssetDetailList[i].assetCatDescription,
          this.chartAssetDetailList[i].tagsCreated,
          this.chartAssetDetailList[i].subLocID,
        ]);
      } else if (
        this.chartAssetDetailList[i].accountsCatagoryDisplay == "COMPUTERS"
      ) {
        this.computerList.push([
          this.chartAssetDetailList[i].assetCatDescription,
          this.chartAssetDetailList[i].tagsCreated,
          this.chartAssetDetailList[i].subLocID,
        ]);
      } else if (
        this.chartAssetDetailList[i].accountsCatagoryDisplay ==
        "DRAWINGEQUIPMENT"
      ) {
        this.drawingList.push([
          this.chartAssetDetailList[i].assetCatDescription,
          this.chartAssetDetailList[i].tagsCreated,
          this.chartAssetDetailList[i].subLocID,
        ]);
      } else if (
        this.chartAssetDetailList[i].accountsCatagoryDisplay == "ELECTRICITEMS"
      ) {
        this.electricList.push([
          this.chartAssetDetailList[i].assetCatDescription,
          this.chartAssetDetailList[i].tagsCreated,
          this.chartAssetDetailList[i].subLocID,
        ]);
      } else if (
        this.chartAssetDetailList[i].accountsCatagoryDisplay == "FURNITURES"
      ) {
        this.furnitureList.push([
          this.chartAssetDetailList[i].assetCatDescription,
          this.chartAssetDetailList[i].tagsCreated,
          this.chartAssetDetailList[i].subLocID,
        ]);
      } else if (
        this.chartAssetDetailList[i].accountsCatagoryDisplay == "VEHICLES"
      ) {
        this.vehicleList.push([
          this.chartAssetDetailList[i].assetCatDescription,
          this.chartAssetDetailList[i].tagsCreated,
          this.chartAssetDetailList[i].subLocID,
        ]);
      } else if (
        this.chartAssetDetailList[i].accountsCatagoryDisplay ==
        "OFFICEEQUIPMENTS"
      ) {
        this.officeList.push([
          this.chartAssetDetailList[i].assetCatDescription,
          this.chartAssetDetailList[i].tagsCreated,
          this.chartAssetDetailList[i].subLocID,
        ]);
      }
    }
  }

  getData(item: any){
    // alert('ok');
    // console.log(item)

    this.assetDetailList = item;
  }
}

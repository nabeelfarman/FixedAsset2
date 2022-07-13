import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// user module pages
import { LoginComponent } from "./pages/user/login/login.component";
import { UserRegisterationComponent } from "./pages/user/adminPanel/user-registeration/user-registeration.component";

// fix asset pages
import { AssetEntryComponent } from "./pages/fixAsset/asset-entry/asset-entry.component";
import { DashboardyComponent } from "./pages/fixAsset/dashboardy/dashboardy.component";
import { NHALocComponent } from "./pages/fixasset/configuration/nhaloc/nhaloc.component";
import { NHASectionComponent } from "./pages/fixasset/configuration/nhasection/nhasection.component";
import { NHAOfficeTypeComponent } from "./pages/fixasset/configuration/nhaoffice-type/nhaoffice-type.component";
import { AssetCategoryComponent } from "./pages/fixasset/configuration/asset-category/asset-category.component";
import { NHAPostsComponent } from "./pages/fixasset/configuration/nhaposts/nhaposts.component";
import { NHAProjectsComponent } from "./pages/fixasset/configuration/nhaprojects/nhaprojects.component";
import { NHAProjectIPCComponent } from "./pages/fixasset/configuration/nhaproject-ipc/nhaproject-ipc.component";
import { NHAFreeholdLandComponent } from "./pages/fixAsset/nhafreehold-land/nhafreehold-land.component";
import { NHARoadsComponent } from "./pages/fixasset/nharoads/nharoads.component";
import { BridgesComponent } from "./pages/fixasset/bridges/bridges.component";
import { NhabuldingsComponent } from "./pages/fixasset/nhabuldings/nhabuldings.component";
import { CreateBuildingComponent } from "./pages/fixasset/configuration/create-building/create-building.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { LocationCompleteComponent } from "./pages/fixasset/location-complete/location-complete.component";
import { AssetRegisterRptComponent } from "./pages/fixAsset/Reports/asset-register-rpt/asset-register-rpt.component";
import { LandReportComponent } from "./pages/fixAsset/Reports/land-report/land-report.component";
import { RegisterVehicleRptComponent } from "./pages/fixAsset/Reports/register-vehicle-rpt/register-vehicle-rpt.component";
import { RevaluationMoveAssetComponent } from "./pages/fixAsset/revaluation-move-asset/revaluation-move-asset.component";
import { AssetpurchaseComponent } from "./pages/fixAsset/assetpurchase/assetpurchase.component";
import { UpdationLogRptComponent } from "./pages/fixAsset/Reports/updation-log-rpt/updation-log-rpt.component";
import { NharoadReportComponent } from "./pages/fixAsset/Reports/nharoad-report/nharoad-report.component";
import { NhaBridgesReportComponent } from "./pages/fixAsset/Reports/nha-bridges-report/nha-bridges-report.component";
import { NhaBuildingReportComponent } from "./pages/fixAsset/Reports/nha-building-report/nha-building-report.component";
import { AssetCategorySumReportComponent } from "./pages/fixasset/reports/asset-category-sum-report/asset-category-sum-report.component";
import { AssetCategoryDetailReportComponent } from "./pages/fixAsset/Reports/asset-category-detail-report/asset-category-detail-report.component";
import { FurnitureRegisterComponent } from "./pages/admin-reports/furniture-register/furniture-register.component";
import { OfficeEquipmentRegisterComponent } from "./pages/admin-reports/office-equipment-register/office-equipment-register.component";
import { AdminVehicleRegisterComponent } from "./pages/admin-reports/admin-vehicle-register/admin-vehicle-register.component";
import { AdminMachineryRegisterComponent } from "./pages/admin-reports/admin-machinery-register/admin-machinery-register.component";
import { AdminPlotsRegisterComponent } from "./pages/admin-reports/admin-plots-register/admin-plots-register.component";
import { AdminLandRegisterComponent } from "./pages/admin-reports/admin-land-register/admin-land-register.component";
import { AdminWolRegisterComponent } from "./pages/admin-reports/admin-wol-register/admin-wol-register.component";
import { AdminOwnBuildingRegisterComponent } from "./pages/admin-reports/admin-own-building-register/admin-own-building-register.component";
import { AdminRoadRegisterComponent } from "./pages/admin-reports/admin-road-register/admin-road-register.component";
import { AdminDisposalRegisterComponent } from "./pages/admin-reports/admin-disposal-register/admin-disposal-register.component";
import { AssetDisposalComponent } from "./pages/fixasset/asset-disposal/asset-disposal.component";
import { TransferExternalRptComponent } from "./pages/fixasset/reports/transfer-external-rpt/transfer-external-rpt.component";
import { WriteOffComponent } from "./pages/fixAsset/write-off/write-off.component";
import { TransferComponent } from "./pages/fixAsset/transfer/transfer.component";
import { AssetToBeCreateComponent } from "./pages/fixAsset/asset-to-be-create/asset-to-be-create.component";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  {
    path: "home",
    component: HomePageComponent,
  },
  {
    path: "userRegisteration",
    component: UserRegisterationComponent,
  },

  // fix asset pages
  {
    path: "assetEntry",
    component: AssetEntryComponent,
  },
  {
    path: "dashboard",
    component: DashboardyComponent,
  },
  {
    path: "locComp",
    component: LocationCompleteComponent,
  },
  {
    path: "disofasset",
    component: AssetDisposalComponent,
  },
  // Configuration
  {
    path: "nhaLoc",
    component: NHALocComponent,
  },
  {
    path: "nhaSec",
    component: NHASectionComponent,
  },
  {
    path: "nhaOfficeType",
    component: NHAOfficeTypeComponent,
  },
  {
    path: "assetCat",
    component: AssetCategoryComponent,
  },
  {
    path: "nhaPost",
    component: NHAPostsComponent,
  },
  {
    path: "nhaProject",
    component: NHAProjectsComponent,
  },
  {
    path: "nhaProjectIPC",
    component: NHAProjectIPCComponent,
  },
  {
    path: "createBuilding",
    component: CreateBuildingComponent,
  },
  // end Configuration
  {
    path: "freeholdLand",
    component: NHAFreeholdLandComponent,
  },
  {
    path: "nhaRoads",
    component: NHARoadsComponent,
  },
  {
    path: "nhaBridges",
    component: BridgesComponent,
  },
  {
    path: "nhaBuildings",
    component: NhabuldingsComponent,
  },

  // Fixed Asset Report
  {
    path: "assetRegisterRpt/:id",
    component: AssetRegisterRptComponent,
  },
  {
    path: "landReport",
    component: LandReportComponent,
  },
  {
    path: "roadReport",
    component: NharoadReportComponent,
  },
  {
    path: "bridgeReport",
    component: NhaBridgesReportComponent,
  },
  {
    path: "buildingReport",
    component: NhaBuildingReportComponent,
  },
  {
    path: "assetCatSumRpt",
    component: AssetCategorySumReportComponent,
  },
  {
    path: "assetCatDetailRpt",
    component: AssetCategoryDetailReportComponent,
  },
  {
    path: "updationLogRpt",
    component: UpdationLogRptComponent,
  },
  {
    path: "externalTransferRpt",
    component: TransferExternalRptComponent,
  },
  //////////////////////

  // Admin Manual Report
  {
    path: "adminFurniture",
    component: FurnitureRegisterComponent,
  },
  {
    path: "adminOfficeEquip",
    component: OfficeEquipmentRegisterComponent,
  },
  {
    path: "adminVehicle",
    component: AdminVehicleRegisterComponent,
  },
  {
    path: "adminMachinery",
    component: AdminMachineryRegisterComponent,
  },
  {
    path: "adminPlot",
    component: AdminPlotsRegisterComponent,
  },
  {
    path: "adminLand",
    component: AdminLandRegisterComponent,
  },
  {
    path: "adminWOL",
    component: AdminWolRegisterComponent,
  },
  {
    path: "adminOwnBuilding",
    component: AdminOwnBuildingRegisterComponent,
  },
  {
    path: "adminRoad",
    component: AdminRoadRegisterComponent,
  },
  {
    path: "adminDisposal",
    component: AdminDisposalRegisterComponent,
  },
  /////////////////////////////

  {
    path: "registerVehicle",
    component: RegisterVehicleRptComponent,
  },
  {
    path: "revaluation",
    component: RevaluationMoveAssetComponent,
  },
  {
    path: "assetpurchase",
    component: AssetpurchaseComponent,
  },
  {
    path: "writeOff",
    component: WriteOffComponent,
  },
  {
    path: "transfer",
    component: TransferComponent,
  },
  {
    path: "assetCreate",
    component: AssetToBeCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

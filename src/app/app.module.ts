import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material.module';
import { PNPrimeModule } from './shared/pnprime/pnprime.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule } from 'angular-highcharts';
import { UserIdleModule } from 'angular-user-idle';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angular2-qrcode';
import { HashLocationStrategy, LocationStrategy, DatePipe } from '@angular/common';

import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG, } from 'ng2-currency-mask';
export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  decimal: '.',
  precision: 0,
  prefix: '',
  suffix: '',
  thousands: ',',
};

import {NgxMaskModule, IConfig} from 'ngx-mask';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderService } from './loadingservices/loader.service';
import { LoaderInterceptor } from './loadingservices/loader-interceptor.service';
import { CustomloaderComponent } from './loadingservices/customloader/customloader.component';

import { ToastrModule } from 'ng6-toastr-notifications';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { InputTextModule } from 'primeng/inputtext';
import { SearchPipe } from './shared/pipe-filters/pipe-search';
import { SortPipe } from './shared/pipe-filters/pipe-sort';
import { TruncatePipe } from './shared/pipe-filters/TruncatePipe';
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './pages/user/login/login.component';
import { AssetEntryComponent } from './pages/fixAsset/asset-entry/asset-entry.component';
import { DashboardyComponent } from './pages/fixAsset/dashboardy/dashboardy.component';
import { NHALocComponent } from './pages/fixasset/configuration/nhaloc/nhaloc.component';
import { NHASectionComponent } from './pages/fixasset/configuration/nhasection/nhasection.component';
import { NHAOfficeTypeComponent } from './pages/fixasset/configuration/nhaoffice-type/nhaoffice-type.component';
import { AssetCategoryComponent } from './pages/fixasset/configuration/asset-category/asset-category.component';
import { NHAPostsComponent } from './pages/fixasset/configuration/nhaposts/nhaposts.component';
import { NHAProjectsComponent } from './pages/fixasset/configuration/nhaprojects/nhaprojects.component';
import { NHAProjectIPCComponent } from './pages/fixasset/configuration/nhaproject-ipc/nhaproject-ipc.component';
import { NHAFreeholdLandComponent } from './pages/fixAsset/nhafreehold-land/nhafreehold-land.component';
import { UserRegisterationComponent } from './pages/user/adminPanel/user-registeration/user-registeration.component';
import { NHARoadsComponent } from './pages/fixasset/nharoads/nharoads.component';
import { BridgesComponent } from './pages/fixasset/bridges/bridges.component';
import { NhabuldingsComponent } from './pages/fixasset/nhabuldings/nhabuldings.component';
import { CreateBuildingComponent } from './pages/fixasset/configuration/create-building/create-building.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LocationCompleteComponent } from './pages/fixasset/location-complete/location-complete.component';
import { AssetRegisterRptComponent } from './pages/fixAsset/Reports/asset-register-rpt/asset-register-rpt.component';
import { OnCreateDirective } from './on-create.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { LandReportComponent } from './pages/fixAsset/Reports/land-report/land-report.component';
import { RegisterVehicleRptComponent } from './pages/fixAsset/Reports/register-vehicle-rpt/register-vehicle-rpt.component';
import { RevaluationMoveAssetComponent } from './pages/fixAsset/revaluation-move-asset/revaluation-move-asset.component';
import { AssetpurchaseComponent } from './pages/fixAsset/assetpurchase/assetpurchase.component';

import { NgxImageCompressService } from 'ngx-image-compress';
import { UpdationLogRptComponent } from './pages/fixAsset/Reports/updation-log-rpt/updation-log-rpt.component';
import { ImmovableAssetRptComponent } from './pages/fixAsset/Reports/immovable-asset-rpt/immovable-asset-rpt.component';
import { NharoadReportComponent } from './pages/fixAsset/Reports/nharoad-report/nharoad-report.component';
import { NhaBridgesReportComponent } from './pages/fixAsset/Reports/nha-bridges-report/nha-bridges-report.component';
import { NhaBuildingReportComponent } from './pages/fixAsset/Reports/nha-building-report/nha-building-report.component';
import { AssetCategorySumReportComponent } from './pages/fixasset/reports/asset-category-sum-report/asset-category-sum-report.component';
import { AssetCategoryDetailReportComponent } from './pages/fixAsset/Reports/asset-category-detail-report/asset-category-detail-report.component';
import { FurnitureRegisterComponent } from './pages/admin-reports/furniture-register/furniture-register.component';
import { OfficeEquipmentRegisterComponent } from './pages/admin-reports/office-equipment-register/office-equipment-register.component';
import { AdminVehicleRegisterComponent } from './pages/admin-reports/admin-vehicle-register/admin-vehicle-register.component';
import { AdminMachineryRegisterComponent } from './pages/admin-reports/admin-machinery-register/admin-machinery-register.component';
import { AdminPlotsRegisterComponent } from './pages/admin-reports/admin-plots-register/admin-plots-register.component';
import { AdminLandRegisterComponent } from './pages/admin-reports/admin-land-register/admin-land-register.component';
import { AdminWolRegisterComponent } from './pages/admin-reports/admin-wol-register/admin-wol-register.component';
import { AdminOwnBuildingRegisterComponent } from './pages/admin-reports/admin-own-building-register/admin-own-building-register.component';
import { AdminRoadRegisterComponent } from './pages/admin-reports/admin-road-register/admin-road-register.component';
import { AdminDisposalRegisterComponent } from './pages/admin-reports/admin-disposal-register/admin-disposal-register.component';
import { AssetDisposalComponent } from './pages/fixasset/asset-disposal/asset-disposal.component';
import { TransferExternalRptComponent } from './pages/fixasset/reports/transfer-external-rpt/transfer-external-rpt.component';
import { WriteOffComponent } from './pages/fixAsset/write-off/write-off.component';
import { TransferComponent } from './pages/fixAsset/transfer/transfer.component';
import { AssetToBeCreateComponent } from './pages/fixAsset/asset-to-be-create/asset-to-be-create.component';
import { GlobalSearchComponent } from './pages/fixAsset/global-search/global-search.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchPipe,
    SortPipe,
    TruncatePipe,
    LoginComponent,
    AssetEntryComponent,
    DashboardyComponent,
    NHALocComponent,
    NHASectionComponent,
    NHAOfficeTypeComponent,
    AssetCategoryComponent,
    NHAPostsComponent,
    NHAProjectsComponent,
    NHAProjectIPCComponent,
    NHAFreeholdLandComponent,
    UserRegisterationComponent,
    NHARoadsComponent,
    BridgesComponent,
    NhabuldingsComponent,
    CreateBuildingComponent,
    HomePageComponent,
    LocationCompleteComponent,
    AssetRegisterRptComponent,
    OnCreateDirective,
    LandReportComponent,
    RegisterVehicleRptComponent,
    RevaluationMoveAssetComponent,
    AssetpurchaseComponent,
    CustomloaderComponent,
    UpdationLogRptComponent,
    ImmovableAssetRptComponent,
    NharoadReportComponent,
    NhaBridgesReportComponent,
    NhaBuildingReportComponent,
    AssetCategorySumReportComponent,
    AssetCategoryDetailReportComponent,
    FurnitureRegisterComponent,
    OfficeEquipmentRegisterComponent,
    AdminVehicleRegisterComponent,
    AdminMachineryRegisterComponent,
    AdminPlotsRegisterComponent,
    AdminLandRegisterComponent,
    AdminWolRegisterComponent,
    AdminOwnBuildingRegisterComponent,
    AdminRoadRegisterComponent,
    AdminDisposalRegisterComponent,
    AssetDisposalComponent,
    TransferExternalRptComponent,
    WriteOffComponent,
    TransferComponent,
    AssetToBeCreateComponent,
    GlobalSearchComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ChartModule,
    ReactiveFormsModule,
    PNPrimeModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    OrderModule,
    NgxPaginationModule,
    InputTextModule,
    CurrencyMaskModule,
    ZXingScannerModule,
    QRCodeModule,
    DragDropModule,
    CdkTableModule,
    CdkTreeModule,
    // Optionally you can set time for `idle`, `timeout` and `ping` in seconds.
    // Default values: `idle` is 60 (1 minutes), `timeout` is 30 (0.5 minutes)
    // and `ping` is 15 0.25 minutes).
    UserIdleModule.forRoot({ idle: 300, timeout: 300, ping: 15 }),
    NgxMaskModule.forRoot(),
  ],
  providers: [
    ImmovableAssetRptComponent,
    NgxImageCompressService,
    CookieService,
    DatePipe,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [OnCreateDirective,GlobalSearchComponent],
})
export class AppModule {}

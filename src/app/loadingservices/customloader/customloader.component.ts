import { Component, OnInit } from "@angular/core";
import { LoaderService } from "../../loadingservices/loader.service";

@Component({
  selector: "app-customloader",
  templateUrl: "./customloader.component.html",
  styleUrls: ["./customloader.component.scss"],
})
export class CustomloaderComponent implements OnInit {
  loading: boolean;

  constructor(private loaderService: LoaderService) {
    this.loaderService.isLoading.subscribe((v) => {
      console.log(v);
      this.loading = v;
    });
  }
  ngOnInit() {}
}

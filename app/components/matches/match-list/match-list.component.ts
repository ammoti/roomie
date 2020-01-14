import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  Output,
  EventEmitter,
  Input
} from "@angular/core";
import { MatchService, BackendService } from "~/services";
import { alert } from "../../../shared";
import { Router } from "@angular/router";

declare var UIColor: any;

@Component({
  selector: "rm-match-list",
  moduleId: module.id,
  templateUrl: "./match-list.component.html",
  styleUrls: ["./match-list.component.css"]
})
export class MatchListComponent implements AfterViewInit {
  @Input() row;
  @Output() loading = new EventEmitter();
  @Output() loaded = new EventEmitter();

  public matches: MatchService;
  listLoaded: boolean = false;
  blankAvatar: string =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb5+fnv7+/l5eXp6en4+Pj8/Pzy8vLX19fMzMzg4ODQ0NDU1NRIt22FAAAFZElEQVR4nO2d3baqOgyFMQiCgLz/2+5WBwdxoQJJmllPvrt1t+ZoyX9jUTiO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziOYwHNxD9L6/9HkqCpvHVDXVeRSz10Y188dP4CRLehatrTkvZ8vYxllG79/zGhcry8inviOvR5H2U5Vh/kPWi63vrfPAr1XfNN3oPLrcjwIKn/dDv/HmRuEqkYtsu7U/U5aSTqzjsFBi75aKS+2q8v0AyZSDx0gA+qLCxOeTmqL3Ae4SVSf2UIDAzWCr5At8M3dKK21vAR6rj6AhVwpEp7nWBuEoUEhngc1NzQKCQwOH9rLevcxAQGiYgXtd+YSGwDMbwRFXg6wSUbVMsKPJ3B7qmII1xytda0pGeHMn+pke4pcaLtd7RA9RuFOxppcA6RhO3oBEwqpXSEwdig2NN+R1FtHwNGRVzcFc6cMYyN3hGCBG9qX2EEI49SMqQPRmt1hWzS9JfK/hBVwpkZgMCGFO1MxDyLEixdrGN+TZUvabim1j5fKySdsbamvbbAkCaanqKqu39gnOurf4YBW39BzE7TFm6mCkt1QxM8oqVA0jc0xhUp0g1KH9j6fH1TalyQEuunfeL88wpbU4UJ3OHp5ApdoSu0V2goULMYPGNrS3/fH/58TFNo16EitnFpitziYqqwVK6WRoy7MylyfFOF/4M6jb67aEwFaneeIraGJpgahVGhJdatGf2+hXV7TT2qMe9zk7ZHtJ9V0K56W1/SQjs0Nb+khXbgZn9JlZ1+Y90BvvPzM1EFHXttuIXWtrM2odiesY7YJtTqUSCjiYXe1JB1SDqjZE6t86ZnSpXABmbMu1Ca/TKf91qgcE/hngVJO8XWtgC1gnTlFGRM/wkaRV0Giq9/RjTbB33sLGdtGphgZolYVarF3XIiI/EMZ0ZnRGLwBvcEI/xvsSqhBfItKuRL/AV040Th7ZDF+rbj9qYBtjELtu5pewX/hs4cOcYGKR/8CvV7NTam49y7oaLbq7DqsrAxd4jK+siH2NRlFrs+icbr0TyqvY7wC9uIOl6yX2FrjOfH0he5juGDxLysIvoeGq2lrMPetvesETC9oKKWrNO0NdbnWIaUQvqJV9xKC/Q1svZdvgMpSr3pvNFrMPqjgUGrzd1CrPqkUq/JDVHSEFhY+hHzuht12mPQrW0jOMl7C8uJkzLFk5nTqTZzGypecA0rz6hqRCEkJniI8B8WL4N0xi/ekn45XbJvcCJ5zzS1wNTfYpKXla+k3B5hIjDlLp4k7yrXSBXA0S3Bk7xVUk0RpXhV+Y40MxppHeGSFEujjKzMhL5BVd+x9w31JqPm04NNaL9lS7Hb6wu674TMPOEzml6RzO9oRPWepst5P6HnMpLUnbagNT+s/lx0M1o7TdOs29mE0ox0iv16W1Hp2Sg+wtuPxmsTCFc4ozBBpb88YRfyL2pgPMWEeDcD7AjlDxHuCMUPMcU23Z3IHiLgEQr/nifgEQpvI7AuXawjOf6GFM7MVHICkSLSZ8QKxMYFxPeIlRZh8sJXpPJE8xLpe6SKUvYVxHfIVGyS7M4/iEzZDdbORGRsDe4lFbqmZv3QLUgsIYIMumcEcij9nztiITAsBWxJ77CtKfglFbimUFXSNfiVU7QK1CtnrkDUxGmGmULBf4bscg38Z8j+EGFTwxlmVRH/M2R22sAaTuuwPCJ05jTBy6CQM6cJXgaF7u8jLJ+fg6FhmZosDA2r451BRBNhGNMMIpoII6oBmLXcAmMeU/tXxYXg/KiX9f++keMC0Ws0E8drNbgtmSWHm8GZuENGCyoTd8hwiFlkFpHD46ZAI7OfOa4wj5DmS1DzD9f/YEsWlT8wAAAAAElFTkSuQmCC";
  constructor(matches: MatchService, private _router: Router) {
    this.matches = matches;
  }
  ngAfterViewInit(): void {
    this.load();
  }
  load(): void {
    this.loading.next("");
    this.matches.load(BackendService.userId.toString()).subscribe(
      () => {
        this.loaded.next("");
        this.listLoaded = true;
      },
      () => {
        alert("An error occured loading list");
      }
    );
  }
  makeBackgroundTransparent(args) {
    let cell = args.ios;
    if (cell) {
      cell.backgroundColor = UIColor.clearColor;
    }
  }
  loadImage(item) {
    if (item === null || item === "") return this.blankAvatar;
    return "data:image/png;base64," + item;
  }
  contact(id) {
    console.log("Redirect",id);
    this._router.navigate(["/contact", id]);
  }
}

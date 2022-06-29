import { catchError, tap, shareReplay, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FhirUtilService, SearchFacadeService } from '@red-probeaufgabe/search';
import { Observable, of } from 'rxjs';
import {
  IFhirPatient,
  IFhirPractitioner,
  IFhirSearchResponse,
  IPreparedIFhirPatient,
  IPreparedIFhirPractitioner,
} from '@red-probeaufgabe/types';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  id = 'pat1';
  resourceType: 'patient' | 'practitioner';
  isLoading = true;
  searchPatient$: Observable<IPreparedIFhirPatient | IPreparedIFhirPractitioner>;
  searchPractitioner$: Observable<IPreparedIFhirPatient | IPreparedIFhirPractitioner>;

  constructor(
    private searchFacade: SearchFacadeService,
    private route: ActivatedRoute,
    private fhirUtilService: FhirUtilService,
  ) {
    if (this.route.snapshot.queryParams.patient) {
      this.id = this.route.snapshot.queryParams.patient;
      this.resourceType = 'patient';
    } else {
      this.id = this.route.snapshot.queryParams.practitioner;
      this.resourceType = 'practitioner';
    }
  }

  ngOnInit(): void {
    if (this.resourceType === 'patient') {
      this.searchPatient$ = this.searchFacade.findPatientById(this.id).pipe(
        map((data) => this.fhirUtilService.prepareData(data)),
        tap((data) => {
          console.log(data);
          this.isLoading = false;
        }),
        shareReplay(),
      );
    }
    if (this.resourceType === 'practitioner') {
      this.searchPractitioner$ = this.searchFacade.findPractitionerById(this.id).pipe(
        map((data) => this.fhirUtilService.prepareData(data)),
        tap((data) => {
          console.log(data);
          this.isLoading = false;
        }),
        shareReplay(),
      );
    }
  }
}

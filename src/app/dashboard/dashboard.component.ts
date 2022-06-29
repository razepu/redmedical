import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, tap } from 'rxjs/operators';
import { SiteTitleService } from '@red-probeaufgabe/core';
import { FhirSearchFn, IFhirPatient, IFhirPractitioner, IFhirSearchResponse } from '@red-probeaufgabe/types';
import { IUnicornTableColumn } from '@red-probeaufgabe/ui';
import { SearchFacadeService } from '@red-probeaufgabe/search';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // Init unicorn columns to display
  columns: Set<IUnicornTableColumn> = new Set<IUnicornTableColumn>([
    'number',
    'resourceType',
    'name',
    'gender',
    'birthDate',
  ]);
  isLoading = true;
  searchString = '';

  /*
   * Implement search on keyword or fhirSearchFn change
   **/
  // hier hatte ich ein Problem den Searchinput und den Filter an das Observable zu übergeben
  // hätte das funktioniert, hätte ich den Butten entfernt und hätte valueChanges des Formulars subscribed
  search$: Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> = this.searchFacade
    .search(FhirSearchFn.SearchAll, this.searchString)
    .pipe(
      catchError(this.handleError),
      tap((data) => {
        this.isLoading = false;
      }),
      shareReplay(),
    );

  entries$: Observable<Array<IFhirPatient | IFhirPractitioner>> = this.search$.pipe(
    map((data) => !!data && data.entry),
    startWith([]),
  );

  totalLength$ = this.search$.pipe(
    map((data) => !!data && data.total),
    startWith(0),
  );

  // Abstracte Klassen sind blaupausen für andere Klassen und können nicht direkt verwendet werden.
  constructor(
    private siteTitleService: SiteTitleService,
    private searchFacade: SearchFacadeService,
    private router: Router,
  ) {
    this.siteTitleService.setSiteTitle('Dashboard');
    this.search$.subscribe((data) => console.log('data', data));
  }

  addSearch(searchString: string) {
    console.log('dashboard', searchString);
    this.searchString = searchString;
  }
  navigateToId(row: any) {
    console.log(row);
    if (row.resourceType === 'Patient') {
      this.router.navigate(['dashboard/detail/'], {
        queryParams: { patient: row.id },
      });
    }
    if (row.resourceType === 'Practitioner') {
      this.router.navigate(['dashboard/detail/'], {
        queryParams: { practitioner: row.id },
      });
    }
  }

  private handleError(): Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> {
    return of({ entry: [], total: 0 });
  }
}

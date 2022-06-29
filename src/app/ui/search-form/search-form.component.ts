import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent {
  @Output() newSearch = new EventEmitter<string>();
  /** Implement Search Form */
  searchForm = this.fb.group({
    searchField: ['', Validators.pattern('^[a-zA-Z0-9_.-]*$')],
  });
  constructor(private fb: FormBuilder) {}

  onSubmit() {
    console.log(this.searchForm);
    this.newSearch.emit(this.searchForm.get('searchField')?.value);
  }
}

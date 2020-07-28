import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ServerCommunicationService } from 'src/app/services/server-communication.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IMovieData } from 'src/app/services/IMovieData';
import { merge } from 'rxjs';
import { of as observableOf } from 'rxjs';
import { map, startWith, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements AfterViewInit {
  displayedColumns: string[] = ['Title', 'Year', 'imdbID'];
  dataSource: MatTableDataSource<IMovieData>;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  filterValue: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private readonly serverCommunicationService: ServerCommunicationService) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          if (this.filterValue) {
            return this.serverCommunicationService.getSearchedMoviesData(this.filterValue, this.paginator.pageIndex);
          }
          return this.serverCommunicationService.getStoresMovieData(this.paginator.pageIndex);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total;
          return data.data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
  }

  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.paginator.pageIndex = 0;

    this.serverCommunicationService.getSearchedMoviesData(this.filterValue, this.paginator.pageIndex).subscribe(data => {
      this.isLoadingResults = false;
      this.isRateLimitReached = false;

      this.resultsLength = data.total;
      this.dataSource.data = data.data;
      this.dataSource.filter = this.filterValue;
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


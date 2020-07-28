import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IStoresMovieData } from './IStoresMovieData';
import { Observable } from 'rxjs';

@Injectable()

export class ServerCommunicationService {
  private moviesURL = 'https://jsonmock.hackerrank.com/api/movies/';

  constructor(private http: HttpClient) { }

  getStoresMovieData(pageIndex: number): Observable<IStoresMovieData> {
    let getSearchURL = this.moviesURL;
    if (pageIndex >= 0) {
      getSearchURL += `?page=${pageIndex}`;
    }
    return this.http.get<IStoresMovieData>(getSearchURL);
  }

  getSearchedMoviesData(searchTitle: string, pageIndex: number): Observable<IStoresMovieData> {
    let getSearchURL = this.moviesURL + 'search/';
    if (searchTitle) {
      getSearchURL += `?Title=${searchTitle}`;
    }
    // if (pageIndex >= 0) {}
    return this.http.get<IStoresMovieData>(getSearchURL);
  }
}
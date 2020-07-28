import { IMovieData } from './IMovieData';

export interface IStoresMovieData {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: Array<IMovieData>;
}

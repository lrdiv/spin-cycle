export class Page<T> {
  content: T[];
  page: number;
  totalItems: number;
  totalPages: number;
  firstPage: boolean;
  lastPage: boolean;

  constructor(
    content: T[],
    page: number,
    totalItems: number,
    totalPages: number,
    firstPage: boolean,
    lastPage: boolean,
  ) {
    this.content = content;
    this.page = page;
    this.totalItems = totalItems;
    this.totalPages = totalPages;
    this.firstPage = firstPage;
    this.lastPage = lastPage;
  }
}

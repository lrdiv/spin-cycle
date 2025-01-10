export class Page<T> {
  readonly content: T[];
  readonly page: number;
  readonly totalItems: number;
  readonly firstPage: boolean;
  readonly lastPage: boolean;

  constructor(content: T[], page: number, totalItems: number, firstPage: boolean, lastPage: boolean) {
    this.content = content;
    this.page = page;
    this.totalItems = totalItems;
    this.firstPage = firstPage;
    this.lastPage = lastPage;
  }
}

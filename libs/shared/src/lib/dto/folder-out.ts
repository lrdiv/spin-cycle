export class FolderOut {
  id: number;
  name: string;
  count?: number;

  constructor(id: number, name: string, count?: number) {
    this.id = id;
    this.name = name;

    if (count) {
      this.count = count;
    }
  }
}

export interface IDiscogsReleases extends IDiscogsResponse {
  releases: IDiscogsRelease[];
}

export interface IDiscogsRelease {
  id: number;
  // When the user added this release to their collection
  date_added?: string;
  basic_information: {
    title: string;
    resource_url: string;
    artists: Array<{ name: string }>;
  };
}

interface IDiscogsResponse {
  pagination: IDiscogsPagination;
}

interface IDiscogsPagination {
  page: number;
  pages: number;
  per_page: number;
  items: number;
}

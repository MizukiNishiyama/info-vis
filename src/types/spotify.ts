// reference: https://developer.spotify.com/documentation/web-api/reference/get-track

export type ExternalUrls = {
  spotify: string;
};

export type Artist = {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
};

export type Image = {
  url: string;
  height: number;
  width: number;
};

export type Restrictions = {
  reason: string;
};

export type Album = {
  album_type: "album" | "single" | "compilation";
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string; // Format can be "YYYY-MM-DD", "YYYY-MM", or "YYYY"
  release_date_precision: "year" | "month" | "day";
  restrictions?: Restrictions;
  type: "album";
  uri: string;
  artists: Artist[];
};

// types/ExternalIds.ts
export type ExternalIds = {
  isrc: string;
  ean: string;
  upc: string;
};

export type Link = {
  // spotifyAPIのdocsに記載されていないので、any型で定義
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type Track = {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from?: Link;
  restrictions?: Restrictions;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
};

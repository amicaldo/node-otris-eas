export interface Store {
  name: string;
  href: string;
  active: boolean;
}

export interface Section {
  name: string;
  parameters: Array<{ [key: string]: string }>;
}

export interface StoreConfiguration {
  section: Section[];
}

export interface Spool {
  id: string;
  path: string;
}

export interface Link {
  type: string;
  title: string;
  href: string;
}

export interface RecordFragment {
  id: string;
  link: Link;
}

export interface RecordVersion {
  owner: string;
  hasPreviousVersion: boolean;
  hasFollowingVersion: boolean;
}

export interface RecordVerification {
  owner: string;
  isValid: boolean;
}

export interface Record {
  headerFields: any;
  recordFields: any;
  attachments: any[];
}

export interface RecordQuery {
  query?: string;
  startIndex?: number;
  itemsPerPage?: number;
  topn?: number;
  sort?: string;
  sortOrder?: 'asc' | 'desc';
  fields?: string;
  includeAnnotations?: boolean;
}

export interface RecordSearchDetails extends RecordQuery {
  result: Record[];
  totalHits: number;
  searchTime: number;
  outputTime: number;
}

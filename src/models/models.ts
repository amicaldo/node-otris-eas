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

export interface StoreTermListQuery {
  /**
   * Name of the field from the index whose terms are to be queried.
   * Default value is `_body`.
   */
  fieldName: string;
  /**
   * String with which the queried terms should begin. If no prefix is specified, all terms from the field are returned.
   */
  prefix: string;
  /**
   * Maximum number of terms to be returned.
   * Default value is `10`.
   */
  maxTerms: number;
  /**
   * Threshold value for the frequency of occurrence of the terms in index entries.
   * Only terms which have a greater or equal frequency to the threshold value will be returned.
   * Default value is `0`.
   */
  freqThreshold: number;
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

export interface RecordCreate {
  attachments?: any[];
  title?: string;
}

export interface Record {
  headerFields?: any;
  recordFields?: any;
  attachments?: any[];
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
  searchOnlyNewestVersion?: 0 | 1 | 2;
}

export interface RecordSearchDetails extends RecordQuery {
  result: Record[];
  totalHits: number;
  searchTime: number;
  outputTime: number;
}

export interface RecordSearchExplanation {
  owner: string;
  query: string;
  explanations: [{
    id: string;
    documentType: boolean;
    text: string;
  }];
}

export interface RecordFlags {
  delete: string;
  protect: string;
}

export interface RetentionList {
  id: string;
  link: {
    type: string;
    title: string;
    href: string;
  };
}

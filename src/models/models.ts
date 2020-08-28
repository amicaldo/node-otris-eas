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

export interface TermListQuery {
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

export interface Term {
  term: string;
  frequency: number;
}

export interface Attachment {
  name: string;
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

export interface RecordCreate {
  attachments?: Attachment[];
  title?: string;
}

export interface Record {
  headerFields?: RecordHeaderFields;
  recordFields?: unknown;
  attachments?: Attachment[];
}

export interface RecordSearch extends Record {
  title: boolean;
  score: number;
  id: string;
  fileLink: Link;
  explainLink: Link;
  checkVersionLink: Link;
  historyLink: Link;
  verifyLink: Link;
}

export interface RecordHeaderFields {
  _documentType: string;
  _id: string;
  _masterId: string;
  _version: string;
  _previousVersionId?: string;
  _archiver?: string;
  _archiverLogin: string;
  _archiveDateTime: string;
  _initialArchiver?: string;
  _initialArchiverLogin: string;
  _initialArchiveDateTime: string;
}

export interface RecordQuery {
  /**
   * Search query.
   */
  query?: string;
  /**
   * Number of the page to be returned.
   */
  startIndex?: number;
  /**
   * Number of results per page.
   */
  itemsPerPage?: number;
  /**
   * Maximum number of results taken into account.
   */
  topn?: number;
  /**
   * Name of the field by which the result list should be sorted.
   */
  sort?: string;
  /**
   * Order in which the results are sorted.
   * `asc` stands for ascending and `desc` for descending sort order.
   */
  sortOrder?: 'asc' | 'desc';
  /**
   * Semicolon-separated list of field names to be included in the result list.
   */
  fields?: string;
  /**
   * Whether personal annotations should be added to the result list.
   * `false` is the default value.
   */
  includeAnnotations?: boolean;
  /**
   * Indicates which versions should be searched.
   * `0`: uses the default value from the store configuration
   * `1`: all versions are searched
   * `2`: only the newest versions are searched
   */
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

export interface RetentionPolicyCreate {
  minimalDuration?: string;
  maximalDuration?: string;
}

export interface Policy {
  id: string;
  isReference: boolean;
  link: Link;
}

export interface RetentionPolicy extends Policy {
  minimalDuration: string;
  maximalDuration: string;
}

export interface RetentionList {
  id: string;
  link: Link;
}

export interface DeleteFlagParams {
  /**
   * Range to which the deletion flag should be set.
   * `all`: all versions of the respective record will be marked for deletion
   * `this`: only the version specified will be marked for deletion
   */
  scope?: 'all' | 'this';
  /**
   * Whether a list with the deleted record IDs should be returned.
   * Only usable in combination with `scope = all`.
   */
  list?: boolean;
}

export interface AccessControlPolicyRule {
  identity: string;
  permissions?: {
    readPermission?: boolean;
    writePermission?: boolean;
  };
}

export interface AccessControlPolicy {
  id: string;
  rules: AccessControlPolicyRule[];
}

export interface Annotation {
  type: string;
  value: string;
}

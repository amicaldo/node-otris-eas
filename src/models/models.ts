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

export interface Record {
  headerFields: any;
  recordFields: any;
  attachments: any[];
}

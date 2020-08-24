/**
 * Specifies how the record is to be indexed during archival (creation).
 *
 * The value `0` is the default value and means that the setting of the store applies.
 * The value `1` means that the record is to be indexed immediately.
 * The value `2` means that the record is not to be indexed immediately, but later.
 */
export type IndexMode = 0 | 1 | 2;

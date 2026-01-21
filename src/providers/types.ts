export interface SheetRow {
  [key: string]: string | number | boolean | null;
}

export interface SheetRange {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}

export interface SheetOptions {
  spreadsheetId: string;
  sheetName: string;
}

export interface AddRowsOptions extends SheetOptions {
  headerMap?: Record<string, string>; // input field -> sheet column
}

export interface UpdateCellsOptions extends SheetOptions {
  /**
   * A1 notation range to update, e.g. "Sheet1!A2:B3". If omitted, uses sheetName.
   */
  range?: string;
  /**
   * 2D array of values to write to the range.
   */
  values: (string | number | boolean | null)[][];
}

export interface ReadDataOptions extends SheetOptions {
  /**
   * A1 notation range to read, e.g. "Sheet1!A2:B3". If omitted, uses sheetName.
   */
  range?: string;
}

export interface DeleteRowsOptions extends SheetOptions {
  rowIndexes: number[];
}

export interface CreateSheetOptions {
  spreadsheetId: string;
  sheetName: string;
}

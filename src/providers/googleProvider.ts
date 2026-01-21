
import {
  SheetRow,
  AddRowsOptions,
  UpdateCellsOptions,
  ReadDataOptions,
  DeleteRowsOptions,
  CreateSheetOptions
} from './types';

// Only import google-auth-library in Node.js
let GoogleAuth: any = undefined;
if (typeof process !== 'undefined' && process.versions?.node) {
  try {
    GoogleAuth = require('google-auth-library').GoogleAuth;
  } catch { }
}

export interface ISheetProvider {
  addRows(options: AddRowsOptions, rows: SheetRow[]): Promise<void>;
  updateCells(options: UpdateCellsOptions): Promise<void>;
  readData(options: ReadDataOptions): Promise<SheetRow[]>;
  deleteRows(options: DeleteRowsOptions): Promise<void>;
  createSheet(options: CreateSheetOptions): Promise<void>;
}

export class GoogleSheetProvider implements ISheetProvider {
  private getBaseUrl(): string {
    return 'https://sheets.googleapis.com/v4/spreadsheets';
  }

  private buildUrl(path: string, params?: Record<string, string | undefined>): string {
    let url = `${this.getBaseUrl()}/${path}`;
    if (params) {
      const query = Object.entries(params)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
        .join('&');
      if (query) url += `?${query}`;
    }
    return url;
  }

  private readonly credentials: any;
  private _accessToken: string | null = null;
  private _tokenExpiry: number | null = null;

  constructor(credentials: any) {
    this.credentials = credentials;
  }

  /**
   * Get a valid access token, either from credentials or by generating from service account.
   */
  private async getAccessToken(): Promise<string> {
    if (this.credentials.accessToken) {
      return this.credentials.accessToken;
    }
    // If service account credentials are provided (Node.js only)
    if (GoogleAuth && this.credentials.private_key && this.credentials.client_email) {
      if (this._accessToken && this._tokenExpiry && Date.now() < this._tokenExpiry - 60000) {
        return this._accessToken;
      }
      const auth = new GoogleAuth({
        credentials: this.credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const client = await auth.getClient();
      const { token, res } = await client.getAccessToken();
      let expiry = Date.now() + 50 * 60 * 1000;
      if (res?.data?.expiry_date) {
        expiry = res.data.expiry_date;
      }
      this._accessToken = token;
      this._tokenExpiry = expiry;
      return token;
    }
    throw new Error('No valid access token or service account credentials provided.');
  }

  async addRows(options: AddRowsOptions, rows: SheetRow[]): Promise<void> {
    const { spreadsheetId, sheetName, headerMap } = options;
    const accessToken = await this.getAccessToken();

    let values: any[][] = [];

    // If headerMap is passed and sheet is empty, add header row first
    if (headerMap) {
      // Check if sheet is empty by reading first row
      const readUrl = this.buildUrl(
        `${spreadsheetId}/values/${encodeURIComponent(sheetName)}`,
        { majorDimension: 'ROWS', range: sheetName }
      );
      const readRes = await fetch(readUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      let sheetIsEmpty = true;
      if (readRes.ok) {
        const data = await readRes.json();
        if (data.values && data.values.length > 0) {
          sheetIsEmpty = false;
        }
      }
      if (sheetIsEmpty) {
        // Add header row
        values.push(Object.values(headerMap));
      }
    }

    // Map headers if needed
    const mappedRows = headerMap
      ? rows.map(row => GoogleSheetProvider.mapHeaders(row, headerMap))
      : rows;
    values = values.concat(mappedRows.map(row => Object.values(row)));

    // Prepare API request
    const url = this.buildUrl(
      `${spreadsheetId}/values/${encodeURIComponent(sheetName)}:append`,
      { valueInputOption: 'USER_ENTERED' }
    );
    const body = JSON.stringify({ values });
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google Sheets API error: ${res.status} ${err}`);
    }
  }

  async updateCells(options: UpdateCellsOptions): Promise<void> {
    const { spreadsheetId, sheetName, range, values } = options;
    const accessToken = await this.getAccessToken();

    // values should be a 2D array matching the range
    const url = this.buildUrl(
      `${spreadsheetId}/values/${encodeURIComponent(range || sheetName)}`,
      { valueInputOption: 'USER_ENTERED' }
    );
    const body = JSON.stringify({ values });
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google Sheets API error: ${res.status} ${err}`);
    }
  }

  async readData(options: ReadDataOptions): Promise<SheetRow[]> {
    const { spreadsheetId, sheetName, range } = options;
    const accessToken = await this.getAccessToken();
    const url = this.buildUrl(
      `${spreadsheetId}/values/${encodeURIComponent(range || sheetName)}`,
      { majorDimension: 'ROWS' }
    );
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google Sheets API error: ${res.status} ${err}`);
    }
    const data = await res.json();
    if (!data.values || data.values.length === 0) return [];
    // Assume first row is header
    const headers = data.values[0];
    const rows: SheetRow[] = [];
    for (let i = 1; i < data.values.length; i++) {
      const row: SheetRow = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = data.values[i][j];
      }
      rows.push(row);
    }
    return rows;
  }

  async deleteRows(options: DeleteRowsOptions): Promise<void> {
    // TODO: Implement row deletion logic
  }

  async createSheet(options: CreateSheetOptions): Promise<void> {
    // TODO: Implement sheet creation logic
  }

  static mapHeaders(input: SheetRow, headerMap?: Record<string, string>): SheetRow {
    if (!headerMap) return input;
    const mapped: SheetRow = {};
    for (const key in input) {
      mapped[headerMap[key] || key] = input[key];
    }
    return mapped;
  }
}

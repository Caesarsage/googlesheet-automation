
<div align="center">
  <img src="https://www.gstatic.com/images/icons/material/system/2x/sheets_googlegreen_48dp.png" width="64" alt="Google Sheets Logo" />
  <h1>google-sheets-automation</h1>
  <p>Automate Google Sheets from Node.js: add, update, and read rows with a simple API.</p>
</div>

---

## Overview

`google-sheets-automation` is a Node.js package for programmatically managing Google Sheets. Easily add, update, and read rows using service account credentials. Designed for backend, CLI, and serverless environments.

## Features
- Add rows with optional header mapping
- Update cells in bulk (A1 notation)
- Read sheet data as objects
- Batch operations
- Promise-based API
- Secure authentication via Google service accounts

## Installation

```bash
npm install google-sheets-automation
```

## Quick Start

```js
import { GoogleSheetProvider } from 'google-sheets-automation';

const provider = new GoogleSheetProvider({
  serviceAccount: {
    client_email: 'your-service-account-email@project.iam.gserviceaccount.com',
    private_key: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n',
  },
  sheetId: 'your-google-sheet-id',
});

const headerMap = {
  Name: 'name',
  Email: 'email',
  Message: 'message',
};

const rows = [
  { name: 'Alice', email: 'alice@example.com', message: 'Hello!' },
  { name: 'Bob', email: 'bob@example.com', message: 'Hi!' },
];

await provider.addRows({ spreadsheetId: 'your-google-sheet-id', sheetName: 'Sheet1', headerMap }, rows);
```

## Environment Setup

1. **Create a Google Cloud project** and enable the Google Sheets API.
2. **Create a service account** and download the JSON key.
3. **Share your target Google Sheet** with the service account email.
4. Store credentials in your `.env`:
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID=your-google-sheet-id
   ```

## API Reference

### GoogleSheetProvider

#### `addRows(options, rows)`
Add rows to a sheet. If `headerMap` is provided and the sheet is empty, headers are added automatically.

#### `updateCells(options)`
Update cells in a sheet using A1 notation and a 2D array of values.

#### `readData(options)`
Read all data from a sheet, returned as an array of objects (first row is used as keys).

#### `deleteRows(options)`
Delete rows by index (not yet implemented).

#### `createSheet(options)`
Create a new sheet (not yet implemented).

### Types

- `AddRowsOptions`: `{ spreadsheetId, sheetName, headerMap? }`
- `UpdateCellsOptions`: `{ spreadsheetId, sheetName, range?, values }`
- `ReadDataOptions`: `{ spreadsheetId, sheetName, range? }`
- `DeleteRowsOptions`: `{ spreadsheetId, sheetName, rowIndexes }`
- `CreateSheetOptions`: `{ spreadsheetId, sheetName }`

## Advanced Usage

### Update Cells Example
```js
await provider.updateCells({
  spreadsheetId: 'your-google-sheet-id',
  sheetName: 'Sheet1',
  range: 'Sheet1!A2:B2',
  values: [['Alice', 'alice@example.com']]
});
```

### Read Data Example
```js
const data = await provider.readData({
  spreadsheetId: 'your-google-sheet-id',
  sheetName: 'Sheet1'
});
console.log(data);
```

## Testing

### Unit Tests
Run all unit tests (mocks Google API calls):
```bash
npm run test
```

### Integration Tests
Run integration tests against the real Google Sheets API (requires valid `.env` and sheet setup):
```bash
npm run test test/providers/googleProvider.integration.test.ts
```

## Contributing

Pull requests and issues are welcome! Please open an issue for feature requests or bugs.

## License

MIT

## Testing
Unit tests are written with Jest and mock all Google API calls, so no credentials are required:
```bash
npm run test
```

### Integration Testing
To run integration tests against the real Google Sheets API, you must:
- Set up a `.env` file with valid `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, and `GOOGLE_SHEET_ID`.
- Ensure the target sheet (e.g. `IntegrationTestSheet`) exists in your Google Spreadsheet before running the test.
- Run:
```bash
npm run test test/providers/googleProvider.integration.test.ts
```
Integration tests will use your credentials and make real API calls. Do not run these against production data.


## Providers
- `GoogleSheetProvider` (currently available)
  - Usage: `new GoogleSheetProvider({ ...credentials })`
-(Planned) ExcelSheetProvider, AirtableSheetProvider, etc.

## API Functions (ISheetProvider)
All providers implement the following methods:

 `addRows(options, rows)` — Add rows to the sheet, optionally mapping headers.
 `updateCells(options)` — Update cells in the sheet (A1 range, 2D values).
 `readData(options)` — Read data from the sheet (returns array of objects).
 `deleteRows(options)` — Delete rows by index (not yet implemented).
 `createSheet(options)` — Create a new sheet (not yet implemented).

### Types
 `AddRowsOptions`: `{ spreadsheetId, sheetName, headerMap? }`
 `UpdateCellsOptions`: `{ spreadsheetId, sheetName, range?, values }`
 `ReadDataOptions`: `{ spreadsheetId, sheetName, range? }`
 `DeleteRowsOptions`: `{ spreadsheetId, sheetName, rowIndexes }`
 `CreateSheetOptions`: `{ spreadsheetId, sheetName }`

## Roadmap
- Support for additional sheet providers (Excel, Airtable, etc.) planned for future releases.

## License
MIT

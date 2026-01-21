
# google-sheets-automation

Simplify populating sheets from inputs. Designed to be extensible for multiple sheet providers, but currently only supports Google Sheets. Usable in Node.js projects (backend or CLI).

 # google-sheets-automation
- Add rows, update cells, batch updates
Automate populating and managing Google Sheets from Node.js. Usable in backend, CLI, or serverless environments.
- Accepts objects, arrays, or form data
- Simple, promise-based API
- Add rows, update cells, batch updates
- Google Sheets API support
- Accepts objects, arrays, or form data
- Simple, promise-based API

```js
## Usage Example
npm install google-sheets-automation
import { GoogleSheetProvider } from 'google-sheets-automation';

const provider = new GoogleSheetProvider({
  serviceAccount: {
import { GoogleSheetProvider } from 'google-sheets-automation';
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

await provider.addRows(rows, headerMap);
```

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

import dotenv from 'dotenv';
dotenv.config();

import { GoogleSheetProvider } from '../../src/providers/googleProvider';
import { AddRowsOptions, UpdateCellsOptions, ReadDataOptions, SheetRow } from '../../src/providers/types';

describe('GoogleSheetProvider (integration)', () => {
  const credentials = {
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  };

  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
  const sheetName = 'IntegrationTestSheet';

  const addOptions: AddRowsOptions = {
    spreadsheetId,
    sheetName,
    headerMap: { name: 'Name', email: 'Email' }
  };
  const rows: SheetRow[] = [
    { name: 'Integration Alice', email: 'alice@example.com' },
    { name: 'Integration Bob', email: 'bob@example.com' }
  ];

  it('should add header and data rows to the sheet (real API)', async () => {
    const provider = new GoogleSheetProvider(credentials);
    await expect(provider.addRows(addOptions, rows)).resolves.not.toThrow();
  });

  it('should update cells in the sheet (real API)', async () => {
    const provider = new GoogleSheetProvider(credentials);
    const updateOptions: UpdateCellsOptions = {
      spreadsheetId,
      sheetName,
      range: `${sheetName}!A2:B2`,
      values: [['Integration Alice', 'alice@example.com']]
    };
    await expect(provider.updateCells(updateOptions)).resolves.not.toThrow();
  });

  it('should read data from the sheet (real API)', async () => {
    const provider = new GoogleSheetProvider(credentials);
    const readOptions: ReadDataOptions = {
      spreadsheetId,
      sheetName
    };
    const data = await provider.readData(readOptions);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('Name');
    expect(data[0]).toHaveProperty('Email');
  });
});

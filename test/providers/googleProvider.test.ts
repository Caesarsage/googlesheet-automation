import { GoogleSheetProvider } from '../../src/providers/googleProvider';
import { AddRowsOptions, UpdateCellsOptions, ReadDataOptions, SheetRow } from '../../src/providers/types';

describe('GoogleSheetProvider', () => {
  // Mock network and auth
  beforeAll(() => {
    jest.spyOn(GoogleSheetProvider.prototype as any, 'getAccessToken').mockResolvedValue('fake-token');
    global.fetch = jest.fn().mockImplementation((url, opts) => {
      // Simulate Google Sheets API responses
      if (url.includes(':append')) {
        return Promise.resolve({ ok: true, json: async () => ({}) });
      }
      if (opts?.method === 'PUT') {
        return Promise.resolve({ ok: true, json: async () => ({}) });
      }
      if (opts?.method === 'GET') {
        // Simulate reading data with header and two rows
        return Promise.resolve({
          ok: true,
          json: async () => ({ values: [['Name', 'Email'], ['Alice', 'alice@example.com'], ['Bob', 'bob@example.com']] })
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const credentials = { client_email: 'test@example.com', private_key: 'fake-key' };
  const addOptions: AddRowsOptions = {
    spreadsheetId: 'fake-sheet-id',
    sheetName: 'TestSheet',
    headerMap: { name: 'Name', email: 'Email' }
  };
  const rows: SheetRow[] = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' }
  ];

  it('should add header and data rows to the sheet', async () => {
    const provider = new GoogleSheetProvider(credentials);
    await expect(provider.addRows(addOptions, rows)).resolves.not.toThrow();
  });

  it('should update cells in the sheet', async () => {
    const provider = new GoogleSheetProvider(credentials);
    const updateOptions: UpdateCellsOptions = {
      spreadsheetId: 'fake-sheet-id',
      sheetName: 'TestSheet',
      range: 'TestSheet!A2:B2',
      values: [['Alice', 'alice@example.com']]
    };
    await expect(provider.updateCells(updateOptions)).resolves.not.toThrow();
  });

  it('should read data from the sheet', async () => {
    const provider = new GoogleSheetProvider(credentials);
    const readOptions: ReadDataOptions = {
      spreadsheetId: 'fake-sheet-id',
      sheetName: 'TestSheet'
    };
    const data = await provider.readData(readOptions);
    expect(data).toEqual([
      { Name: 'Alice', Email: 'alice@example.com' },
      { Name: 'Bob', Email: 'bob@example.com' }
    ]);
  });
});

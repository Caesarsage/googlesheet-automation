import {
  SheetRow,
  AddRowsOptions,
  UpdateCellsOptions,
  ReadDataOptions,
  DeleteRowsOptions,
  CreateSheetOptions
} from './types';
import { ISheetProvider, GoogleSheetProvider } from './googleProvider';

export interface ISheetClient {
  addRows(options: AddRowsOptions, rows: SheetRow[]): Promise<void>;
  updateCells(options: UpdateCellsOptions): Promise<void>;
  readData(options: ReadDataOptions): Promise<SheetRow[]>;
  deleteRows(options: DeleteRowsOptions): Promise<void>;
  createSheet(options: CreateSheetOptions): Promise<void>;
}

export class SheetClient implements ISheetClient {
  private readonly provider: ISheetProvider;

  constructor(config: { provider: string; credentials: any }) {
    if (config.provider === 'google') {
      this.provider = new GoogleSheetProvider(config.credentials);
    } else {
      throw new Error('Provider not supported');
    }
  }

  addRows(options: AddRowsOptions, rows: SheetRow[]): Promise<void> {
    return this.provider.addRows(options, rows);
  }

  updateCells(options: UpdateCellsOptions): Promise<void> {
    return this.provider.updateCells(options);
  }

  readData(options: ReadDataOptions): Promise<SheetRow[]> {
    return this.provider.readData(options);
  }

  deleteRows(options: DeleteRowsOptions): Promise<void> {
    return this.provider.deleteRows(options);
  }

  createSheet(options: CreateSheetOptions): Promise<void> {
    return this.provider.createSheet(options);
  }

  static mapHeaders(input: SheetRow, headerMap?: Record<string, string>): SheetRow {
    return GoogleSheetProvider.mapHeaders(input, headerMap);
  }
}

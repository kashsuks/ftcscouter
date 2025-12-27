export type Mode = 'auto' | 'manual' | null;

export interface TableData {
    columns: string[];
    rows: string[][];
}

export interface TableState {
    data: TableData;
    updateCell: (rowIdx: number, colIdx: number, value: string) => void;
    addRow: () => void;
    addColumn: () => void;
    deleteRow: (rowIdx: number) => void;
    deleteColumn: (colIdx: number) => void;
}
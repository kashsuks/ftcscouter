import { writable } from "svelte/store";
import type { TableData } from "$lib/types";

function createTableStore() {
    const initialData: TableData = {
        columns: ['Name', 'Number', 'Notes'],
        rows: [['']]
    };

    const { subscribe, set, update } = writable<TableData>(initialData);

    return {
        subscribe,
        reset: () => set(initialData),

        addRow: () => update(data => ({
            ...data,
            rows: [...data.rows, Array(data.columns.length).fill('')]
        })),

        addColumn: (columnName: string) => update(data => ({
            columns: [...data.columns, columnName],
            rows: data.rows.map(row => [...row, ''])
        })),

        deleteRow: (rowIdx: number) => update(data => {
            if (data.rows.length <= 1) return data;
            return {
                ...data,
                rows: data.rows.filter((_, i) => i !== rowIdx)
            };
        }),

        deleteColumn: (colIdx: number) => update(data => {
            if (data.columns.length <= 1) return data;
            return {
                columns: data.columns.filter((_, i) => i !== colIdx),
                rows: data.rows.map(row => row.filter((_, i) => i !== colIdx))
            };
        }),

        updateCell: (rowIdx: number, colIdx: number, value: string) => update(data => ({
            ...data,
            rows: data.rows.map((row, i) =>
                i == rowIdx ? row.map((cell, j) => j === colIdx ? value : cell) :row
        )
        }))
    };
}

export const tableStore = createTableStore();
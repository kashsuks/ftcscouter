/**
 * Prompts the user for a column name
 * @returns The column name or null if cancelled
 */
export function promptColumnName(): string | null {
    const name = prompt('Enter column name:');
    return name?.trim() || null;
}

/**
 * Shows an alert message
 * @param message The message to display
 */
export function showAlert(message: string): void {
    alert(message);
}

/**
 * Exports table data to CSV format
 * @param columns Column headers
 * @param rows Table data rows
 * @returns CSV string
 */
export function exportToCSV(columns: string[], rows: string[][]): string {
    const csvRows = [
        columns.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ];
    return csvRows.join('\n')
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
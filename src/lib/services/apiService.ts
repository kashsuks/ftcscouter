export interface EventData {
    eventCode: string;
    teams: TeamData[];
}

export interface TeamData {
    teamNumber: string;
    teamName: string;
    stats?: Record<string, unknown>;
}

/**
 * Fetches event data from the FTC Scout API
 * @param eventCode The event code to fetch data for
 * @returns Promise with event data
 */
export async function fetchEventData(eventCode: string): Promise<EventData> {
    try {
        //TODO: replace with the actual ftc scout api endpoint
        const response = await fetch(`/api/events/${eventCode}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch event data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching event data:', error)
        throw error;
    }
}

/**
 * Validates an event code format
 * @param eventCode The event code to validate
 * @returns true if valid, false otherwise
 */
export function isValidEventCode(eventCode: string): boolean {
    return eventCode.trim().length > 0 && /^[A-Z0-9]+$/i.test(eventCode.trim())
}

/**
 * Prompts the user for a column name
 * @returns The column name or null if cancelled
 */
export function promptColumnName(): string | null {
    const name = prompt('Enter column name:');
    return name?.trim() || null;
}

/**
 * Shows an alerts message
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
    return csvRows.join('\n');
}

/**
 * Downloads a string as a file
 * @param content File content
 * @param filename Desired filename
 * @param mimeType MIME type of the file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
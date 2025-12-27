const FTC_API_BASE_URL = 'https://api.ftcscout.org/rest/v1';
const CURRENT_SEASON = 2025;

export interface EventData {
    eventCode: string;
    teams: TeamEventParticipation[];
}

export interface TeamEventParticipation {
    teamNumber: number;
    stats?: TeamStats;
}

export interface TeamStats {
    opr?: number;
    autoAvg?: number;
    dcAvg?: number;
    egAvg?: number
    //other fields
}

export interface TeamData {
    teamNumber: number;
    teamName?: string;
}

/**
 * Fetches event data from the FTC Scout API
 * @param eventCode The event code to fetch data for
 * @returns Promise with event data
 */
export async function fetchEventData(eventCode: string, season: number = CURRENT_SEASON): Promise<EventData> {
    try {
        const url = `${FTC_API_BASE_URL}/events/${season}/${eventCode}/teams`;

        console.log(`Fetching teams from: ${url}`)

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch event data: ${response.statusText} (${response.status})`);
        }

        const teams: TeamEventParticipation[] = await response.json()

        console.log('=== EVENT TEAMS ===');
        console.log(`Event code: ${eventCode}`)
        console.log(`Season: ${season}`)
        console.log(`Total teams: ${teams.length}`)
        console.log(`Teams:`, teams)

        return {
            eventCode, 
            teams
        };
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
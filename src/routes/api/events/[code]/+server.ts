import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const FTC_API_BASE_URL = 'https://api.ftcscout.org/rest/v1';
const CURRENT_SEASON = 2025;

export const GET: RequestHandler = async ({ params, url }) => {
  const { code } = params;
  const season = parseInt(url.searchParams.get('season') || String(CURRENT_SEASON));

  if (!code) {
    return json(
      { error: 'Event code is required' },
      { status: 400 }
    );
  }

  try {
    const apiUrl = `${FTC_API_BASE_URL}/events/${season}/${code}/teams`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return json(
        { error: `Failed to fetch event data: ${response.statusText}` },
        { status: response.status }
      );
    }

    const teams = await response.json();

    return json({
      eventCode: code,
      season,
      teams
    });

  } catch (error) {
    console.error('Error fetching event data:', error);
    return json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
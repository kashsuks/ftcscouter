// FILE: src/routes/api/events/[code]/+server.ts

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// TODO: Replace with actual FTC Scout API base URL
const FTC_API_BASE_URL = 'https://ftc-api.firstinspires.org/v2.0';

export const GET: RequestHandler = async ({ params, fetch }) => {
  const { code } = params;

  if (!code) {
    return json(
      { error: 'Event code is required' },
      { status: 400 }
    );
  }

  try {
    // TODO: Replace with actual FTC Scout API endpoint
    // This is a placeholder implementation
    const response = await fetch(`${FTC_API_BASE_URL}/events/${code}`, {
      headers: {
        'Accept': 'application/json',
        // TODO: Add authentication headers if required
        // 'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      return json(
        { error: `Failed to fetch event data: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform the data if needed
    return json({
      eventCode: code,
      teams: data.teams || [],
      ...data
    });

  } catch (error) {
    console.error('Error fetching event data:', error);
    return json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
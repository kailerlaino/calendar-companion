// calendar.js

const CALENDAR_API_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

async function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(token);
      }
    });
  });
}

async function fetchCalendarEvents() {
  try {
    const token = await getAuthToken();
    const now = new Date().toISOString();
    const response = await fetch(`${CALENDAR_API_URL}?timeMin=${now}&maxResults=10&orderBy=startTime&singleEvents=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

function checkUpcomingEvents(events, minutesBefore = 15) {
  const now = new Date();
  const upcomingEvents = events.filter(event => {
    const startTime = new Date(event.start.dateTime || event.start.date);
    const timeDiff = (startTime - now) / (1000 * 60); // Convert to minutes
    return timeDiff > 0 && timeDiff <= minutesBefore;
  });

  return upcomingEvents;
}

// Export functions to be used in other parts of the extension
export { fetchCalendarEvents, checkUpcomingEvents };
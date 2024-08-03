 // background.js

import { fetchCalendarEvents, checkUpcomingEvents } from './calendar.js';

chrome.alarms.create('checkCalendar', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkCalendar') {
    const events = await fetchCalendarEvents();
    const upcomingEvents = checkUpcomingEvents(events);
    
    if (upcomingEvents.length > 0) {
      // TODO: Implement notification system
      console.log('Upcoming events:', upcomingEvents);
    }
  }
});
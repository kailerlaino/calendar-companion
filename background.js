 // background.js

import { fetchCalendarEvents, checkUpcomingEvents } from './calendar.js';

const messageTemplates = [
  "Hey there! You have an event coming up: ",
  "Don't forget about your upcoming event: ",
  "Friendly reminder about your event: "
];

function getRandomMessage(event) {
  const template = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
  return template + event.summary;
}

// Function to send a notification
function sendNotification(title, event) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'images/icon128.png',  // We'll update this path later
    title: title,
    message: getRandomMessage(event),
    priority: 2
  });
}

// ... rest of the background.js code ...

// Update the notification creation in checkCalendarAndNotify function
async function checkCalendarAndNotify() {
  const events = await fetchCalendarEvents();
  const upcomingEvents = checkUpcomingEvents(events);
  
  if (upcomingEvents.length > 0) {
    upcomingEvents.forEach(event => {
      const eventTime = new Date(event.start.dateTime || event.start.date);
      const timeUntilEvent = Math.round((eventTime - new Date()) / (1000 * 60));
      
      sendNotification(
        "Upcoming Event!",
        event
      );
    });
  }
}

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
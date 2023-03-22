import { Calendar, DayHeaderContentArg } from '@fullcalendar/core';
import { Component, createElement } from '@fullcalendar/core/preact';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // webpack uses file-loader to handle font files
import './index.css';

document.addEventListener('DOMContentLoaded', function() {
  let calendarEl: HTMLElement = document.getElementById('calendar')!;

  class CustomDayHeader extends Component<{ text: string }> {
    render() {
      return createElement('div', {}, '!' + this.props.text + '!')
    }
  }

  let calendar = new Calendar(calendarEl, {
    plugins: [ interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    themeSystem: 'bootstrap5',
    navLinks: true,
    dayMaxEvents: true,
    dayHeaderContent(arg: DayHeaderContentArg) {
      return createElement(CustomDayHeader, { text: arg.text })
    },
    events: [
      {
        title: 'All Day Event',
        start: '2018-01-01',
      },
      {
        title: 'Long Event',
        start: '2018-01-07',
        end: '2018-01-10'
      },
      {
        groupId: '999',
        title: 'Repeating Event',
        start: '2018-01-09T16:00:00'
      },
      {
        groupId: '999',
        title: 'Repeating Event',
        start: '2018-01-16T16:00:00'
      },
      {
        title: 'Conference',
        start: '2018-01-11',
        end: '2018-01-13'
      },
      {
        title: 'Meeting',
        start: '2018-01-12T10:30:00',
        end: '2018-01-12T12:30:00'
      },
      {
        title: 'Lunch',
        start: '2018-01-12T12:00:00'
      },
      {
        title: 'Meeting',
        start: '2018-01-12T14:30:00'
      },
      {
        title: 'Happy Hour',
        start: '2018-01-12T17:30:00'
      },
      {
        title: 'Dinner',
        start: '2018-01-12T20:00:00'
      },
      {
        title: 'Birthday Party',
        start: '2018-01-13T07:00:00'
      },
      {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2018-01-28'
      },
      {
        title: 'Konflikt',
        start: '2023-03-10',
        display: 'background',
        color: 'red'
      }
    ]
  });

  calendar.render();
  calendar.batchRendering
});

import { Calendar, DayHeaderContentArg, EventSourceInput } from '@fullcalendar/core';
import { Component, createElement } from '@fullcalendar/core/preact';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { VEvent} from './entity'

var ICAL = require("ical.js");

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // webpack uses file-loader to handle font files
import './index.css';
import { en } from '@fullcalendar/core/internal-common';

//Anschauen
//https://colorlib.com/wp/bootstrap-drag-and-drop/
//https://bevacqua.github.io/dragula/
//https://www.w3schools.com/howto/howto_js_filter_lists.asp
//https://fullcalendar.io/docs/icalendar

let calendar: Calendar;

let titles: string[] = [];
let titleInactiveListElement: HTMLElement;
let titleActiveListElement: HTMLElement;

document.getElementById("formFileMultiple")?.addEventListener('change', (event: Event) => {
  console.log(event)
  const target = event.target as HTMLInputElement;

  if (!target.files || target.files.length == 0) return;

  var reader = new FileReader();

  reader.onload = function () {
    parseText(reader.result as string);
  };

  reader.readAsText(target.files[0]);
})

function parseText(input: string) {
  const parsed = ICAL.parse(input);
  //parsed[2] beinhaltet alle Events

  let events: EventSourceInput = [];
  titles = [];

  for (const val of parsed[2]) {
    if (val[0] != "vevent") continue; //val[0] gibt den typen an
    const event = mapVEvent(val);
    events.push(event);

    if (!titles.includes(event.title)) {
      titles.push(event.title);
    }
  }
  calendar.removeAllEventSources();
  calendar.addEventSource(events);
  titles.sort();
  console.log(titles);
}

function mapVEvent(vEventObj: any): VEvent {
  return {
    title: vEventObj[1].find((input: any) => input[0] == "summary")[3],
    start: vEventObj[1].find((input: any) => input[0] == "dtstart")[3],
    end: vEventObj[1].find((input: any) => input[0] == "dtend")[3]
  }
}

function addListElement(parendElement: HTMLElement) {
  const entry = document.createElement("li");
  entry.classList.add("list-group-item");
  entry.innerText = "Test";
  parendElement.appendChild(entry);
}

function clearListElements(parendElement: HTMLElement) {
  while (parendElement.hasChildNodes()) {
    parendElement.removeChild(parendElement.firstChild!);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar')!;
  titleInactiveListElement = document.getElementById('title-inactive')!;
  titleActiveListElement = document.getElementById('title-active')!;

  class CustomDayHeader extends Component<{ text: string }> {
    render() {
      return createElement('div', {}, '!' + this.props.text + '!')
    }
  }

  calendar = new Calendar(calendarEl, {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    themeSystem: 'bootstrap5',
    navLinks: true,
    dayMaxEvents: true,
    locale: 'DE'
  });

  calendar.render();
  addListElement(titleInactiveListElement)
  clearListElements(titleInactiveListElement)
});

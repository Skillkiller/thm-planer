import { Calendar, DayHeaderContentArg, EventSourceInput } from '@fullcalendar/core';
import { Component, createElement } from '@fullcalendar/core/preact';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { EventEntity, Conflict } from './entity'
import deLocale from '@fullcalendar/core/locales/de';

var ICAL = require("ical.js");
require('bootstrap');

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // webpack uses file-loader to handle font files
import './index.css';
import '/img/step2.png'
import '/img/step3.png'
import '/img/step4.png'
import '/img/step5.png'
import '/img/step6.png'
import '/img/step7.png'
import '/img/step8.png'
import '/img/step10.png'
import '/img/step11.png'
import '/img/step12.png'
import '/img/step13.png'


let calendar: Calendar;

let fileCardElement: HTMLElement;

let events: EventEntity[] = [];

const dateStringOptions: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  year: '2-digit',
  month: '2-digit',
  day: '2-digit'
};

document.getElementById("formFileMultiple")?.addEventListener('change', (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (!target.files || target.files.length == 0) return;

  events = [];
  let readers: Promise<string[]>[] = [];

  for (let index = 0; index < target.files.length; index++) {
    const file = target.files.item(index);

    readers.push(readFileAsText(file!));
  }

  Promise.all(readers).then((values) => {
    values.forEach(value => parseIcsText(value[1], value[0]));
    rerenderModules();
  });

})

function readFileAsText(file: File): Promise<string[]> {
  return new Promise(function (resolve, reject) {
    let fr = new FileReader();

    fr.onload = function () {
      resolve([file.name ,fr.result as string]);
    };

    fr.onerror = function () {
      reject(fr);
    };

    fr.readAsText(file);
  });
}

function parseIcsText(input: string, fileName: string) {
  const parsed = ICAL.parse(input);

  for (const val of parsed[2]) {
    if (val[0] != "vevent") continue; //val[0] gibt den typen an
    const event = mapVEvent(val, fileName);
    events.push(event);
  }

  updateCalenderEvents();
}

function uniqueFilter(value: string, index: number, array: string[]): any {
  return array.indexOf(value) === index;
}

function rerenderModules() {
  clearListElements(fileCardElement);

  //Create card for each file
  events.map(e => e.fileName).filter(uniqueFilter).sort().forEach((fileName, index) => {
    addFileCard(fileName, index);

    const parendTitlesElement = document.getElementById(`file-${index}-titles`)!;
    //Add module checkboxes into card
    events.filter(e => e.fileName == fileName).map(e => e.moduleId).filter(uniqueFilter).sort().forEach(moduleId => {
      addCheckbox(parendTitlesElement, moduleId, `${index}-${moduleId}`, fileName);
    });
  });
}

function mapVEvent(vEventObj: any, fileName: string): EventEntity {
  let event: EventEntity = {
    id: vEventObj[1].find((input: any) => input[0] == "uid")[3],
    title: vEventObj[1].find((input: any) => input[0] == "summary")[3],
    start: vEventObj[1].find((input: any) => input[0] == "dtstart")[3],
    end: vEventObj[1].find((input: any) => input[0] == "dtend")[3],
    moduleId: vEventObj[1].find((input: any) => input[0] == "summary")[3].split(" - ")[0],
    fileName: fileName,
    displayed: false
  }
  
  if (event.title.endsWith(" - Vorlesung")) {
    event.color = "#3788d8";
  } else if(event.title.endsWith(" - Übung")) {
    event.color = "#ede99d";
    event.textColor = "black";
  } else if (event.title.endsWith(" - Praktikum")) {
    event.color = "#5a228b"
  } else {
    event.color = "#d2c2d1";
    event.textColor = "black";
  }

  return event;
}

function updateCalenderEvents() {
  //Calculate conflicts
  let conflicts: Conflict[] = getTimeConflicts(events.filter(e => e.displayed));

  //Add all day conflicts
  let allDayConflicts: Conflict[] = [];
  conflicts.map(getAllDayConflict).forEach(c => allDayConflicts.push(c));

  displayConflicts(conflicts);

  calendar.removeAllEventSources();
  let c = [...events.filter(e => e.displayed), ...conflicts, ...allDayConflicts];
  calendar.addEventSource(c);
}

function getAllDayConflict(conflict: Conflict): Conflict {
  return {
    title: 'Konflikt',
    color: 'red',
    display: 'background',
    start: conflict.start.split("T")[0],
    end: conflict.end.split("T")[0]
  }
}

function toggledCheckbox(event: Event, fileName: string) {
  const target = event.target as HTMLInputElement;

  events.filter(e => e.fileName == fileName).filter(e => e.moduleId == target.id.split("-")[1]).forEach(e => e.displayed = target.checked);
  updateCalenderEvents();
}

function addCheckbox(parendElement: HTMLElement, text: string, id: string, fileName: string) {
  const formCheckDiv = document.createElement("div");
  formCheckDiv.classList.add("form-check");

  const input = document.createElement("input");
  input.classList.add("form-check-input");
  input.type = "checkbox";
  input.id = id;
  input.addEventListener('change', (event) => toggledCheckbox(event, fileName));
  input.checked = false;

  const label = document.createElement("label");
  label.classList.add("form-check-label");
  label.htmlFor = input.id;
  label.innerText = text;

  parendElement.appendChild(formCheckDiv);
  formCheckDiv.appendChild(input);
  formCheckDiv.appendChild(label);
}


function clearListElements(parendElement: HTMLElement) {
  while (parendElement.hasChildNodes()) {
    parendElement.removeChild(parendElement.firstChild!);
  }
}

function addFileCard(fileName: string, fileNr: number) {
  fileCardElement.insertAdjacentHTML('beforeend', `
      <div class="card mb-3">
        <h5 class="card-header" data-bs-toggle="collapse" href="#file-${fileNr}-collapse" role="button">${fileName}</h5>
        <div class="card-body collapse show" id="file-${fileNr}-collapse">
          <p class="card-text"><div id="file-${fileNr}-titles"></div></p>
          <button id="file-${fileNr}-all-on" class="btn btn-primary" value="${fileNr}">Alle einblenden</button>
          <button id="file-${fileNr}-all-off" class="btn btn-primary" value="${fileNr}">Alle ausblenden</button>
        </div>
      </div>
  `);

  document.getElementById(`file-${fileNr}-all-on`)!.addEventListener('click', () => {
    toggleAllCheckboxesFromFile(document.getElementById(`file-${fileNr}-titles`)!, fileName, true);
  });

  document.getElementById(`file-${fileNr}-all-off`)!.addEventListener('click', () => {
    toggleAllCheckboxesFromFile(document.getElementById(`file-${fileNr}-titles`)!, fileName, false);
  });
}

function toggleAllCheckboxesFromFile(parendElement: HTMLElement, fileName: string, checked: boolean) {
  parendElement.childNodes.forEach(child => {
    const input = child.firstChild as HTMLInputElement;
    input.checked = checked;
  });

  events.filter(e => e.fileName == fileName).forEach(e => e.displayed = checked);

  updateCalenderEvents();
}

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar')!;
  fileCardElement = document.getElementById('fileList')!;

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
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    themeSystem: 'bootstrap5',
    navLinks: true,
    dayMaxEvents: true,
    locale: deLocale
  });

  calendar.render();
});

function getTimeConflicts(events: any) {
  const conflicts: Conflict[] = [];
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const event1 = events[i];
      const event2 = events[j];
      if (event1.start < event2.end && event1.end > event2.start) {
        // Zeitkonflikt gefunden
        const start = event1.start < event2.start ? event2.start : event1.start;
        const end = event1.end < event2.end ? event1.end : event2.end;
        conflicts.push({ start, end, color: "red", display: 'background', title: 'Konflikt' });
      }
    }
  }
  return conflicts;
}

function displayConflicts(conflicts: Conflict[]) {
  const now = new Date();
  const conflictFiltered = conflicts.filter(c => new Date(c.end) > now);
  document.getElementById("conflict-counter")!.innerText = String(conflictFiltered.length);

  const conflictListElement = document.getElementById("conflicts")!;
  clearListElements(conflictListElement);

  conflictFiltered.sort((c1, c2) => Date.parse(c1.start) - Date.parse(c2.start)).forEach(c => {
    const entry = document.createElement("li");
    entry.classList.add("list-group-item");
    entry.innerText = `${new Date(c.start).toLocaleDateString()}: ${new Date(c.start).toLocaleTimeString()} bis ${new Date(c.end).toLocaleTimeString()}`;
    conflictListElement.appendChild(entry);
  });
}
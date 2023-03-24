import { Calendar, DayHeaderContentArg, EventSourceInput } from '@fullcalendar/core';
import { Component, createElement } from '@fullcalendar/core/preact';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { EventEntity, VEvent } from './entity'

var ICAL = require("ical.js");
require('bootstrap');

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

let titlesElement: HTMLElement;

let events: EventEntity[] = [];

document.getElementById("allOn")?.addEventListener('click', (event: Event) => {
  checkBoxesChangeAll(titlesElement, true);
});

document.getElementById("allOff")?.addEventListener('click', (event: Event) => {
  checkBoxesChangeAll(titlesElement, false);
});

document.getElementById("formFileMultiple")?.addEventListener('change', (event: Event) => {
  const target = event.target as HTMLInputElement;
  console.log(target.files);

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

function getModuleTitles(): string[] {
  return events.map(e => e.moduleId).filter((value, index, array) => array.indexOf(value) === index).sort();
}

function rerenderModules() {
  clearListElements(titlesElement);
  getModuleTitles().forEach(t => addCheckbox(titlesElement, t, t));
}

function mapVEvent(vEventObj: any, fileName: string): EventEntity {
  return {
    id: vEventObj[1].find((input: any) => input[0] == "uid")[3],
    title: vEventObj[1].find((input: any) => input[0] == "summary")[3],
    start: vEventObj[1].find((input: any) => input[0] == "dtstart")[3],
    end: vEventObj[1].find((input: any) => input[0] == "dtend")[3],
    moduleId: vEventObj[1].find((input: any) => input[0] == "summary")[3].split(" - ")[0],
    fileName: fileName,
    displayed: false
  }
}

function updateCalenderEvents() {
  calendar.removeAllEventSources();
  calendar.addEventSource(events.filter(e => e.displayed));
}

function toggledCheckbox(event: Event) {
  const target = event.target as HTMLInputElement;

  events.filter(e => e.moduleId == target.id).forEach(e => e.displayed = target.checked);
  updateCalenderEvents();
}

function addCheckbox(parendElement: HTMLElement, text: string, id: string) {
  const formCheckDiv = document.createElement("div");
  formCheckDiv.classList.add("form-check");

  const input = document.createElement("input");
  input.classList.add("form-check-input");
  input.type = "checkbox";
  input.id = id
  input.addEventListener('change', toggledCheckbox);
  input.checked = false;

  const label = document.createElement("label");
  label.classList.add("form-check-label");
  label.htmlFor = input.id;
  label.innerText = text;

  parendElement.appendChild(formCheckDiv);
  formCheckDiv.appendChild(input);
  formCheckDiv.appendChild(label);
}

function checkBoxesChangeAll(parendElement: HTMLElement, checked: boolean) {
  parendElement.childNodes.forEach(child => {
    const input = child.firstChild as HTMLInputElement;
    input.checked = checked;
  });

  events.forEach(e => e.displayed = checked);

  updateCalenderEvents();
}

function clearListElements(parendElement: HTMLElement) {
  while (parendElement.hasChildNodes()) {
    parendElement.removeChild(parendElement.firstChild!);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar')!;
  titlesElement = document.getElementById('titles')!;

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
});

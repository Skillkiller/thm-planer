export interface EventEntity {
    id: string,
    title: string,
    start: string,
    end: string,
    moduleId: string,
    displayed: boolean
}

export interface VEvent {
    title: string,
    start: string,
    end: string
}

export interface Conflict {
    title: 'Konflikt',
    start: string,
    end: string,
    display: 'background',
    color: 'red'
}
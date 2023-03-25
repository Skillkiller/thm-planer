export interface EventEntity {
    id: string,
    title: string,
    start: string,
    end: string,
    moduleId: string,
    fileName: string,
    displayed: boolean,
    color?: string,
    textColor?: string,
}

export interface VEvent {
    title: string,
    start: string,
    end: string
    color?: string,
    textColor?: string,
}

export interface Conflict {
    title: 'Konflikt',
    start: string,
    end: string,
    display: 'background',
    color: 'red'
}
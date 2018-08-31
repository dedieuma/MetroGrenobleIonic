

export interface Arret {
    stopId: string;
    trips: number[];
    stopName: string;
    lat: number;
    lon: number;
    parentStation: string;
}

export interface TimeSheetDowntown {
    arrets: Arret[];
    prevTime: number;
    nextTime: number;
}

export interface Arret2 {
    stopId: string;
    trips: number[];
    stopName: string;
    lat: number;
    lon: number;
    parentStation: string;
}

    export interface TimeSheetUptown {
    arrets: Arret2[];
    prevTime: number;
    nextTime: number;
}

export interface TimeSheet {
    timeSheetDowntown: TimeSheetDowntown;
    timeSheetUptown: TimeSheetUptown;
}



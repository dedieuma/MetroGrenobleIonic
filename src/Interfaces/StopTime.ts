

export interface Pattern {
    id: string;
    desc: string;
    dir: number;
    shortDesc: string;
}

export interface Time {
    stopId: string;
    stopName: string;
    scheduledArrival: number;
    scheduledDeparture?: number;
    realtimeArrival: number;
    realtimeDeparture?: number;
    arrivalDelay: number;
    departureDelay: number;
    timepoint: boolean;
    realtime: boolean;
    serviceDay: number;
    tripId: any;
}

export interface StopTime {
    pattern: Pattern;
    times: Time[];
}

export interface FilteredStopTimes {
    direction1: {
        desc: string;
        times: Array<Time>;
    };
    direction2: {
        desc: string;
        times: Array<Time>;
    }
}




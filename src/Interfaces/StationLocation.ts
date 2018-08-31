import { ILatLng } from "@ionic-native/google-maps";

export interface StationLocation{
    "stopName": string;
    "parentStation": string;
    "position" : ILatLng;
}
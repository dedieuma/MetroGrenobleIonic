import { FilteredStopTimes } from './../../Interfaces/StopTime';
import { StationLocation } from './../../Interfaces/StationLocation';
import { Line } from './../../Interfaces/Line';
import { TransportLine } from './../../Interfaces/TransportLine';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { TimeSheet } from '../../Interfaces/TimeSheet';
import { StopTime } from '../../Interfaces/StopTime';

/*
  Generated class for the MapProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapProvider {

  constructor(public http: HttpClient, public loadingCtrl: LoadingController) {



  }

  async getLinesPromise(): Promise<Line[]> {
    let url = "https://data.metromobilite.fr/api/routers/default/index/routes";
    console.log("Asking " + url + "...");
    const response = await this.http.get<Line[]>(url);
    return response.toPromise();
  }

  async getLines(transportationMode): Promise<Line[]> {
    let lines: Line[]=  await this.getLinesPromise()
    // Filtering the lines to get only the good transportation mode
    lines = lines.filter((item) => {
      return item.type == transportationMode;
    }).sort((a, b) => {
      if (a.shortName < b.shortName) return -1;
      else return 1;
    })

    return lines;
  }

  async getTransportLine(id: string): Promise<TransportLine> {
    let url = "https://data.metromobilite.fr/api/lines/poly?types=ligne&codes=" + id;
    console.log("Asking " + url + "...");
    const response = await this.http.get<TransportLine>(url);
    return response.toPromise();
  }

  async getTimeSheets(route: string): Promise<TimeSheet> {
    let url = "https://data.metromobilite.fr/api/ficheHoraires/json?route=" + route;
    console.log("Asking " + url + "...");
    const response = await this.http.get<TimeSheet>(url);
    return response.toPromise();
  }

  async getTimeSheetsStopLocation(zonesArret: TransportLine): Promise<StationLocation[]> {
    let timeSheets = await this.getTimeSheets(zonesArret.features[0].properties.CODE.replace('_', ':'));
    let stationLocationMapping: Array<StationLocation> = [];
    timeSheets[0].arrets.forEach(arret => {
      stationLocationMapping.push({ "stopName": arret.stopName, "parentStation": arret.parentStation, "position": { "lat": arret.lat, "lng": arret.lon } })
    });

    return stationLocationMapping;

  }

  async getStopTimes(station: StationLocation): Promise<StopTime[]> {
    let url = "https://data.metromobilite.fr/api/routers/default/index/clusters/" + station.parentStation + "/stoptimes";
    console.log("Asking " + url + "...");
    const response = await this.http.get<StopTime[]>(url);
    return response.toPromise();
  }

  async getStopTimesOnStation(lineCode: string, station: StationLocation) {
    let stopTime: StopTime[] = await this.getStopTimes(station);

    stopTime = stopTime.filter((time) => {
      if (time != null && time.pattern != null && time.pattern.id != null) {
        let idSplitted = time.pattern.id.split(":");
        return (idSplitted[0] + ":" + idSplitted[1]) == lineCode;
      }
    })

    let filteredStopTime: FilteredStopTimes = {
      direction1: {
        desc: stopTime[0].pattern.desc,
        times: stopTime[0].times
      },
      direction2: {
        desc: stopTime[1].pattern.desc,
        times: stopTime[1].times
      }
    };

    return filteredStopTime;






  }





}

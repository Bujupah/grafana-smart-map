import { Viewport } from "react-leaflet";
import { Reclamation } from "./najda";

export interface MapLayers{
    label: string,
    value: string,
    attribution: string,
    key: number,
}

export const defaultLayer: MapLayers = {
    label: 'OpenStreetMap_Mapnik',
    value: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    key: 0,
}

export interface MapMarker{
    url: string,
    headers: string,
}

export const defaultMarker: MapMarker = {
    url: null,
    headers: null,
}

export interface MarkerTemplate{
    popUpTemplate: string;
    latitudeTemplate: string;
    longitudeTemplate: string;
}
export const defaultPopupTemplate : MarkerTemplate = {
    popUpTemplate: null,
    latitudeTemplate: null,
    longitudeTemplate: null,
}

export interface MapOptions{
    tileLayer: MapLayers,
    viewport: Viewport,
    showFullscreen: boolean;
    showScaler: boolean;
    markersApi: MapMarker;
    markerTemplate: MarkerTemplate;
    markersList: Reclamation[]
}

export const defaults: MapOptions = {
    tileLayer: defaultLayer,
    viewport: {center: [35.09,9.505], zoom: 6,},
    showFullscreen: false,
    showScaler: false,
    markersApi: defaultMarker,
    markerTemplate: defaultPopupTemplate,
    markersList: []
}
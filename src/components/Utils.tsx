import React from 'react';
import { isNull } from 'util';
import { MapLayers } from "../types";
import { renderMarkdown } from '@grafana/data';

import { Marker, Popup } from "react-leaflet";
import L from 'leaflet';

export class Utils{

    static parseIt = (state:any, data?: any) => {
        if(state.markerTemplate.popUpTemplate == null) 
            return data;
        return Utils.interpolateUrl(state.markerTemplate.popUpTemplate, data);
    }

    static interpolateUrl = (string, values) => string.replace(/{(.*?)}/g, (match, offset) => values[offset]);
    static validURL(str: string) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    static setMarkerIcon = (url: any) => (
        new L.Icon({
            className:"g-smart-map-rounded",
            iconUrl: url,
            iconSize: [25, 25],
            popupAnchor: [0,-10]
        })
    )
    static setMarker = (lat: any, lng: any,image:any,  popup: any) => 
        (
            <Marker position={{lat: lat, lng: lng}} icon={Utils.setMarkerIcon(image)}>
                <Popup>
                    <p dangerouslySetInnerHTML={{__html: renderMarkdown(popup)}} />
                </Popup>
            </Marker>
        )

    static useDB = (state: any, props:any, markersList:any) => {
        const db_data:any = props.data.series[0];
        for (let index = 0; index < db_data.rows.length; index++) {
            var element:any = JSON.parse(db_data.rows[index]);
            markersList.push(      
                Utils.setMarker(
                    Utils.interpolateUrl(state.markerTemplate.latitudeTemplate, element), 
                    Utils.interpolateUrl(state.markerTemplate.longitudeTemplate, element),
                    Utils.interpolateUrl("{image}", element),
                    Utils.parseIt(state, element)
                )
            )
        }
    }

    static useAPI = (state: any, props:any, markersList:any) => {
        if(isNull(state.markersApi.url)) return;
        if(Utils.validURL(state.markersApi.url)) return;
        fetch(state.markersApi.url, {headers: JSON.parse(state.markersApi.headers)})
        .then(response => response.json()
        .then(data => { 
            data.forEach(element => {
                markersList.push(
                    Utils.setMarker(
                        Utils.interpolateUrl(state.markerTemplate.latitudeTemplate, data), 
                        Utils.interpolateUrl(state.markerTemplate.longitudeTemplate, data),
                        Utils.interpolateUrl("{image}", data),
                        Utils.parseIt(state, element)
                    )
                )
            });
        }))
        .catch(error => console.log(error));
    }
}
export interface MapLayersList{
    templates: MapLayers[]
}
export const defaultMapLayersList: MapLayersList = {
    templates: [
        {
            label: 'OpenStreetMap_Mapnik',
            value: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            key: 0,
        },
        {
            label: 'OpenStreetMap.DE',
            value: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            key: 1,
        },
        {
            label: 'OpenStreetMap.France',
            value: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
            attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            key: 2,
        },
        {
            label: 'OpenStreetMap.HOT',
            value: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
            key: 3,
        },
        {
            label: 'OpenStreetMap_BZH',
            value: 'https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="http://www.openstreetmap.bzh/" target="_blank">Breton OpenStreetMap Team</a>',
            key: 4,
        },
        {
            label: 'OpenTopoMap',
            value: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            key: 5,
        },
        {
            label: 'CyclOSM',
            value: 'https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: '+
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            key: 6,
        },
        {
            label: 'CartoDB Positron',
            value: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' + 
                    '&copy; <a href="https://www.cartodb.com/attributions">CartoDB</a> contributors',
            key: 7,
        },
        {
            label: 'CartoDB Dark',
            value: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' + 
                    '&copy; <a href="https://www.cartodb.com/attributions">CartoDB</a> contributors',
            key: 8,
        }
    ]
}
import React, { Component } from 'react';
import { PanelProps, DataFrame, renderMarkdown } from '@grafana/data';
import { MapOptions, MapLayers, MapMarker, MarkerTemplate} from '../types';
import { isNull } from 'util';

import './Map.css'
import { Map, TileLayer, Popup, Viewport, Marker } from 'react-leaflet';
import { Reclamation } from '../najda';
import L from 'leaflet';

interface Props extends PanelProps<MapOptions> {}

interface State {
    tileLayer: MapLayers,
    viewport: Viewport,
    showFullscreen: boolean;
    showScaler: boolean;
    markersApi: MapMarker;
    markerTemplate: MarkerTemplate;
    markersList: Reclamation[];
}

export class MapPanel extends Component<Props, State> {

    static scrollable = true;
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            tileLayer: this.props.options.tileLayer,
            viewport: this.props.options.viewport,
            showFullscreen: this.props.options.showFullscreen,
            showScaler: this.props.options.showScaler,
            markersApi: this.props.options.markersApi,
            markerTemplate: this.props.options.markerTemplate,
            markersList: this.props.options.markersList,
        };
    }

    onClickReset = ({target}) => {
    }

    onViewportChanged = (viewport: Viewport) => {
        if(viewport.zoom >= 20)
            viewport.zoom = 20;
        this.setState({ viewport });
    }

    componentDidMount(): void{
        this.loadMap(this.props.options);
    }

    componentDidUpdate(prevProps: Props): void {
        if (this.props.options.tileLayer !== prevProps.options.tileLayer) {
            this.loadMap(this.props.options);
        }
        if (this.props.options.viewport !== prevProps.options.viewport) {
            this.loadMap(this.props.options);
        }
        if (this.props.options.showFullscreen !== prevProps.options.showFullscreen) {
            this.loadMap(this.props.options);
        }
        if (this.props.options.showScaler !== prevProps.options.showScaler) {
            this.loadMap(this.props.options);
        }
        if (this.props.options.markersApi !== prevProps.options.markersApi) {
            this.loadMap(this.props.options);
        }
        if (this.props.options.markerTemplate !== prevProps.options.markerTemplate) {
            this.loadMap(this.props.options);
        }
    }



    loadMap(options: MapOptions){
        this.setState(
            {
                tileLayer: options.tileLayer,
                viewport: options.viewport,
                showFullscreen: options.showFullscreen,
                showScaler: options.showScaler,
                markersApi: options.markersApi,
                markerTemplate: options.markerTemplate,
            }
        );
    }

    // http://192.168.8.158:8888/API/reclamation
    // {"Content-Type": "application/json","Authorization": "Bearer H8IAwJwv9PJHz6BPsXaOvdihelFemUOy"}


    markersList:any = [];
    marker: Marker;
    setMarkerIcon = (url: any) => (
        new L.Icon({
            className:"g-smart-map-rounded",
            iconUrl: url,
            iconAnchor: [5, 55],
            popupAnchor: [10, -44],
            iconSize: [25, 25],
            shadowSize: [68, 95],
            shadowAnchor: [20, 92],
        })
    )
    setMarker = (lat: any, lng: any,image:any,  popup: any) => {
        return (
            <Marker position={{lat: lat, lng: lng}} icon={this.setMarkerIcon(image)}>
                <Popup>
                    <p dangerouslySetInnerHTML={{__html: renderMarkdown(popup)}} />
                </Popup>
            </Marker>
            )
        }
    
    useDB = () => {
        const db_data:DataFrame = this.props.data.series[0];
        for (let index = 0; index < db_data.fields[0].values.length; index++) {
            var data:any = JSON.parse(db_data.fields[0].values.get(index));
            console.log(data);
            this.markersList.push(      
                this.setMarker(
                    this.interpolateUrl(this.state.markerTemplate.latitudeTemplate, data), 
                    this.interpolateUrl(this.state.markerTemplate.longitudeTemplate, data),
                    this.interpolateUrl("{image}", data),
                    this.parseIt(data)
                )
            )
        }
    }

    useAPI = () => {
        if(isNull(this.state.markersApi.url)) return;
        fetch(this.state.markersApi.url, {headers: JSON.parse(this.state.markersApi.headers)})
        .then(response => response.json().then(data => {
            data.forEach(element => {
                    this.markersList.push(
                        this.setMarker(
                            this.interpolateUrl(this.state.markerTemplate.latitudeTemplate, data), 
                            this.interpolateUrl(this.state.markerTemplate.longitudeTemplate, data),
                            this.interpolateUrl("{image}", data),
                            this.parseIt(element)
                        )
                    )
            });
        }))
        .catch(error => console.log(error));
    }

    parseIt = (data?) => {
        if(this.state.markerTemplate.popUpTemplate == null) 
            return data;
        return this.interpolateUrl(this.state.markerTemplate.popUpTemplate, data);
    }

    interpolateUrl = (string, values) => string.replace(/{(.*?)}/g, (match, offset) => values[offset]);
    validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    render(){
        this.markersList = [];
        if(this.props.data.state == "Done") 
            this.useDB()
        if(this.validURL(this.state.markersApi.url))
            this.useAPI();
            
        var myCurrentMap = document.getElementById('g-smart-map');

        console.log(myCurrentMap)
        return (
            <>
                <Map 
                    id='g-smart-map'
                    ref='g-smart-map'
                    viewport={this.state.viewport} 
                    className={"g-smart-map markercluster-map"} 
                    animate={true} 
                    useFlyTo={true}>
                    <TileLayer
                        attribution={this.state.tileLayer.attribution}
                        url={this.state.tileLayer.value}
                    />
                    {/* <MarkerClusterGroup> */}
                        { this.markersList }
                    {/* </MarkerClusterGroup> */}
                </Map>
            </>
        );
    }
}

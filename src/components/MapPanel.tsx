import React, { Component } from 'react';
import { PanelProps } from '@grafana/data';
import { MapOptions, MapLayers, MapMarker, MarkerTemplate} from '../types';

import './Map.css'
import { Map, TileLayer, Viewport } from 'react-leaflet';
import { Reclamation } from '../najda';
import { Utils } from './Utils';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

import Routing from './RoutingMachine';


interface Props extends PanelProps<MapOptions> {}

interface State {
    tileLayer: MapLayers,
    viewport: Viewport,
    showFullscreen: boolean;
    showScaler: boolean;
    markersApi: MapMarker;
    markerTemplate: MarkerTemplate;
    markersList: Reclamation[];
    datasourceConfig: any
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
            datasourceConfig: this.props.options.datasourceConfig,
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
                datasourceConfig: options.datasourceConfig,
            }
        );
    }

    // http://192.168.8.158:8888/API/reclamation
    // {"Content-Type": "application/json","Authorization": "Bearer H8IAwJwv9PJHz6BPsXaOvdihelFemUOy"}

    markersList:any = [];
    render() {
        this.markersList = [];
        if(this.state.datasourceConfig.useDB) Utils.useDB(this.state, this.props, this.markersList)
        if(this.state.datasourceConfig.useAPI) Utils.useAPI(this.state, this.props, this.markersList);
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
                    {
                        <Routing map={this.refs.name['g-smart-map']}></Routing>
                    }
                </Map>
            </>
        );
    }
}

import React, {PureComponent} from 'react';
import { FormField, PanelOptionsGroup, Switch, Select, PanelOptionsGrid, Input, FormLabel } from '@grafana/ui';
import { PanelEditorProps, SelectableValue } from '@grafana/data';
import { MapOptions, MapLayers, MapMarker, MarkerTemplate } from '../types';
import { Viewport } from "react-leaflet";
import { defaultMapLayersList } from './Map';
import { Reclamation } from '../najda';

interface State {
    tileLayer: MapLayers;

    viewport: Viewport;
    showFullscreen: boolean;
    showScaler:boolean;

    markersApi: MapMarker;
    markerTemplate: MarkerTemplate;
    markersList: Reclamation[]

    // geoReverse:boolean;
    // geoReverseUrl:string;
    
    // showZoom: boolean;
    // showLegend: boolean;
    // routing:boolean;
}

export class MapEditor 
    extends PureComponent<PanelEditorProps<MapOptions>,State > {
    
    constructor(props) {
        super(props);
        this.state = {
            tileLayer: props.options.tileLayer,
            viewport : props.options.viewport,

            showFullscreen: props.options.showFullscreen,
            showScaler: props.options.showScaler,

            markersApi: props.options.markersApi,
            markerTemplate: props.options.markerTemplate,

            markersList: props.options.markersList,
        };

    }
    onUpdatePanel = () => {
        this.props.onOptionsChange(
            { 
                ...this.props.options, 
                tileLayer: this.state.tileLayer,
    
                viewport: this.state.viewport,
    
                showFullscreen: this.state.showFullscreen,
                showScaler: this.state.showScaler,
    
                markersApi: this.state.markersApi,
                markerTemplate: this.state.markerTemplate,
                
                markersList: this.state.markersList,
            }
        );
    }
    
    onLayerChange = (item: SelectableValue<String>)=> {
        const tileLayer = defaultMapLayersList.templates.find(o => o.label == item.label);
        this.setState({ tileLayer:  tileLayer})
    }
    
    onFscreenChange = ({target}) => this.setState({showFullscreen: target.checked})
    onScalerChange = ({target}) => this.setState({showScaler: target.checked});

    onLngChange = ({ target }) => this.setState({viewport: {center: [target.value, this.state.viewport.center[1]],zoom: this.state.viewport.zoom,}});
    onLatChange = ({ target }) => this.setState({viewport: {center: [this.state.viewport.center[0], target.value],zoom: this.state.viewport.zoom,}});
    onZoomChange = ({ target }) => this.setState({viewport: {center: this.state.viewport.center,zoom: target.value,}});
    
    onApiMarkerUrlChange = ({ target }) => this.setState({ markersApi: {url: target.value, headers: this.state.markersApi.headers} });
    onApiMarkerHeaderChange = ({ target }) => this.setState({ markersApi: {url: this.state.markersApi.url, headers: target.value}});
    
    onMarkerPopUpTemplateChange = ({target}) => this.setState({markerTemplate: {popUpTemplate: target.value,latitudeTemplate: this.state.markerTemplate.latitudeTemplate,longitudeTemplate: this.state.markerTemplate.longitudeTemplate}})
    onMarkerLatitudeTemplateChange = ({target}) => this.setState({markerTemplate: {popUpTemplate: this.state.markerTemplate.popUpTemplate,latitudeTemplate: target.value,longitudeTemplate: this.state.markerTemplate.longitudeTemplate}})
    onMarkerLongitudeTemplateChange = ({target}) => this.setState({markerTemplate: {popUpTemplate: this.state.markerTemplate.popUpTemplate,latitudeTemplate: this.state.markerTemplate.latitudeTemplate,longitudeTemplate: target.value}})
    
    render() {
        const { viewport, showFullscreen, showScaler, tileLayer} = this.state;
        return (
            <>
                    
                <PanelOptionsGrid>
                <PanelOptionsGroup  title="Map config">
                        <div className="gf-form">
                            <label className={"gf-form-label width-10"}>
                                Show
                            </label>
                            <Select
                                width={25}
                                value = {tileLayer}
                                options={defaultMapLayersList.templates}
                                onChange={this.onLayerChange}
                                onBlur={this.onUpdatePanel} />
                        </div>
                        <div className="gf-form">
                            <FormField
                                label="Longitude"
                                labelWidth={10}
                                inputWidth={8}
                                defaultValue={6}
                                type="number"
                                value={viewport.center[0]}
                                onChange={this.onLngChange}
                                onBlur={this.onUpdatePanel}
                            />
                        </div>
                        <div className="gf-form">
                            <FormField
                                label="Latitude"
                                labelWidth={10}
                                inputWidth={8}
                                type="number"
                                value={viewport.center[1]}
                                onChange={this.onLatChange}
                                onBlur={this.onUpdatePanel}
                            />
                        </div>
                        <div className="gf-form">
                            <FormField
                                label="Zoom"
                                labelWidth={10}
                                inputWidth={8}
                                type="number"
                                value={viewport.zoom}
                                onChange={this.onZoomChange}
                                onBlur={this.onUpdatePanel}
                            />
                        </div>
                        <div className="gf-form">
                            <Switch 
                                label={"Fullscreen?"}
                                tooltip={"This will enable fullscreen map button"}
                                labelClass={"GrafanaSmartMapLabel"}
                                switchClass={"GrafanaSmartMapSwitch"}
                                onChange={this.onFscreenChange}
                                checked={showFullscreen}
                            />
                            <Switch 
                                label={"Add Ruler?"}
                                tooltip={"This will show up a scaler for the map"}
                                labelClass={"GrafanaSmartMapLabel"}
                                switchClass={"GrafanaSmartMapSwitch"}
                                onChange={this.onScalerChange} 
                                checked={showScaler}
                            />
                        </div>
                    </PanelOptionsGroup>
                    <PanelOptionsGroup title="Json as datasource">
                        <div className="gf-form">
                            <FormField
                                label="API URL"
                                labelWidth={10}
                                inputWidth={30}
                                value={this.state.markersApi.url}
                                onChange={this.onApiMarkerUrlChange}
                                onBlur={this.onUpdatePanel}
                            />
                        </div>
                        <div className="gf-form">
                            <label 
                                className="gf-form-label width-10"
                                style={{height: '160px',display: 'flex',alignItems:'center'}}>
                                Headers
                            </label>
                            <textarea
                                className="gf-form-input width-30"
                                style={{height:'160px', minHeight:'160px'}}
                                value={this.state.markersApi.headers}
                                onChange={this.onApiMarkerHeaderChange}
                                onBlur={this.onUpdatePanel}
                            />
                        </div>
                        <div className="gf-form">
                            
                        </div>
                    </PanelOptionsGroup>
                    <PanelOptionsGrid>
                        <PanelOptionsGroup title="Map Markers Popup">
                            <div className="gf-form">
                                <FormLabel>
                                    {"{Latitude}"}
                                </FormLabel>
                                <Input
                                    width={15}
                                    value={this.state.markerTemplate.latitudeTemplate}
                                    onChange={this.onMarkerLatitudeTemplateChange}
                                    onBlur={this.onUpdatePanel}
                                />
                                <FormLabel>
                                    {"{Longitude}"}
                                </FormLabel>
                                <Input
                                    width={15}
                                    value={this.state.markerTemplate.longitudeTemplate}
                                    onChange={this.onMarkerLongitudeTemplateChange}
                                    onBlur={this.onUpdatePanel}
                                />
                            </div>
                            <div className="gf-form">
                                <label 
                                    className="gf-form-label width-10"
                                    style={{height: '160px',display: 'flex',alignItems:'center'}}>
                                    Popup HTML
                                </label>
                                <textarea
                                    className="gf-form-input width-30"
                                    style={{height:'160px', minHeight:'160px'}}
                                    datatype="text"
                                    value={this.state.markerTemplate.popUpTemplate}
                                    onChange={this.onMarkerPopUpTemplateChange}
                                    onBlur={this.onUpdatePanel}
                                />
                            </div>
                        </PanelOptionsGroup>
                    </PanelOptionsGrid>
                </PanelOptionsGrid>

            </>
        );
    }
}
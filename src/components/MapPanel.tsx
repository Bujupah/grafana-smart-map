import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { MapOptions } from '../types';

import 'leaflet/dist/leaflet.css';
import './Map.css';
import { Map, TileLayer, Viewport} from 'react-leaflet'

interface Props extends PanelProps<MapOptions> {}

interface State {
    viewport: Viewport,
}




export class MapPanel extends PureComponent<Props, State> {
    static scrollable = true;
    constructor(props) {
        super(props);
    
        this.state = {
            viewport: {center: [35.09,9.505],zoom: 6,}
        }
      }
    

    onClickReset = () => {
        this.setState(
            { viewport: {center: [35.09,9.505],zoom: 6,}}
        )
    }
    
    onViewportChanged = (viewport: Viewport) => {
        this.setState({ viewport })
    }

    render(){
        return (
            <>  
                <Map
                    className={"GrafanaSmartMap"}
                    onClick={this.onClickReset}
                    onViewportChanged={this.onViewportChanged}
                    viewport={this.state.viewport}
                    shouldUpdateCenter={true}
                    shouldUpdateBounds={true}>

                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                    />
                
                </Map>
            </>
        );
    }
}

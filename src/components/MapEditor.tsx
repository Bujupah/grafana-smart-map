import React, {PureComponent} from 'react';
import { FormField, PanelOptionsGroup } from '@grafana/ui';
import { PanelEditorProps } from '@grafana/data';
import { MapOptions } from '../types';

interface State {
    layerUrl: string;
    // mapStyle: number;
    // mapCenter: string;
    // mapZoom: number;

    // geoReverse:boolean;
    // geoReverseUrl:string;
    
    // showZoom: boolean;
    // showLegend: boolean;
    // showFullscreen: boolean;
    // showScaler:boolean;
    // routing:boolean;
}

export class MapEditor 
    extends PureComponent<PanelEditorProps<MapOptions>,State > {
    
    constructor(props) {
        
        super(props);
        this.state = {
            layerUrl: props.options.layerUrl
        };

    }

    onUpdatePanel = () => this.props.onOptionsChange({ ...this.props.options, layerUrl: this.state.layerUrl });
    onLayerUrlChange = ({ target }) => this.setState({ layerUrl: target.value });


    render() {
        const { layerUrl} = this.state;

        return (
            <>
                <PanelOptionsGroup title="Map Options" onAdd={()=>console.log(this.state)}>
                    <div className="gf-form">
                        <FormField
                            label="Leaflet Layer Url"
                            labelWidth={10}
                            inputWidth={10}
                            value={layerUrl}
                            onChange={this.onLayerUrlChange}
                            onBlur={this.onUpdatePanel}
                        />
                    </div>
                </PanelOptionsGroup>
            </>
        );
    }
}
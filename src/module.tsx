import { PanelPlugin } from '@grafana/data';
import { MapOptions, defaults } from './types';
import { MapPanel } from './components/MapPanel';
import { MapEditor } from './components/MapEditor';

export const plugin = new PanelPlugin<MapOptions>(MapPanel)
    .setDefaults(defaults)
    .setEditor(MapEditor);
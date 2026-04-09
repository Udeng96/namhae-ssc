import L, {
  DivIcon, Icon,
  LatLngExpression,
  LeafletKeyboardEventHandlerFn,
  Marker,
  MarkerOptions,
} from 'leaflet';

interface DataMarkerOptions<T> extends MarkerOptions {
  data: T;
}

export class DataMarker<T = any> {
  private marker: Marker;
  private data: T;

  constructor(latlng: LatLngExpression, options: DataMarkerOptions<T>) {
    this.marker = new Marker(latlng, options);
    this.data = options.data;
  }

  getLeafletMarker(): Marker {
    return this.marker;
  }

  getData(): T {
    return this.data;
  }

  addTo(map: L.Map): this {
    this.marker.addTo(map);
    return this;
  }

  remove(): this {
    this.marker.remove();
    return this;
  }

  on(type: string, fn: LeafletKeyboardEventHandlerFn, context?: any): this {
    this.marker.on(type, fn);
    return this;
  }

  setIcon(icon: Icon | DivIcon): this {
    this.marker.setIcon(icon);
    return this;
  }
}

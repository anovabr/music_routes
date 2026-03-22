import { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { flatComposers, PERIODS } from '../data/composers';

const NATIONALITY_COORDS = {
  'German':          [51.2, 10.4],
  'Austrian':        [47.5, 14.5],
  'Italian':         [42.5, 12.5],
  'French':          [46.6, 2.3],
  'English':         [52.4, -1.5],
  'British':         [52.4, -1.5],
  'Russian':         [55.8, 37.6],
  'Polish':          [52.2, 19.1],
  'Czech':           [49.8, 15.5],
  'Hungarian':       [47.2, 19.0],
  'Norwegian':       [59.9, 10.7],
  'Finnish':         [61.9, 25.7],
  'Swedish':         [59.3, 18.1],
  'Danish':          [55.7, 10.2],
  'Spanish':         [40.4, -3.7],
  'Belgian':         [50.8, 4.4],
  'Dutch':           [52.1, 5.3],
  'Swiss':           [46.8, 8.2],
  'Romanian':        [45.9, 25.0],
  'American':        [39.5, -98.5],
  'Brazilian':       [-14.2, -51.9],
  'Argentine':       [-38.4, -63.6],
  'Greek':           [39.1, 21.8],
  'Georgian':        [42.3, 43.4],
  'Estonian':        [58.6, 24.7],
  'Lithuanian':      [55.2, 23.9],
  'Latvian':         [56.9, 24.6],
  'Japanese':        [36.2, 138.3],
  'Chinese':         [35.9, 104.2],
  'Franco-Flemish':  [50.7, 3.2],
  'Flemish':         [50.7, 3.2],
};

export default function WorldMap({ onClose, onSelectComposer }) {
  const allComposers = useMemo(() => flatComposers(), []);

  const dots = useMemo(() => {
    const map = new Map();
    allComposers.forEach(c => {
      const coords = NATIONALITY_COORDS[c.nationality];
      if (!coords) return;
      const key = c.nationality;
      if (!map.has(key)) map.set(key, { coords, composers: [], nationality: c.nationality });
      map.get(key).composers.push(c);
    });
    return [...map.values()];
  }, [allComposers]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="world-map-modal" onClick={e => e.stopPropagation()}>
        <div className="world-map-header">
          <h2 className="world-map-title">Birthplace Map</h2>
          <p className="world-map-subtitle">Where classical composers were born</p>
          <button className="guided-paths-close" onClick={onClose}>x</button>
        </div>

        <div className="world-map-container">
          <MapContainer
            center={[30, 10]}
            zoom={2}
            minZoom={2}
            maxZoom={6}
            style={{ width: '100%', height: '100%', borderRadius: '6px' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            {dots.map(({ coords, composers, nationality }) => {
              const r = Math.min(6 + composers.length * 1.5, 20);
              const period = composers[0]?.period;
              const color = PERIODS[period]?.color ?? '#888';
              return (
                <CircleMarker
                  key={nationality}
                  center={coords}
                  radius={r}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.85,
                    weight: 1.5,
                  }}
                  eventHandlers={{
                    click: () => {
                      const c = composers[0];
                      if (c) { onSelectComposer(c); onClose(); }
                    },
                  }}
                >
                  <Tooltip direction="top" offset={[0, -r]} opacity={1}>
                    <span style={{ fontWeight: 600 }}>{nationality}</span>
                    <br />
                    {composers.length} composer{composers.length !== 1 ? 's' : ''}
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>

          <div className="world-map-legend">
            {Object.values(PERIODS).map(p => (
              <div key={p.id} className="world-map-legend-item">
                <span className="world-map-legend-dot" style={{ background: p.color }} />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

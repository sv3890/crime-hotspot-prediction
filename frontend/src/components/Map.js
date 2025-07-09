import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = ({ center, zoom, markers, heatmapData }) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '400px', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Regular markers */}
            {markers && markers.map((marker, index) => (
                <Marker
                    key={index}
                    position={[marker.latitude, marker.longitude]}
                >
                    <Popup>
                        <div>
                            <h3>{marker.title}</h3>
                            <p>{marker.description}</p>
                            <p>Risk Level: {marker.risk_level}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
            
            {/* Heatmap data */}
            {heatmapData && heatmapData.map((point, index) => (
                <CircleMarker
                    key={index}
                    center={[point.latitude, point.longitude]}
                    radius={point.weight * 5}
                    pathOptions={{
                        color: point.risk_level === 'high' ? 'red' :
                               point.risk_level === 'medium' ? 'orange' : 'green',
                        fillOpacity: 0.6
                    }}
                >
                    <Popup>
                        <div>
                            <p>Risk Level: {point.risk_level}</p>
                            <p>Weight: {point.weight}</p>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
};

export default Map; 
'use client';

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

export interface MapLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  isOfficial?: boolean;
  type: string;
}

interface MapProps {
  locations?: MapLocation[];
  selectedLocation?: MapLocation | null;
  onMarkerClick?: (location: MapLocation) => void;
  height?: string;
}

const defaultLocations: MapLocation[] = [
  {
    name: 'ZHONGQUE 洛杉矶仓',
    address: '8888 Industrial Way, Los Angeles, CA 90001',
    lat: 33.9425,
    lng: -118.2551,
    isOfficial: true,
    type: '官方仓库',
  },
  {
    name: '华美家居 LA 旗舰店',
    address: '1234 Garvey Ave, Monterey Park, CA 91754',
    lat: 34.0652,
    lng: -118.1146,
    type: '授权经销商',
  },
  {
    name: 'ZHONGQUE 纽约仓',
    address: '50-12 Northern Blvd, Long Island City, NY 11101',
    lat: 40.7527,
    lng: -73.9332,
    isOfficial: true,
    type: '官方仓库',
  },
  {
    name: '法拉盛旗舰展厅',
    address: '136-20 38th Ave, Flushing, NY 11354',
    lat: 40.7633,
    lng: -73.827,
    type: '授权经销商',
  },
  {
    name: '德州中华家具',
    address: '9889 Bellaire Blvd, Houston, TX 77036',
    lat: 29.7048,
    lng: -95.5406,
    type: '授权经销商',
  },
];

const defaultCenter: [number, number] = [37.5, -96.0];

function markerIcon(official: boolean, selected: boolean) {
  const color = official ? '#8B1A1A' : '#9B7EBD';
  const border = selected ? '#D4AF37' : color;
  const size = selected ? 48 : 40;
  const cy = selected ? 24 : 20;
  return divIcon({
    html: `<svg width="${size}" height="${size + 10}" viewBox="0 0 ${size} ${size + 10}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="${selected ? 3 : 1.5}" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M${size / 2} 0 C${size * 0.2} 0 0 ${size * 0.2} 0 ${cy} C0 ${size * 0.7} ${size / 2} ${size + 10} ${size / 2} ${size + 10} C${size / 2} ${size + 10} ${size} ${size * 0.7} ${size} ${cy} C${size} ${size * 0.2} ${size * 0.8} 0 ${size / 2} 0Z" fill="${color}" stroke="${border}" stroke-width="${selected ? 2.5 : 1.5}" filter="url(#glow)"/>
      <circle cx="${size / 2}" cy="${cy}" r="${size * 0.2}" fill="white"/>
      <circle cx="${size / 2}" cy="${cy}" r="${size * 0.1}" fill="${color}"/>
    </svg>`,
    className: '',
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 10],
    popupAnchor: [0, -(size + 10)],
  });
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

export default function Map({
  locations = defaultLocations,
  selectedLocation,
  onMarkerClick,
  height = '400px',
}: MapProps) {
  const center: [number, number] = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : defaultCenter;
  const zoom = selectedLocation ? 11 : 4;

  return (
    <div style={{ height, width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} zoom={zoom} />
        {locations.map((loc) => {
          const isSelected = selectedLocation?.name === loc.name;
          return (
            <Marker
              key={loc.name}
              position={[loc.lat, loc.lng]}
              icon={markerIcon(loc.isOfficial ?? false, isSelected)}
              eventHandlers={{
                click: () => onMarkerClick?.(loc),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}

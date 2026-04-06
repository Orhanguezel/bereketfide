'use client';

import * as React from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import type { PublicDealer } from './types';

const defaultCenter = { lat: 38.9637, lng: 35.2433 };

/** VistaSeed `bayi-map.tsx` ile aynı koyu tema (satır satır uyumlu) */
const mapOptions: google.maps.MapOptions = {
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
    },
  ],
  disableDefaultUI: true,
  zoomControl: true,
  scrollwheel: true,
};

const BRAND_MARKER = '#946e1c';

export default function BayiMap({
  dealers,
  emptyLabel,
  mapHint,
  mapLoadingLabel,
  mapSummaryText,
  height = '550px',
  rounded = true,
}: {
  dealers: PublicDealer[];
  emptyLabel: string;
  mapHint: string;
  mapLoadingLabel: string;
  mapSummaryText: string;
  height?: string;
  rounded?: boolean;
}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const mapRef = React.useRef<google.maps.Map | null>(null);
  const [selectedDealer, setSelectedDealer] = React.useState<PublicDealer | null>(null);

  const markers = React.useMemo(() => {
    return dealers
      .filter((d) => d.latitude && d.longitude)
      .map((d) => ({
        ...d,
        position: {
          lat: parseFloat(d.latitude!),
          lng: parseFloat(d.longitude!),
        },
      }));
  }, [dealers]);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;
    if (markers.length === 0) {
      map.setCenter(defaultCenter);
      map.setZoom(6);
      return;
    }
    if (markers.length === 1) {
      const only = markers[0]!;
      map.setCenter(only.position);
      map.setZoom(9);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    markers.forEach((m) => bounds.extend(m.position));
    map.fitBounds(bounds, 48);
  }, [markers, isLoaded]);

  if (!isLoaded) {
    return (
      <div
        className="flex w-full animate-pulse items-center justify-center border border-(--color-border) bg-(--color-bg-muted)"
        style={{ height, borderRadius: rounded ? '1.5rem' : '0' }}
      >
        <span className="text-sm font-medium italic text-(--color-text-muted) opacity-80">{mapLoadingLabel}</span>
      </div>
    );
  }

  return (
    <div
      className="group relative overflow-hidden border border-(--color-border) shadow-2xl"
      style={{ height, borderRadius: rounded ? '1.5rem' : '0' }}
    >
      <div className="pointer-events-none absolute left-4 top-4 z-10">
        <div
          className="rounded-2xl border border-(--color-border-on-dark) px-4 py-2 shadow-xl transition-colors duration-500"
          style={{
            background: 'color-mix(in srgb, var(--color-bg-dark) 88%, transparent)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <p
            className="text-[10px] font-black uppercase tracking-widest text-(--color-brand-light) transition-colors group-hover:text-(--section-bg-white)"
            style={{ letterSpacing: '0.2em' }}
          >
            {mapHint}
          </p>
          <p className="mt-1 text-sm font-bold text-(--section-bg-white)">{mapSummaryText}</p>
        </div>
      </div>

      {markers.length === 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-(--color-bg-dark)/40 px-6 text-center"
          style={{ zIndex: 5 }}
        >
          <p className="max-w-sm text-sm font-medium text-(--section-bg-white)">{emptyLabel}</p>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={markers.length > 0 ? markers[0]!.position : defaultCenter}
        zoom={6}
        options={mapOptions}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => setSelectedDealer(marker)}
            icon={{
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
              fillColor: BRAND_MARKER,
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
              scale: 1.5,
              labelOrigin: new google.maps.Point(12, -10),
            }}
          />
        ))}

        {selectedDealer && selectedDealer.latitude && selectedDealer.longitude && (
          <InfoWindow
            position={{
              lat: parseFloat(selectedDealer.latitude),
              lng: parseFloat(selectedDealer.longitude),
            }}
            onCloseClick={() => setSelectedDealer(null)}
          >
            <div className="min-w-[200px] p-2 text-(--color-text-primary)">
              <h4 className="mb-1 text-sm font-black uppercase tracking-tight text-(--color-text-primary)">
                {selectedDealer.company_name}
              </h4>
              <p className="text-xs font-bold text-(--color-brand)">
                {[selectedDealer.city, selectedDealer.region].filter(Boolean).join(' / ')}
              </p>
              {selectedDealer.phone ? (
                <p className="mt-2 text-[11px] font-medium opacity-80">Tel: {selectedDealer.phone}</p>
              ) : null}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

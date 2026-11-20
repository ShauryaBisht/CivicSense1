import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Navigation, RotateCcw, Layers } from 'lucide-react';
import { useCivic } from '../context/CivicContext';

export default function InteractiveMap({
  issues = [],
  mode = 'explorer', // 'explorer' | 'picker'
  selectedLocation = null,
  onLocationSelect = null,
  onSelectIssue = null,
  center = [12.9716, 77.5946],
  zoom = 12,
  height = '100%',
  activeMarkerId = null
}) {
  const { theme } = useCivic();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const pickerMarkerRef = useRef(null);
  const markersMapRef = useRef(new Map());

  const isDark = theme === 'dark';

  // Standard OpenStreetMap tiles (100% free, no API key required)
  const osmTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter = selectedLocation
      ? [selectedLocation.lat, selectedLocation.lng]
      : center;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: zoom,
      zoomControl: false,
      attributionControl: false
    });

    // Standard OpenStreetMap Layer (no API key needed)
    const tileLayer = L.tileLayer(osmTileUrl, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Marker Layer Group
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Picker click handler
    if (mode === 'picker') {
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        if (onLocationSelect) {
          onLocationSelect({
            lat: parseFloat(lat.toFixed(5)),
            lng: parseFloat(lng.toFixed(5)),
            address: `Pin placed at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            neighborhood: 'Selected Vicinity'
          });
        }
      });
    }

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (map) {
        map.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Invalidate map size on theme toggle to ensure smooth redraw
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
    }
  }, [isDark]);

  // Update Markers in Explorer Mode
  useEffect(() => {
    if (mode !== 'explorer') return;
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    markersMapRef.current.clear();

    issues.forEach((issue) => {
      if (!issue.location?.lat || !issue.location?.lng) return;

      const isEmergency = issue.urgency === 'Emergency';
      const isHigh = issue.urgency === 'High';
      const isResolved = issue.status === 'Resolved';

      let bgGradient = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
      let shadowColor = 'rgba(37, 99, 235, 0.45)';
      let symbol = '•';

      if (isResolved) {
        bgGradient = 'linear-gradient(135deg, #10b981, #059669)';
        shadowColor = 'rgba(16, 185, 129, 0.45)';
        symbol = '✓';
      } else if (isEmergency) {
        bgGradient = 'linear-gradient(135deg, #ef4444, #dc2626)';
        shadowColor = 'rgba(239, 68, 68, 0.55)';
        symbol = '!';
      } else if (isHigh) {
        bgGradient = 'linear-gradient(135deg, #f97316, #ea580c)';
        shadowColor = 'rgba(249, 115, 22, 0.5)';
        symbol = '!';
      }

      const pulseEffect = isEmergency
        ? `<span style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(239, 68, 68, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>`
        : '';

      const iconHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
          ${pulseEffect}
          <div style="width: 28px; height: 28px; border-radius: 50%; background: ${bgGradient}; border: 2.5px solid ${isDark ? '#0f172a' : '#ffffff'}; box-shadow: 0 4px 10px ${shadowColor}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 13px; z-index: 2;">
            ${symbol}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'civic-marker-pin',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -16]
      });

      const marker = L.marker([issue.location.lat, issue.location.lng], {
        icon: customIcon
      });

      // Accessible Popup
      const popupDiv = document.createElement('div');
      popupDiv.style.minWidth = '230px';
      popupDiv.style.maxWidth = '270px';
      popupDiv.style.padding = '10px';
      popupDiv.style.fontFamily = 'Inter, -apple-system, sans-serif';

      const statusBg = isResolved
        ? '#ecfdf5'
        : isEmergency
        ? '#fef2f2'
        : '#f0f9ff';
      const statusColor = isResolved
        ? '#047857'
        : isEmergency
        ? '#b91c1c'
        : '#0369a1';

      popupDiv.innerHTML = `
        <div>
          ${
            issue.mediaUrl
              ? `<div style="width: 100%; height: 96px; margin-bottom: 8px; border-radius: 6px; overflow: hidden; background: #334155;">
                   <img src="${issue.mediaUrl}" alt="${issue.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80';" />
                 </div>`
              : ''
          }
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 4px;">
            <span style="font-family: monospace; font-size: 10px; font-weight: 700; color: ${isDark ? '#94a3b8' : '#64748b'};">
              ${issue.ticketId}
            </span>
            <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: ${statusBg}; color: ${statusColor};">
              ${issue.status}
            </span>
          </div>
          <div style="font-weight: 700; font-size: 13px; color: ${isDark ? '#f8fafc' : '#0f172a'}; line-height: 1.3; margin-bottom: 5px;">
            ${issue.title}
          </div>
          <div style="font-size: 11px; color: ${isDark ? '#94a3b8' : '#64748b'}; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;">
            <span>📍</span>
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${issue.location.address || issue.location.neighborhood}
            </span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; padding-top: 6px; border-top: 1px solid ${isDark ? '#334155' : '#e2e8f0'};">
            <span style="font-weight: 600; color: #3b82f6;">
              👍 ${issue.upvotes || 0} Upvotes
            </span>
            <span style="color: ${isDark ? '#94a3b8' : '#64748b'}; font-size: 10px;">
              ${issue.category}
            </span>
          </div>
          <button id="view-issue-${issue.id}" style="width: 100%; margin-top: 8px; background: #2563eb; color: #ffffff; border: none; border-radius: 6px; padding: 6px 0; font-size: 11px; font-weight: 600; cursor: pointer; transition: background 0.15s ease;">
            Inspect Full Ticket Details →
          </button>
        </div>
      `;

      popupDiv.querySelector(`#view-issue-${issue.id}`)?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onSelectIssue) onSelectIssue(issue);
      });

      marker.bindPopup(popupDiv, { maxWidth: 280 });
      markersGroup.addLayer(marker);
      markersMapRef.current.set(issue.id, marker);
    });
  }, [issues, mode, onSelectIssue, isDark]);

  // Handle External Marker Focus
  useEffect(() => {
    if (!activeMarkerId || mode !== 'explorer') return;
    const marker = markersMapRef.current.get(activeMarkerId);
    const map = mapInstanceRef.current;
    if (marker && map) {
      const latlng = marker.getLatLng();
      map.flyTo(latlng, 15, { duration: 0.8 });
      marker.openPopup();
    }
  }, [activeMarkerId, mode]);

  // Draggable Marker in Picker Mode
  useEffect(() => {
    if (mode !== 'picker') return;
    const map = mapInstanceRef.current;
    if (!map) return;

    const lat = selectedLocation?.lat || center[0];
    const lng = selectedLocation?.lng || center[1];

    if (!pickerMarkerRef.current) {
      const pinHtml = `
        <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #1d4ed8); border: 3px solid ${isDark ? '#0f172a' : '#ffffff'}; box-shadow: 0 4px 14px rgba(37,99,235,0.6); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; cursor: grab;">
          📍
        </div>
      `;

      const pickerIcon = L.divIcon({
        html: pinHtml,
        className: 'civic-picker-pin',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([lat, lng], {
        icon: pickerIcon,
        draggable: true
      }).addTo(map);

      marker.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        if (onLocationSelect) {
          onLocationSelect({
            lat: parseFloat(pos.lat.toFixed(5)),
            lng: parseFloat(pos.lng.toFixed(5)),
            address: `Pin placed at ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`,
            neighborhood: 'Selected Location'
          });
        }
      });

      pickerMarkerRef.current = marker;
    } else {
      pickerMarkerRef.current.setLatLng([lat, lng]);
      map.panTo([lat, lng]);
    }
  }, [selectedLocation, mode, center, onLocationSelect, isDark]);

  const handleCenterUserLocation = () => {
    if (!mapInstanceRef.current) return;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          mapInstanceRef.current.flyTo([latitude, longitude], 15);
          if (mode === 'picker' && onLocationSelect) {
            onLocationSelect({
              lat: parseFloat(latitude.toFixed(5)),
              lng: parseFloat(longitude.toFixed(5)),
              address: 'Auto-detected user GPS location',
              neighborhood: 'Current Vicinity'
            });
          }
        },
        () => {
          mapInstanceRef.current.flyTo([12.9716, 77.5946], 13);
        }
      );
    }
  };

  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(center, zoom);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[300px] overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 transition-colors">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px]" />

      {/* Floating Header Info */}
      <div className="absolute top-3 left-3 z-[400] flex flex-col gap-1.5 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/80 transition-colors">
          {mode === 'picker'
            ? 'Click or drag the marker to pinpoint the grievance'
            : `Showing ${issues.length} Civic Issues`}
        </div>

        {mode === 'explorer' && (
          <div className="pointer-events-auto hidden sm:flex items-center gap-2.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/80 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-xs shadow-red-500/50" />
              Emergency
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-xs shadow-orange-500/50" />
              High
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs shadow-blue-500/50" />
              Active
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
              Resolved
            </span>
          </div>
        )}
      </div>

      {/* Quick Map Controls */}
      <div className="absolute bottom-4 left-3 z-[400] flex items-center gap-2">
        <button
          onClick={handleCenterUserLocation}
          title="Detect and center to my location"
          className="bg-white/95 dark:bg-slate-800/95 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-1.5 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs font-medium transition-all"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>My GPS</span>
        </button>

        <button
          onClick={handleResetCenter}
          title="Reset map view to city center"
          className="bg-white/95 dark:bg-slate-800/95 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 px-2.5 py-1.5 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs font-medium transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span className="hidden sm:inline">Reset City View</span>
        </button>
      </div>
    </div>
  );
}

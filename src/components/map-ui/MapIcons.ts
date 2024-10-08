import L from 'leaflet';

export const blueIcon = L.divIcon({
  className: "custom-icon",
  html: '<i class="fas fa-map-marker-alt" style="color: #063599; font-size: 32px;"></i>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export const redIcon = L.divIcon({
  className: "custom-icon",
  html: '<i class="fas fa-map-marker-alt" style="color: #910d06; font-size: 32px;"></i>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export const starIcon = L.divIcon({
  className: "custom-icon",
  html: `<div style="position: relative; width: 32px; height: 32px;">
          <i class="fas fa-star" style="color: #FFD700; font-size: 16px; position: absolute; top: -10px; left: 10px;"></i>
          <i class="fas fa-map-marker-alt" style="color: #063599; font-size: 32px;"></i>
        </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

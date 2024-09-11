import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css'; 

export default function Maps() {
  return (
    <div>
      <MapContainer
        center={[-7.9697253, 112.611356]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "500px" }} 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[-7.9697253, 112.611356]}>
          <Popup>
            <h1 className="font-bold text-blue-600">Pyxis</h1>
          </Popup>
        </Marker>
        <Marker position={[-7.9847223,112.6101936]}>
          <Popup>
            <h1 className="font-bold text-blue-600">KOS</h1>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

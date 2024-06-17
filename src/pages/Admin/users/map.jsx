// MapChart.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent,CircleMarker, Circle, LayersControl, LayerGroup, Rectangle, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Loading from '../../../components/Loading/loading';
import marker from './marker-icon-2x.png';
import { FaMapMarkerAlt } from "react-icons/fa";
import { icon } from 'leaflet';
const MapChart = ({ data, loading }) => {
const ICON = icon({
  iconUrl: "/marker-icon-2x.png",
  iconSize: [18, 18],
})
    function SetViewOnClick() {
        const map = useMapEvent('click', (e) => {
          map.setView(e.latlng, map.getZoom(), {
            animate: true,
          })
        })
      
        return null
      }
      
  return (
    <>
    {
        loading ? <Loading/> :
    
    <MapContainer
      center={[22.9734, 78.6569]} // Set the initial center of the map
      zoom={4} // Set the initial zoom level
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LayersControl position="topright">
      <LayersControl.Overlay name="Marker with popup">
      {data && data.map((item) => (
    <Marker interactive   
    icon={ICON}
      key={item.ip}
      position={[item.latitude, item.longitude]}
    >
      <Popup>
        <div>
          <h6>{item.city}, {item.country}</h6>
          <span>Realtime users : {item.count}</span>
          {/* Add other information as needed */}
        </div>
      </Popup>
    </Marker>
  ))}
      </LayersControl.Overlay>
      <LayersControl.Overlay checked name="Layer group with circles">
      {data && data.map((item) => (
        <FeatureGroup>
    <Popup>
        <div>
          <h6>{item.city}, {item.country}</h6>
          <span>Realtime users : {item.count}</span>

          {/* Add other information as needed */}
        </div>
      </Popup>
      <Circle pathOptions={{ fillColor: 'blue' }} center={[item.latitude, item.longitude]}
      radius={100000}/></FeatureGroup>
      ))}
      </LayersControl.Overlay>
    </LayersControl>
      <SetViewOnClick />
    </MapContainer>
}
    </>
  );
};

export default MapChart;
// {data.map((item) => (
//     <Marker interactive 
//     icon={ICON}
//       key={item.ip}
//       position={[item.latitude, item.longitude]}
//     >
//       <Popup>
//         <div>
//           <h5>{item.city}, {item.country}</h5>
//           {/* Add other information as needed */}
//         </div>
//       </Popup>
//     </Marker>
//   ))}
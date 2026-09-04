import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { prospectivityZones } from '../data/synthetic'
import 'leaflet/dist/leaflet.css'
import './Exploration.css'

function getColor(score: number) {
  if (score > 80) return '#2ea043'
  if (score > 60) return '#d29922'
  return '#da3633'
}

export default function Exploration() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Exploration</h1>
        <p className="page-desc">Prospectivity scores from satellite spectral indicators</p>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={[21.7, 79.9]}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="OpenStreetMap"
          />
          {prospectivityZones.map(z => (
            <CircleMarker
              key={z.id}
              center={[z.lat, z.lng]}
              radius={14}
              pathOptions={{
                color: getColor(z.score),
                fillColor: getColor(z.score),
                fillOpacity: 0.5
              }}
            >
              <Popup>
                <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                  <strong>{z.id}</strong><br />
                  Score: {z.score}<br />
                  Confidence: {z.confidence}<br />
                  Action: {z.action}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Zone ID</th>
            <th>Mine ID</th>
            <th>Score</th>
            <th>Confidence</th>
            <th>NDVI</th>
            <th>Iron Index</th>
            <th>Recommended Action</th>
          </tr>
        </thead>
        <tbody>
          {prospectivityZones.map(z => (
            <tr key={z.id}>
              <td className="muted">{z.id}</td>
              <td>{z.mineId}</td>
              <td>
                <div className="score-cell">
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${z.score}%`,
                        background: getColor(z.score)
                      }}
                    />
                  </div>
                  <span>{z.score}</span>
                </div>
              </td>
              <td>
                <span className={`badge badge--${z.confidence.toLowerCase()}`}>
                  {z.confidence}
                </span>
              </td>
              <td>{z.ndvi}</td>
              <td>{z.ironIndex}</td>
              <td className="action-cell">{z.action}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="disclaimer">
        Prospectivity scores are exploration-prioritization estimates derived from
        satellite indicators. They do not constitute certified reserve figures and
        require field validation before operational use.
      </p>
    </div>
  )
}
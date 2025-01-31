"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
// import L from "leaflet"
import L from 'leaflet'
import "leaflet/dist/leaflet.css"

interface DeliveryMapProps {
  currentLocation: {
    lat: number
    lng: number
  }
  destination: {
    lat: number
    lng: number
  }
}

export function DeliveryMap({ currentLocation, destination }: DeliveryMapProps) {
  useEffect(() => {
    // Fix for the missing marker icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
    })
  }, [])

  const bounds = L.latLngBounds([
    [currentLocation.lat, currentLocation.lng],
    [destination.lat, destination.lng],
  ])

  return (
    <MapContainer bounds={bounds} zoom={13} className="h-[300px] w-full rounded-lg">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[currentLocation.lat, currentLocation.lng]}>
        <Popup>Current Location</Popup>
      </Marker>
      <Marker position={[destination.lat, destination.lng]}>
        <Popup>Destination</Popup>
      </Marker>
    </MapContainer>
  )
}


import { Ref, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Facilities, Query } from './interfaces';
import { MAPBOX_TOKEN } from './api';

const Map = ({query, vaFacilities}: {
  query: Query;
  vaFacilities: Facilities
}) => {
	const mapContainerRef: Ref<any> = useRef();
	const mapRef: any = useRef();

	useEffect(() => {
		mapboxgl.accessToken = MAPBOX_TOKEN;

		mapRef.current = new mapboxgl.Map({
			style: 'mapbox://styles/mapbox/dark-v11',
			container: mapContainerRef.current,
			center: [query.lng, query.lat],
			zoom: 8
		});

		if (!vaFacilities.data.length) return;

		const bounds = new mapboxgl.LngLatBounds();

		vaFacilities.data.forEach(({attributes}) => {
			bounds.extend([attributes.long, attributes.lat]);
			new mapboxgl.Marker()
				.setLngLat([attributes.long, attributes.lat])
				.addTo(mapRef.current);
		});

		mapRef.current.fitBounds(bounds, {padding: 100});
	});
	
	return (
		<div
			style={{ height: '100%', width: '100%' }}
			ref={mapContainerRef}
			className="map-container"
		/>
	);
};

export default Map;
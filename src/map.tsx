import { Ref, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Facilities, Facility, Query } from './interfaces';
import { MAPBOX_TOKEN } from './api';

const Map = ({query, vaFacilities, setFocusedFacility}: {
  query: Query;
  vaFacilities: Facilities,
  setFocusedFacility: (facility: Facility) => void
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

		vaFacilities?.data.forEach(({attributes}, index) => {
			bounds.extend([attributes.long, attributes.lat]);

			const elm = document.createElement('div');
			elm.className = 'va-location-marker';
			elm.textContent = `${++index}`;

			const marker = new mapboxgl.Marker(elm)
				.setLngLat([attributes.long, attributes.lat])
				.addTo(mapRef.current);
			
			// set focused facility to scroll in results
			marker.getElement().addEventListener('click', () => {
				const coords = marker.getLngLat();
				const focused = vaFacilities.data.find(({attributes}) => attributes.lat === coords.lat && attributes.long === coords.lng);
				if (!focused) return;
				setFocusedFacility(focused);
			})
		});

		mapRef.current.fitBounds(bounds, {padding: 100});
	}, [vaFacilities]);
	
	return (
		<div
			style={{ height: '100%', width: '100%' }}
			ref={mapContainerRef}
			className="map-container"
		/>
	);
};

export default Map;
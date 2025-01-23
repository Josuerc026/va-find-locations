import { useState } from 'react';
import { suggestions as mbSuggestions, retrieve } from '../../api';
import { HEALTH_SERVICES as healthServices } from '../../constants';
import { VaButton } from '@department-of-veterans-affairs/web-components/react-bindings';
import { VaSearchInput } from '@department-of-veterans-affairs/web-components/react-bindings';
import { VaSelect } from '@department-of-veterans-affairs/web-components/react-bindings';
import { Query } from '../../interfaces';

interface MapboxLocation {
	name: string;
	mapbox_id: string;
	place_formatted: string;
	context: {
		region: {
			name: string
		}
	}
}

export default function Search({query, setQuery}: {
	query: Query;
	setQuery: (query: Query) => void
}) {
	const radiusOptions = [25, 50, 75, 100];
	const [searchQuery, setSearchQuery] = useState({
		location: query?.name || '',
		serviceType: query?.serviceType || '',
		radius: query?.radius || radiusOptions[0]
	});
	const [suggestions, setSuggestions] = useState([]);
	const [locations, setLocations] = useState([] as MapboxLocation[]);
	
	const onUserInput = async (e: any) => {
		try {
			const response = await mbSuggestions().get(e.target.value);
			const data = await response.json();
			const list = data.suggestions.map((suggestion: any) => `${suggestion.name}, ${suggestion.context.region.name}`);
			setSuggestions(list);
			setLocations(data.suggestions);
		} catch(e: any) {
			throw new Error(e);
		}
	}
	const onUserSubmit = (e: any) => {
		setSearchQuery({
			...searchQuery,
			location: e.target.value
		});
	}
	const onUserSelect = (e: any) => {
		setSearchQuery({
			...searchQuery,
			serviceType: e.target.value
		})
	}
	const onUserRadiusSelect = (e: any) => {
		setSearchQuery({
			...searchQuery,
			radius: e.target.value
		})
	}
	const onSearch = async () => {
		const {location, serviceType, radius} = searchQuery;
		if (location === query?.name || (!location || !locations.length)) {
			return alert('Search for a new location or try again.');
		}
		const locationInfo = locations.find(location => 
			`${location.name}, ${location.context.region.name}`.toLowerCase() === searchQuery.location
		);
		if (!locationInfo?.mapbox_id) return;
		try {
			const response = await retrieve(locationInfo.mapbox_id).get();
			const {features} = await response.json();
			if (!features.length) return; 
			const {latitude: lat, longitude: lng} = features[0].properties.coordinates;
			setQuery({
				name: location,
				lat,
				lng,
				serviceType: serviceType,
				radius: radius,
				page: 1
			});
		} catch(err: any) {
			throw new Error(err);
		}
	}
	return (
	<>
		<VaSearchInput
			buttonText="Search"
			onInput={onUserInput}
			onSubmit={onUserSubmit}
			suggestions={suggestions}
			value={searchQuery.location}
		/>
		<VaSelect
			label="Facility Type"
			name="facility-type"
			value="VAHealth"
		>
			<option value="VAHealth">VA Health</option>
		</VaSelect>
		<VaSelect
			label="Radius"
			name="Radius"
			onVaSelect={onUserRadiusSelect}
			value={searchQuery.radius.toString()}
		>
		{
			radiusOptions.map(radiusOption => 
				<option key={radiusOption} value={radiusOption}>{radiusOption} miles</option>
			)
		}
		</VaSelect>
		<VaSelect
			label="Service Type"
			message-aria-describedby="Optional description text for screen readers"
			name="service-types"
			onVaSelect={onUserSelect}
			value={searchQuery.serviceType}
			showError={true}
		>
			{
				Object.keys(healthServices).map((serviceKey) => 
					<option key={serviceKey} value={serviceKey}>{healthServices[serviceKey]}</option>
				)
			}
		</VaSelect>
		<br/>
		<VaButton
			submit="prevent"
			onClick={onSearch}
			text="Search Facilities"
		/>
	</>
	)
}
import { useState } from 'react';
import { suggestions as mbSuggestions, retrieve } from '../api';
import { HEALTH_SERVICES as healthServices } from '../constants';
import { VaButton } from '@department-of-veterans-affairs/web-components/react-bindings';
import { VaSearchInput } from '@department-of-veterans-affairs/web-components/react-bindings';
import { VaSelect } from '@department-of-veterans-affairs/web-components/react-bindings';
import { Query } from '../interfaces';

export default function Search({setQuery}: {
  setQuery: (query: Query) => void
}) {
	const radiusOptions = [25, 50, 75, 100];
	const [suggestions, setSuggestions] = useState([]);
	const [locations, setLocations] = useState([] as {
		name: string;
		mapbox_id: string;
		place_formatted: string;
	}[]);
	const [userInput, setUserInput] = useState('');
	const [selectedServiceType, setServiceType] = useState('PrimaryCare');
	const [selectedRadius, setRadius] = useState(25);
	
	const onUserInput = async (e: any) => {
		const response = await mbSuggestions().get(e.target.value);
		const data = await response.json();
		const list = data.suggestions.map((suggestion: any) => `${suggestion.name}, ${suggestion.place_formatted}`);
		setSuggestions(list);
		setLocations(data.suggestions);
	}
	const onUserSubmit = (e: any) => {
		const inputValue = e.target.value;
		setUserInput(inputValue);
	}
	const onUserSelect = (e: any) => {
		setServiceType(e.target.value);
	}
	const onUserRadiusSelect = (e: any) => {
		setRadius(e.target.value);
	}
	const onSearch = async () => {
		try {
			const locationInfo = locations.find(location => 
				`${location.name}, ${location.place_formatted}`.toLowerCase() === userInput
			);
			if (!locationInfo?.mapbox_id) return;
			const response = await retrieve(locationInfo.mapbox_id).get();
			const {features} = await response.json();
			if (!features.length) return; 
			const {latitude: lat, longitude: lng} = features[0].properties.coordinates;
			setQuery({
				lat,
				lng,
				serviceType: selectedServiceType,
				radius: selectedRadius,
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
			value={userInput}
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
			value={selectedRadius.toString()}
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
			value={selectedServiceType}
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
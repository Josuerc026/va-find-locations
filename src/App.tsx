import Map from './map';
import './App.css'
import Search from './search/search';
import Results from './search/results';
import { useEffect, useState } from 'react';
import { getAllQueryParams, getQueryParam, setQueryParams } from './utils';
import { VaHeaderMinimal } from '@department-of-veterans-affairs/web-components/react-bindings';
import { Facilities, Query } from './interfaces';
import { facilities as facilitiesApi } from './api';

// init in Washington DC
const init: Query = {
	lat: 38.90787209138959,
	lng: -77.0361947316423,
	serviceType: 'All',
	radius: 50,
	page: 1
}

function App() {
	// assuming all query params are valid
	const [query, setQuery] = useState({
		...init,
		...getAllQueryParams(window.location.search),
	});
	const [facilities, setFacilities] = useState({
		data: [],
		meta: null,
		loading: true,
		error: false
	} as Facilities);

	const setGlobalQuery = (query: Query) => {
		setQueryParams(query);
		setQuery(query);
	}

	const setVaFacilities = (vaFacilities: Facilities) => {
		setFacilities(vaFacilities);
	}

	useEffect(() => {
		setVaFacilities({
			...facilities,
			loading: true,
		});
		const getFacilities = async () => {
			try {
				const response = await facilitiesApi(query).get();
				if (response.status === 200 && response.ok === true) {
					const vaData = await response.json();
					if (vaData?.data && vaData?.meta) {
						setVaFacilities({
							...vaData,
							loading: false,
							error: false
						});
					}
				} else {
					throw await response.json();
				}
			} catch(err: any) {
				setVaFacilities({
					data: [],
					meta: null,
					loading: false,
					error: true
				});
				if (!!err?.errors.length) {
					throw new Error(`${err?.errors[0].title}, ${err?.errors[0].detail}`);
				} else {
					throw new Error(err);
				}
			}
		}
		getFacilities();
	}, [query]);

	useEffect(() => {
		setQueryParams({
			...init,
			...getAllQueryParams(window.location.search),
		})
	}, []);

	return (
		<>
		<header className="header" style={{minHeight: 'auto'}}>
			<VaHeaderMinimal
				header="Find VA Locations"
				subheader="near you"
			/>
		</header>
		<div className="container-fluid w-100 m-0 p-0 flex-fill d-flex flex-column">
			<div className="row g-0 w-100 mw-100 flex-fill" style={{maxWidth: '100%'}}>
				<div className="col-12 col-md-3 col-lg-3 col-xl-2" style={{background: '#efefef'}}>
					<div className="p-3">
					<h1 className="mt-3" style={{fontSize: '1.75rem'}}>Find a VA location near you</h1>
					<p>Find a VA location or in-network community care provider.</p>
					<Search
						setQuery={setGlobalQuery}
					/>
					</div>
				</div>
				<div className="col-12 col-md-3 col-xl-4" style={{borderLeft: '1px solid #000'}}>
					<Results
						vaFacilities={facilities}
						setQuery={setGlobalQuery}
					/>
				</div>
				<div className="col-12 col-md-6">
					<Map
						query={query}
						vaFacilities={facilities}
					/>
				</div>
			</div>
		</div>
		</>
	)
}

export default App

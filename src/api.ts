
import { MB_SESSION_TOKEN_KEY } from "./constants";
import { Query } from "./interfaces";
import { generateSessionId } from "./utils";

export const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9zdWVyYzAyNiIsImEiOiJjbTU5MHRvMzEwaWZmMmlvZGRtOGoyMmdzIn0.WkXRbBmq2QpDXpu-7E54-w';

const facilities = ({lat, lng, radius, serviceType, page}: Query) => {
	return {
		async get() {
			return await fetch(`/.netlify/functions/getFacilities?lat=${lat}&lng=${lng}&serviceType=${serviceType}&radius=${radius}&page=${page}`);
		}
	}
}

const retrieve = (mapId: string) => {
	const sessionToken = localStorage.getItem(MB_SESSION_TOKEN_KEY) ?? generateSessionId();
	return {
		async get() {
			return await fetch(`https://api.mapbox.com/search/searchbox/v1/retrieve/${mapId}?access_token=${MAPBOX_TOKEN}&session_token=${sessionToken}`);
		}
	}
}

const suggestions = () => {
	const sessionToken = localStorage.getItem(MB_SESSION_TOKEN_KEY) ?? generateSessionId();
	return {
		async get(query: string) {
			return await fetch(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}&language=en&access_token=${MAPBOX_TOKEN}&session_token=${sessionToken}&types=city&country=US`);
		}
	}
}

export {suggestions, facilities, retrieve}
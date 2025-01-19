import { configDotenv } from 'dotenv';

configDotenv();

export const handler = async (event, context) => {
    const {lat, lng, serviceType, radius, page} = event.queryStringParameters;
	try {
        const res = await fetch(`https://sandbox-api.va.gov/services/va_facilities/v1/facilities?lat=${lat}&long=${lng}&type=health&services=[${serviceType}]&radius=${radius}&page=${page}`, {
            headers: {
                apiKey: process.env.DEPTVA_TOKEN
            }
        });
        if (res.status !== 200) {
            throw res;
        }
        const data = await res.json();
            return {
                statusCode: 200,
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                }
            }
    } catch(error) {
        const errors = await error.json();
        return {
            statusCode: error.status,
            body: JSON.stringify({...errors}),
            headers: {
                "Content-Type": "application/json",
            }
        }
    }
}
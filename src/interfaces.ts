export interface Query {
    name: string;
    lat: number;
    lng: number;
    serviceType: string;
    radius: number;
    page: number;
}

export interface Facility {
    attributes: {
        lat: number;
        long: number;
        phone: {
            main: string;
        }
        address: {
            physical: {
                city: string;
                state: string;
                zip: string;
            }
        }
    }
}

export interface Facilities {
    data: Facility[] | [];
    meta: {
        pagination: {
            [key: string]: number;
        }
    } | null;
    loading: boolean;
    error: boolean;
}
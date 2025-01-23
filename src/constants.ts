export const HEALTH_SERVICES: {
    [key: string]: string;
} = {
    All: 'All VA health services',
    PrimaryCare: 'Primary care',
    MentalHealth: 'Mental health care',
    Covid19Vaccine: 'COVID-19 vaccines',
    Dental: 'Dental services',
    UrgentCare: 'Urgent care',
    EmergencyCare: 'Emergency care',
    Audiology: 'Audiology',
    Cardiology: 'Cardiology',
    Dermatology: 'Dermatology',
    Gastroenterology: 'Gastroenterology',
    Gynecology: 'Gynecology',
    Ophthalmology: 'Ophthalmology',
    Optometry: 'Optometry',
    Orthopedics: 'Orthopedics',
    Urology: 'Urology',
    WomensHealth: "Women's health",
    Podiatry: 'Podiatry',
    Nutrition: 'Nutrition',
    CaregiverSupport: 'Caregiver support',
};

// for local storage
export const MB_SESSION_TOKEN_KEY = 'mapboxSessionToken';
export const MB_STYLE = 'mapbox://styles/mapbox/dark-v11';
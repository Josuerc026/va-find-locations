import { VaPagination } from '@department-of-veterans-affairs/web-components/react-bindings';
import { getAllQueryParams } from "../utils";
import { VaCard } from "@department-of-veterans-affairs/web-components/react-bindings";
import { Facilities, Facility, Query } from "../interfaces";
import { VaLoadingIndicator } from '@department-of-veterans-affairs/web-components/react-bindings';
import { VaButton } from '@department-of-veterans-affairs/web-components/react-bindings';
import { Ref, useEffect, useRef } from 'react';

export default function Results({vaFacilities, setQuery, query, focusedFacility}: {
    vaFacilities: Facilities,
    setQuery: (query: Query) => void,
    query: Query,
    focusedFacility: Facility
}) {
    const resultRef = useRef(null as Ref<HTMLDivElement>);
    const handlePageSelect = (e: any) => {
        const {name, lat, lng, serviceType, radius} = getAllQueryParams(window.location.search);
        setQuery({
            name,
            lat,
            lng,
            serviceType,
            radius,
            page: e.detail.page
        });
    }

    const onRetry = () => {
        const {name, lat, lng, serviceType, radius, page} = getAllQueryParams(window.location.search);
        setQuery({
            name,
            lat,
            lng,
            serviceType,
            radius,
            page
        });
    }

    const scrollToResult = () => {
        if (resultRef && resultRef.current) {
            resultRef.current.scrollIntoView(true, {behavior: 'smooth'});
        }
    }

    useEffect(() => {
        scrollToResult();
    }, [focusedFacility])

    return (
        <div className="p-3 results-wrapper d-flex flex-column">
            <div className="row py-2">
                <div className="col-md-8">
                    {
                        vaFacilities?.data?.length && vaFacilities?.meta?.pagination ? 
                            (
                                <h3 className="m-0 p-0">
                                    Showing {vaFacilities?.meta?.pagination.perPage * (vaFacilities.meta.pagination.currentPage - 1)+1} - 
                                    {(vaFacilities?.meta?.pagination.perPage * vaFacilities.meta.pagination.currentPage) - vaFacilities?.meta?.pagination.perPage * vaFacilities.meta.pagination.currentPage % vaFacilities?.meta?.pagination.totalEntries % vaFacilities.meta.pagination.perPage} of {vaFacilities?.meta?.pagination.totalEntries} Results
                                </h3>
                            ) : ''
                    }
                </div>
                <div className="col-md-4 text-end">
                    {/* TODO: Nav? */}
                </div>
            </div>

            <div className={`results-container h-100 overflow-y-scroll flex-fill p-3 ${vaFacilities.loading || !vaFacilities?.data.length ? `d-flex flex-column justify-content-center` : ``}`}>
                {
                    vaFacilities.loading && !vaFacilities.error ? 
                        <VaLoadingIndicator
                            label="Loading"
                            message="Loading facilities..."
                        /> :
                        <div className="row gx-2">
                            {!!vaFacilities?.data?.length ? (
                                vaFacilities.data.map((facility: any, index: number) => {
                                    return (
                                        <div 
                                            ref={(el) => facility.id === focusedFacility.id && (resultRef.current = el)} 
                                            key={facility.id}
                                            id={facility.id === focusedFacility.id ? 'focused-facility' : ''} 
                                            className="col-12 col-xl-6">
                                                <div className="py-1 h-100">
                                                    <VaCard class="p-3 h-100">
                                                        <div className="p-0">
                                                            <img 
                                                                className="va-card__img"
                                                                src={`https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/3_2_medium_thumbnail/public/2021-08/${facility.attributes.name}.jpg`}
                                                                onError={({currentTarget}) => {
                                                                    currentTarget.onerror = null;
                                                                    currentTarget.src = 'https://www.va.gov/HOMELESS/images/VA-seal-500x275.jpg';
                                                                }}
                                                            />
                                                            <span className="facility-idx"><strong>{++index}</strong></span>
                                                            <h3 className="mt-3 text-white"><a href={facility.attributes.website} target="_blank">{facility.attributes.name}</a></h3>
                                                            <p>
                                                                {[
                                                                    facility.attributes.address.physical.city,
                                                                    facility.attributes.address.physical.state,
                                                                    facility.attributes.address.physical.zip
                                                                ].join(', ')} 
                                                            </p>
                                                            <a className="text-white" href={`tel:${facility.attributes.phone.main}`}>{facility.attributes.phone.main}</a>
                                                        </div>
                                                    </VaCard>
                                                </div>
                                        </div>
                                    )
                                })
                            ) : 
                                <>
                                    <h3>No results found for <u style={{textTransform: 'capitalize'}}>{query?.name}</u></h3>
                                    <p>Try searching for VA locations in another location.</p>
                                </>
                            }
                        </div>
                }
                {vaFacilities.error && !vaFacilities?.data?.length ? 
                    (
                        <>
                            <p>There was an issue with the network request. Please try again.</p>
                            <VaButton
                                submit="prevent"
                                onClick={onRetry}
                                text="Retry Search"
                            />
                        </>
                    )
                    : ''
                }
            </div>
            { vaFacilities?.data?.length && vaFacilities?.meta?.pagination? 
                <VaPagination
                    page={vaFacilities.meta.pagination.currentPage}
                    pages={vaFacilities.meta.pagination.totalPages}
                    max-page-list-length={vaFacilities.meta.pagination.perPage}
                    onPageSelect={handlePageSelect}
                /> : []
            }
        </div>
    )
}

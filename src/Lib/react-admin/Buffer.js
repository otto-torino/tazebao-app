import React, { useState, useEffect } from 'react';
import { backgroundRequest } from '../../Services/Request';
import PropTypes from 'prop-types';

import { from } from 'rxjs';
import { expand, reduce, scan, delay } from 'rxjs/operators';
import { EMPTY } from 'rxjs/index';


function useObservable(observable, init) {

    const [state, setState] = useState(init);

    useEffect(() => {
        const subscription = observable.subscribe(setState);
        return () => subscription.unsubscribe();
    }, []);

    return state;
}


function useBuffer(request, requestInit, bufferInit) {

    const bufferObservable = from(request(requestInit)).pipe(
        expand(result => result.next ? request(result.next) : EMPTY),
        scan((buffer, result) => [...buffer, ...result.data], [])
    );

    return useObservable(bufferObservable, bufferInit);
}


const djangoSauceRequest = () => {

    const endpoint = 'subscribers';
    const pageSize = 1000;

    return function(page) {
        return backgroundRequest(endpoint, [page, pageSize])
            .then(response => {
                const data = response.data.results;
                let next = response.data.next;
                if(next !== null) {
                    next = new URL(next);
                    next = next.searchParams.get("page");
                }
                return {data, next};
            });
    }
}


const Buffer = () => {

    const request = djangoSauceRequest();
    const buffer = useBuffer(request, 1, []);

    return <div>{buffer.length}</div>;
}


export default Buffer;
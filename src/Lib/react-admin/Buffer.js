import React, { useState, useEffect } from 'react';
import { backgroundRequest } from '../../Services/Request';
import { from, interval } from 'rxjs';
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


function useBuffer(request, requestInit, bufferInit, delayTime=1000) {

    const requestObservable = source => from(request(source)).pipe(delay(delayTime));

    const bufferObservable = requestObservable(requestInit).pipe(
        expand(result => result.next ? requestObservable(result.next) : EMPTY),
        reduce((buffer, result) => [...buffer, ...result.data], [])
    );

    return useObservable(bufferObservable, bufferInit);
}


const djangoSauceRequest = () => {

    const endpoint = 'subscribers';
    const pageSize = 50000;

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
    const buffer = useBuffer(request, 1, [], 1000);

    console.log('test');

    return <div></div>;
}


export default Buffer;
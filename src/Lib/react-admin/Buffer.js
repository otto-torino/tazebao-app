import React, { useState, useEffect } from 'react';
import { backgroundRequest } from '../../Services/Request';
import { expand, reduce, delay } from 'rxjs/operators';
import { defer, EMPTY } from 'rxjs/index';


function pagination(request, endpoint, init, update, delayTime=0) {

    const lazyRequest$ = page => defer(() => request(page)).pipe(delay(delayTime));

    return lazyRequest$(endpoint).pipe(
        expand(result => result.next ? lazyRequest$(result.next) : EMPTY),
        reduce((data, result) => update(data, result.data), init)
    );
}


function useObservable(observable, init) {

    const [state, setState] = useState(init);

    useEffect(() => {
        const subscription = observable.subscribe(setState);
        return () => subscription.unsubscribe();
    }, []);

    return state;
}


function useBuffer(request, endpoint, init, update, delayTime=0) {

    const page$ = pagination(request, endpoint, init, update, delayTime);
    return useObservable(page$, init);
}


const djangoSauceRequest = () => {

    const endpoint = 'subscribers';
    const pageSize = 100;

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
    const buffer = useBuffer(request, 1, [], (oldData, newData) => [...oldData, ...newData], 1000);

    return <div></div>;
}


export default Buffer;
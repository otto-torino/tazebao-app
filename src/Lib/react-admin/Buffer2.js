import React, { useState, useEffect } from 'react';
import { expand, reduce, delay } from 'rxjs/operators';
import { defer, EMPTY } from 'rxjs/index';


export function pagination(request, start, init, update, delayTime=0) {

    const lazyRequest = page => defer(() => request(page)).pipe(delay(delayTime));

    return lazyRequest(start).pipe(
        expand(result => result.next ? lazyRequest(result.next) : EMPTY),
        reduce((data, result) => update(data, result.data), init)
    );
}


export function useObservable(observable, init) {

    const [state, setState] = useState(init);

    useEffect(() => {
        const subscription = observable.subscribe(setState);
        return () => subscription.unsubscribe();
    }, []);

    return state;
}


export function useBuffer(request, start, init, update, delayTime=0) {

    const page$ = pagination(request, start, init, update, delayTime);
    return useObservable(page$, init);
}
import React, { useState, useEffect } from 'react';
import { backgroundRequest } from '../../Services/Request';
import { useBuffer as useBuffer2 } from './Buffer2';


function djangoSaucePageRequest(endpoint, pageSize) {

    return async function(next) {
        const response = await backgroundRequest(endpoint, [next, pageSize]);
        const data = response.data.results;
        next = response.data.next;
        next = next ? (new URL(next)).searchParams.get("page") : null;
        return {data, next};
    }
}


function useBuffer(request, start, init, update, delayTime=0) {

    const [buffer, setBuffer] = useState(init);
    const [next, setNext] = useState(start);

    useEffect(() => {
        if(next !== null) {
            request(next).then(result => {
                setBuffer(update(buffer, result.data));
                setNext(result.next); 
            });
        }
    }, [next]);

    return buffer;
}


const Buffer = () => {

    const request = djangoSaucePageRequest('subscribers', 10000);
    const update = (oldData, newData) => [...oldData, ...newData];
    const buffer = useBuffer2(request, 1, [], update, 1000);

    return <div></div>;
}


export default Buffer;
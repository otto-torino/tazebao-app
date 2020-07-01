import React, { useState, useEffect } from 'react';
import { backgroundRequest } from '../../Services/Request';
import PropTypes from 'prop-types';


const djangoSauceRequest = () => {

    const endpoint = 'subscribers';
    const pageSize = 10000;

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


const useBuffer = (request, init) => {

    const [buffer, setBuffer] = useState([]);
    const [next, setNext] = useState(init);

    // useEffect(() => {
    //     if(next !== null) {
    //         request(next).then(result => {
    //             setBuffer([...buffer, ...result.data]);
    //             setNext(result.next); 
    //         });
    //     }
    // }, [next]);

    return buffer;
}


const request = djangoSauceRequest();

const Buffer = () => {

    const buffer = useBuffer(request, 1);

    // const list = buffer.map(e => <li> { e.toString() } </li>);

    console.log(buffer);

    return <div><ul></ul></div>;
}


export default Buffer;
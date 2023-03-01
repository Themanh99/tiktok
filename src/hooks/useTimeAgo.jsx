import React from 'react';
import ReactTimeAgo from 'react-time-ago';

function useTimeAgo(date) {
    const time = new Date(date);
    const currentTime = new Date();

    const difTimeDay = (currentTime - time) / 86400000;
    const renderTimeAgo = <ReactTimeAgo date={time} locale="vi" timeStyle={difTimeDay > 7 ? 'twitter' : 'round'} />;

    return renderTimeAgo;
}

export default useTimeAgo;

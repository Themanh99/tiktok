import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import classNames from 'classnames/bind';
import styles from './WrapperVideos.module.scss';
import VideoItem from './VideoItem/VideoItem';

const cx = classNames.bind(styles);

function WrapperVideos(data) {

    const getVideos = () => {

    }
    return (
        <div className={cx('wrapperVideos')}>
            <InfiniteScroll className={cx('wrapperrr')} pageStart={0} hasMore={true || false} loadMore={getVideos}>
                <div className={cx('wrapper-container')}>
                    {data.map((video, index) => (
                        <VideoItem key={video.id} data={video} indexVideo={index} />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
}

export default WrapperVideos;
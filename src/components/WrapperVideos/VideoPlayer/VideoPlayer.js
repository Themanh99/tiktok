import React from 'react';
import styles from './VideoPlayer.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function VideoPlayer(props) {
    return (
        <div className={cx('wrapper')} >
            video player
        </div >
    );
}

export default VideoPlayer;
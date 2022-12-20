import React from 'react';
import classNames from 'classnames/bind';
import styles from '../AccountItem/Account.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles)

function AccountItem() {
    return (
        <div className={cx('wrapper')}>
            <img src="https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/be22b8593ea95c8835d47f4b5309ec16~c5_100x100.jpeg?x-expires=1671469200&x-signature=h3xKNqkCQJjuUTj%2B9rE%2Fr59zJGw%3D" alt='Manh' className={cx('avatar')} />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>Chu The Manh</span>
                    <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
                </h4>
                <span className={cx('username')}>manh yeu loan</span>
            </div>
        </div>
    );
}

export default AccountItem;
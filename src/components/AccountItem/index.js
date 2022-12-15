import React from 'react';
import classNames from 'classnames/bind';
import styles from '../AccountItem/Account.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles)

function AccountItem(props) {
    return (
        <div className={cx('wrapper')}>
            <img src="https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/7c520f5b1b7d0e446aa982353e422894~c5_100x100.jpeg?x-expires=1671292800&x-signature=%2FDUIVfF7EI6IWWoEI3irB3kzRqQ%3D" alt='Manh' className={cx('avatar')} />
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
import React from 'react';
import Button from '../../Button';
import styles from '../Menu/Menu.module.scss'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles)

function Menuitem({ data, onClick }) {
    const classes = cx('menu-item', {
        separate: data.separate,
    });
    return <Button
        onClick={onClick}
        className={classes}
        leftIcon={data.icon}
        rightIcon={(data.title === 'Dark mode' ? <FontAwesomeIcon icon={faToggleOff} /> : '')}
        to={data.to}
    >
        {data.title}
    </Button>
}

export default Menuitem;
import Tippy from '@tippyjs/react/headless';
import React, { useState } from 'react';
import styles from '../Menu/Menu.module.scss'
import classNames from 'classnames/bind'
import { Wrapper as PopperWrapper } from '..'
import MenuItem from './MenuItem'
import Header from './Header';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles)
const defaultFn = () => { };

function Menu({ children, items = [], hideOnClick = false, onChange = defaultFn }) {

    const [history, setHistory] = useState([{ data: items }]);
    const current = history[history.length - 1]

    const renderItems = () => {
        return current.data.map((item, index) => {
            const isParent = !!item.children;
            return <MenuItem
                key={index}
                data={item}
                onClick={() => {
                    if (isParent) {
                        setHistory(prev => [...prev, item.children])
                    } else {
                        onChange(item)
                    }
                }} />

        })
    }

    const renderResult = (attrs) => (
        <div className={cx('menu-lists')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('menu-popper')}>
                {history.length > 1 && <Header title={current.title} onBack={() => {
                    setHistory((prev) => prev.slice(0, prev.length - 1));
                }} />}
                <div className={cx('menu-body')}>{renderItems()}</div>
            </PopperWrapper>
        </div>
    );

    const handleResetToFirstMenu = () => {
        setHistory((prev) => prev.slice(0, 1));
    }

    return (
        <Tippy
            delay={[0, 600]}
            offset={[12, 8]}
            interactive
            hideOnClick={hideOnClick}
            placement='bottom-end'
            render={renderResult}
            onHide={handleResetToFirstMenu}
        >
            {children}
        </Tippy>
    );
}
Menu.propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array,
    hideOnClick: PropTypes.bool,
    onChange: PropTypes.func,
}
export default Menu;
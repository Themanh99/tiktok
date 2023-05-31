import Tippy from '@tippyjs/react/headless';
import React, { useEffect, useState } from 'react';
import styles from '../Menu/Menu.module.scss'
import classNames from 'classnames/bind'
import { Wrapper as PopperWrapper } from '..'
import MenuItem from './MenuItem'
import Header from './Header';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../../services/authServices';

const cx = classNames.bind(styles)
const defaultFn = () => { };

function Menu({ children, items = [], hideOnClick = false, onChange = defaultFn }) {

    const [history, setHistory] = useState([{ data: items }]);
    const current = history[history.length - 1]
    const currentUser = useSelector((state) => state.auth.login.currentUser);
    const id = currentUser?.data.id;
    const token = currentUser?.meta.token;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const handleLogOut = () => {
            logOut(dispatch, navigate);
        };
        handleLogOut();
    }, [dispatch, navigate]);

    const renderItems = () => {
        return current.data.map((item, index) => {
            const isParent = !!item.children;
            return (
                <MenuItem
                    key={index}
                    data={item}
                    onClick={() => {
                        if (isParent) {
                            setHistory(prev => [...prev, item.children])
                        }
                        else {
                            onChange(item)
                        }
                    }}
                />
            )
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
            arrow={true}
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
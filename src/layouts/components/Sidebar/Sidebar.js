import React from 'react';
import classNames from 'classnames/bind';
import styles from '../Sidebar/Sidebar.module.scss'
import config from '../../../config';
import MenuItem from './Menu/MenuItem';
import Menu from './Menu/Menu';
import { HomeIcon, UserGrpIcon, LiveIcon } from '../../../components/Icons/Icons';

const cx = classNames.bind(styles);

function Sidebar() {
    return (
        <aside className={cx('wrapper')}>
            <Menu>
                <MenuItem title="For you" icon={<HomeIcon />} to={config.routes.home} />
                <MenuItem title="Following" icon={<UserGrpIcon />} to={config.routes.following} />
                <MenuItem title="LIVE" icon={<LiveIcon />} to={config.routes.live} />
            </Menu>
        </aside>
    );
}

export default Sidebar;
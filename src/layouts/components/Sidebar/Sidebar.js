import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '../Sidebar/Sidebar.module.scss'
import config from '../../../config';
import MenuItem from './Menu/MenuItem';
import Menu from './Menu/Menu';
import SuggestedAccounts from '../../../components/SuggestedAccounts/SuggestedAccounts';
import { HomeIcon, UserGrpIcon, LiveIcon } from '../../../components/Icons/Icons';
import * as userServices from '../../../services/userServices'

const cx = classNames.bind(styles);

function Sidebar() {
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    useEffect(() => {
        userServices.getSuggested({ page: 1, perPage: 5 })
            .then((data) => {
                setSuggestedUsers((prevUsers) => [...prevUsers, ...data]);
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <aside className={cx('wrapper')}>
            <Menu>
                <MenuItem title="For you" icon={<HomeIcon />} to={config.routes.home} />
                <MenuItem title="Following" icon={<UserGrpIcon />} to={config.routes.following} />
                <MenuItem title="LIVE" icon={<LiveIcon />} to={config.routes.live} />
            </Menu>

            <SuggestedAccounts
                label="Suggested accounts"
                data={suggestedUsers} />
            <SuggestedAccounts label="Following accounts" />
        </aside>
    );
}

export default Sidebar;
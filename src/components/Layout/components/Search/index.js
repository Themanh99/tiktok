import React, { useEffect, useState, useRef } from 'react';
import {
    faCircleXmark,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import HeadlessTippy from '@tippyjs/react/headless';
import styles from '../Search/Search.module.scss';
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Wrapper as PopperWrapper } from '../../../Popper';
import { SearchIcon } from '../../../Icons';
import AccountItem from '../../../AccountItem'

const cx = classNames.bind(styles)

function Search(props) {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [loading, setLoading] = useState(false);

    const inputRef = useRef();

    const handleHideResult = () => {
        setShowResult(false);
    }
    useEffect(() => {

        if (!searchValue.trim()) {
            // xu ly k cho nhap dau cach dau tien
            setSearchResult([]);
            return;
        }
        setLoading(true);
        fetch(`https://tiktok.fullstack.edu.vn/api/users/search?q=${encodeURIComponent(searchValue)}&type=less`)
            .then(res => res.json())
            .then(res => {
                setSearchResult(res.data);
                setLoading(false);
            }).finally(() => {
                setLoading(false);
            })
    }, [searchValue])


    return (
        <HeadlessTippy
            visible={showResult && searchResult.length > 0}
            interactive
            onClickOutside={handleHideResult}
            render={attrs => (
                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                    <PopperWrapper>
                        <h4 className={cx('search-title')}>Accounts</h4>
                        {searchResult.map((result) => (
                            <AccountItem key={result.id} data={result} />
                        ))}
                    </PopperWrapper>
                </div>
            )}>
            <div className={cx('search')} >
                <input
                    ref={inputRef}
                    placeholder="Search accounts and videos "
                    spellCheck={false}
                    onChange={(e) => setSearchValue(e.target.value)}
                    value={searchValue}
                    onFocus={() => setShowResult(true)}
                />
                {!!searchValue && !loading && (
                    <button className={cx('clear')} onClick={() => {
                        setSearchValue('');
                        setSearchResult([]);
                        inputRef.current.focus();
                    }}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                )}
                {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
                <button className={cx('search-btn')}>
                    <SearchIcon />
                </button>
            </div>
        </HeadlessTippy>
    );
}

export default Search;
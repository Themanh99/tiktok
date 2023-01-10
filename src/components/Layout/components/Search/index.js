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
import { useDebounce } from '../../../../hooks/index'
import * as searchServices from '../../../../apiServices/searchServices'


const cx = classNames.bind(styles)

function Search(props) {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [loading, setLoading] = useState(false);

    const debounced = useDebounce(searchValue, 800);

    const inputRef = useRef();

    const handleHideResult = () => {
        setShowResult(false);
    }

    useEffect(() => {

        if (!debounced.trim()) {
            // xu ly k cho nhap dau cach dau tien
            setSearchResult([]);
            return;
        }
        const fetchApi = async () => {
            setLoading(true);

            const result = await searchServices.search(debounced);
            setSearchResult(result);

            setLoading(false);
        }
        fetchApi();
    }, [debounced])

    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    }

    return (
        // fix warning tippy add div tag
        <div>
            <HeadlessTippy
                visible={showResult && searchResult.length > 0}
                interactive
                onClickOutside={handleHideResult}
                render={attrs => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search-title')}>Accounts</h4>
                            {searchResult.map((result, i) => (
                                i < 5 ? <AccountItem key={result.id} data={result} /> : null
                            ))}
                        </PopperWrapper>
                    </div>
                )}>
                <div className={cx('search')} >
                    <input
                        ref={inputRef}
                        placeholder="Search accounts and videos "
                        spellCheck={false}
                        onChange={handleChange}
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
                    <button className={cx('search-btn')} onMouseDown={e => e.preventDefault()}>
                        <SearchIcon />
                    </button>
                </div>
            </HeadlessTippy>
        </div>
    );
}
export default Search;
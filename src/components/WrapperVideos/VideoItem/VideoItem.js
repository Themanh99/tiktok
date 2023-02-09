import styles from './VideoItem.module.scss';
import classNames from 'classnames/bind';
import { faMusic, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Wrapper as PopperWrapper } from '../../../components/Popper';
import Button from '../../../components/Button/Button';
import 'linkify-plugin-hashtag';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import AccountPreview from '../../SuggestedAccounts/AccountPreview/AccountPreview';
import Tippy from '@tippyjs/react/headless';
import Image from '../../Image/Image';
import HashTag from '../../HashTag/HashTag';
const cx = classNames.bind(styles);

function VideoItem(data) {

    const renderPreview = (props) => {
        return (
            <div tabIndex="-1" {...props}>
                <PopperWrapper>
                    <AccountPreview data={data} />
                </PopperWrapper>
            </div>
        );
    };

    return (
        <>
            <div className={cx('wrapper')} id={`video-${data.id}`}>
                <Tippy interactive delay={[800, 200]} offset={[125, 10]} placement="bottom" render={renderPreview}>
                    <Link to={`/@${data.user.nickname}`} className={cx('link-avatar')}>
                        <Image className={cx('user-avatar-big')} src={data.user.avatar} alt={data.user.nickname} />
                    </Link>
                </Tippy>
                <div className={cx('container')}>
                    <header className={cx('header')}>
                        <div className={cx('info')}>
                            <Link to={`/@${data.user.nickname}`} className={cx('user')}>
                                <Image
                                    className={cx('user-avatar-small')}
                                    src={data.user.avatar}
                                    alt={data.user.nickname}
                                />
                                <div className={cx('profile-link')}>
                                    <h3 className={cx('nickname')}>{data.user.nickname}</h3>
                                    {data.tick ? (
                                        <>
                                            <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    <p className={cx('fullname')}>{`${data.user.first_name} ${data.user.last_name}`}</p>
                                </div>
                                {/* .<span className={cx('time')}>{data.published_at}</span> */}
                            </Link>
                            {data.user.is_followed ? (
                                <>
                                    <Button outline_black small className={cx('btn-unfollow')}>
                                        Unfollow
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        outline
                                        small
                                        className={cx('btn-follow')}
                                    >
                                        Follow
                                    </Button>
                                </>
                            )}
                            <HashTag className={cx('content')} tagName="span">
                                {data.description}
                            </HashTag>
                            <h4 className={cx('video-music')}>
                                <Link to="/music/nhac-nen">
                                    <FontAwesomeIcon icon={faMusic} /> Nhạc nền - {data.music}
                                </Link>
                            </h4>
                        </div>
                    </header>
                    <VideoPlayer className={cx('player')} data={data} />
                </div>{' '}
            </div>
        </>
    );
}

export default VideoItem;
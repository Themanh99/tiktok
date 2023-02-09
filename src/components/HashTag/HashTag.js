import Linkify from 'linkify-react';
import 'linkify-plugin-hashtag';
import PropTypes from 'prop-types';

function HashTag({ children }) {

    const optionsHashTag = {
        formatHref: {
            hashTag: (href) => 'hashtag' + href.substr(1),
        },
    };

    return (
        <Linkify options={optionsHashTag} tagName="span">
            {children}
        </Linkify>
    );
}

HashTag.propTypes = {
    children: PropTypes.node.isRequired,
};
export default HashTag;
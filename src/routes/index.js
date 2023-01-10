import Home from '../pages/Home'
import Following from '../pages/Following'
import Upload from '../pages/Upload'
import Profile from '../pages/Profile'
import Search from '../pages/Search'
import HeaderOnly from '../layouts/HeaderOnly'
import config from '../config'


// không cần đăng nhập vẫn xem được
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.following, component: Following },
    { path: config.routes.upload, component: Upload, layout: HeaderOnly },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.search, component: Search, layout: null },
]
// cần đăng nhập mới xem được
const privateRoutes = [

]

export { publicRoutes, privateRoutes }
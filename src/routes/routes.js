import {route, index} from '@react-router/dev/routes'

export default [
    index('../presenters/HomePresenter.jsx'),
    route('about', '../presenters/AboutPresenter.jsx'),
    route('current', '../presenters/CurrentPresenter.jsx'),
    route('details/:animeId', '../presenters/DetailsPresenter.jsx'),
    route('login', '../presenters/LoginRegisterPresenter.jsx'),
    route('rank', '../presenters/RankPresenter.jsx'),
    route('search', '../presenters/SearchPresenter.jsx'),
    route(':userNumber', '../presenters/MePresenter.jsx')
]

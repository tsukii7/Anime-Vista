import { configureStore } from '@reduxjs/toolkit';
import popularityListReducer from '../models/home/popularityListSlice';
import timelineSlice from '../models/current/timelineSlice';
import listSlice from '../models/current/listSlice';
import rankingReducer from '../models/rank/rankingSlice';
import loginReducer from '../models/authentication/loginSlice';
import detailsReducer from '../models/details/detailsSlice';
import filterReducer from '../models/search/filterSlice';
import resultReducer from '../models/search/resultSlice';
import meReducer from '../models/me/meSlice';

const store = configureStore({
    reducer: {
        popularityList: popularityListReducer,
        timeline: timelineSlice,
        list: listSlice,
        ranking: rankingReducer,
        login: loginReducer,
        details: detailsReducer,
        searchFilters: filterReducer,
        searchResults: resultReducer,
        me: meReducer
    }
});

export default store;

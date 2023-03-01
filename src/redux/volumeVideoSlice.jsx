import { createSlice } from '@reduxjs/toolkit';

const volumeVideoSlice = createSlice({
    name: 'volumeVideo',
    initialState: {
        volume: 0,
        muted: true,
        prevVolume: 100,
    },
    reducers: {
        turnOnVolume: (state) => {
            state.volume = state.prevVolume;
            state.muted = false;
            state.prevVolume = 0;
        },

        turnOffVolume: (state) => {
            state.prevVolume = state.volume;
            state.muted = true;
            state.volume = 0;
        },

        setVolume: (state, action) => {
            state.prevVolume = state.volume;
            state.volume = action.payload;
            state.muted = action.payload === 0;
        },
    },
});
export default volumeVideoSlice;

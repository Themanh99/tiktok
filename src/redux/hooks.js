import { useDispatch, useSelector } from "react-redux"
import { currentUserSelector } from './selectors';
import currentUserSlice from './currentUserSlice';
import { useContext } from "react";
import VolumeContext from './VolumeContext';

export const useUserStore = () => {
    const dispath = useDispatch();
    const currentUser = useSelector(currentUserSelector);
    return { currentUser, dispath, currentUserSlice };
}

export const useVolumeStore = () => {
    const [state, dispath] = useContext(VolumeContext);
    return [state, dispath];

}
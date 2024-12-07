import { AppState } from '../../../redux/store';

export const mapCameraModeSelector = (state: AppState) => state.map.cameraMode;
export const mapStopPointsSelector = (state: AppState) => state.map.stopPoints;

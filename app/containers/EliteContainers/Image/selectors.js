import { createSelector } from 'reselect';

const selectImageState = () => (state, props) => state.getIn(['eliteApiLoader', 'Images', props.imageId]);

const defaultImg = '/img/NoPhoto@2x.png';
const selectImageDataUrl = () => createSelector(
  selectImageState(),
  (imageState) => {
    if (!imageState) {
      return defaultImg;
    }
    const url = imageState.get('dataURL');
    return url ? url : defaultImg;
  }
);

export {
  selectImageDataUrl,
};

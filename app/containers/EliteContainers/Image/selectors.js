import { createSelector } from 'reselect';

const selectImageState = () => (state, props) => state.getIn(['eliteApiLoader', 'Images', props.imageId]);

const defaultImg = 'https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg';
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

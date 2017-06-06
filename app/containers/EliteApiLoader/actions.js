/*
 *
 * Elite API actions
 *
 */
//
import {
  BOOKINGS,
  IMAGES,
} from './constants';

export function loadImage(imageId) {
  return {
    type: IMAGES.BASE,
    payload: { imageId },
  };
}

export function loadBookingDetails(bookingId) {
  return {
    type: BOOKINGS.DETAILS.BASE,
    payload: { bookingId },
  };
}

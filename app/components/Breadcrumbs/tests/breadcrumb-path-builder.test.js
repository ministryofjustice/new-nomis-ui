
import { buildBreadcrumb } from '../index';

const offender = {
  firstName: 'john',
  lastName: 'doe',
};

describe('Breadcrumb path builder', () => {
  it('should default to no bread crumbs', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/' });

    expect(breadcrumbs.length).toBe(0);
  });

  it('should produce a breadcumbs structure that drives Home > Results', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/results' });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('Results');
    expect(breadcrumbs[1].route).toBe('results');
  });

  it('should produce a breadcrumb structure that drives Home > Results > Surname, Name', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details', offender, context: 'results' });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');


    expect(breadcrumbs[1].name).toBe('Results');
    expect(breadcrumbs[1].route).toBe('/results');

    expect(breadcrumbs[2].name).toBe('Doe, John');
    expect(breadcrumbs[2].route).toBe('/bookings/details');
  });

  it('should produce a breadcrumb structure that drives Home > Results > Surname, Name > Add case note', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details/addCaseNote', offender, context: 'results' });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('Results');
    expect(breadcrumbs[1].route).toBe('/results');

    expect(breadcrumbs[2].name).toBe('Doe, John');
    expect(breadcrumbs[2].route).toBe('/bookings/details');

    expect(breadcrumbs[3].name).toBe('Add case note');
    expect(breadcrumbs[3].route).toBe('/addCaseNote');
  });

  it('should produce a breadcrumb structure that drives Home > Results > Surname, Name > Add appointment', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details/addAppointment', offender, context: 'results' });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('Results');
    expect(breadcrumbs[1].route).toBe('/results');

    expect(breadcrumbs[2].name).toBe('Doe, John');
    expect(breadcrumbs[2].route).toBe('/bookings/details');

    expect(breadcrumbs[3].name).toBe('Add appointment');
    expect(breadcrumbs[3].route).toBe('/addAppointment');
  });

  it('should produce a breadcrumb structure that drives Home > Results > Doe, John > Schedule', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details/scheduled', offender, context: 'results' });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('Results');
    expect(breadcrumbs[1].route).toBe('/results');

    expect(breadcrumbs[2].name).toBe('Doe, John');
    expect(breadcrumbs[2].route).toBe('/bookings/details');

    expect(breadcrumbs[3].name).toBe('Schedule');
    expect(breadcrumbs[3].route).toBe('/scheduled');
  });

  it('should produce a breadcrumb structure that drives Home > Results > Doe, John > Amend case note', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details/amendCaseNote', offender, context: 'results' });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('Results');
    expect(breadcrumbs[1].route).toBe('/results');

    expect(breadcrumbs[2].name).toBe('Doe, John');
    expect(breadcrumbs[2].route).toBe('/bookings/details');

    expect(breadcrumbs[3].name).toBe('Amend case note');
    expect(breadcrumbs[3].route).toBe('/amendCaseNote');
  });

  it('should produce a breadcrumb structure that drives Home > My assignments > Doe, John', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details', offender, context: 'assignments' });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('My assignments');
    expect(breadcrumbs[1].route).toBe('/assignments');

    expect(breadcrumbs[2].name).toBe('Doe, John');
    expect(breadcrumbs[2].route).toBe('/bookings/details');
  });

  it('should produce a breadcrumb structure that drives Home > My assignments > Doe, John > Add case note', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details/addCaseNote', offender, context: 'assignments' });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('My assignments');
    expect(breadcrumbs[1].route).toBe('/assignments');

    expect(breadcrumbs[2].name).toBe('Doe, John');
    expect(breadcrumbs[2].route).toBe('/bookings/details');

    expect(breadcrumbs[3].name).toBe('Add case note');
    expect(breadcrumbs[3].route).toBe('/addCaseNote');
  });

  it('should produce a breadcrumb structure that drives Home > My assignments > Doe, John > Add appointment', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details/addAppointment', offender, context: 'assignments' });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('My assignments');
    expect(breadcrumbs[1].route).toBe('/assignments');

    expect(breadcrumbs[2].name).toBe('Doe, John');
    expect(breadcrumbs[2].route).toBe('/bookings/details');

    expect(breadcrumbs[3].name).toBe('Add appointment');
    expect(breadcrumbs[3].route).toBe('/addAppointment');
  });

  it('should produce a breadcrumb structure that drives Home > My assignments > Doe, John > Schedule', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details/scheduled', offender, context: 'assignments' });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('My assignments');
    expect(breadcrumbs[1].route).toBe('/assignments');

    expect(breadcrumbs[2].name).toBe('Doe, John');
    expect(breadcrumbs[2].route).toBe('/bookings/details');

    expect(breadcrumbs[3].name).toBe('Schedule');
    expect(breadcrumbs[3].route).toBe('/scheduled');
  });

  it('should produce a breadcrumb structure that drives Home > My assignments > Doe, John > Amend case note', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details/amendCaseNote', offender, context: 'assignments' });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('My assignments');
    expect(breadcrumbs[1].route).toBe('/assignments');

    expect(breadcrumbs[2].name).toBe('Doe, John');
    expect(breadcrumbs[2].route).toBe('/bookings/details');

    expect(breadcrumbs[3].name).toBe('Amend case note');
    expect(breadcrumbs[3].route).toBe('/amendCaseNote');
  });

  it('should produce a breadcrumb structure that drives Home > Doe,John', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details/scheduled', offender });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('Doe, John');
    expect(breadcrumbs[1].route).toBe('/bookings/details');
  });

  it('should produce a breadcrumb structure that drives Home > Doe,John > Add case note', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details/addCaseNote', offender });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('Doe, John');
    expect(breadcrumbs[1].route).toBe('/bookings/details');

    expect(breadcrumbs[2].name).toBe('Add case note');
    expect(breadcrumbs[2].route).toBe('/addCaseNote');
  });

  it('should produce a breadcrumb structure that drives Home > Doe,John > Add appointment', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details/addAppointment', offender });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('Doe, John');
    expect(breadcrumbs[1].route).toBe('/bookings/details');

    expect(breadcrumbs[2].name).toBe('Add appointment');
    expect(breadcrumbs[2].route).toBe('/addAppointment');
  });

  it('should produce a breadcrumb structure that drives Home > Doe,John > Schedule', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details/scheduled', offender });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('Doe, John');
    expect(breadcrumbs[1].route).toBe('/bookings/details');

    expect(breadcrumbs[2].name).toBe('Schedule');
    expect(breadcrumbs[2].route).toBe('/scheduled');
  });

  it('should produce a breadcrumb structure that drives Home > Doe, John > Amend case note', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/bookings/details/amendCaseNote', offender });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('Doe, John');
    expect(breadcrumbs[1].route).toBe('/bookings/details');

    expect(breadcrumbs[2].name).toBe('Amend case note');
    expect(breadcrumbs[2].route).toBe('/amendCaseNote');
  });

  it('should produce a breadcrumb structure that drives Home > My assignments', () => {
    const breadcrumbs = buildBreadcrumb({ route: '/assignments', offender });

    expect(breadcrumbs[0].name).toBe('Home');
    expect(breadcrumbs[0].route).toBe('/');

    expect(breadcrumbs[1].name).toBe('My assignments');
    expect(breadcrumbs[1].route).toBe('/assignments');
  })
});
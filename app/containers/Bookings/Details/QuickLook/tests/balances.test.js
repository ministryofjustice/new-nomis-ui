import React from 'react';
import { shallow } from 'enzyme';
import { FormattedNumber } from 'react-intl';
import { Balances } from '../index';

describe('Balance component', () => {
  it('should show zero when values', () => {
    const balances = shallow(
      <Balances
        spends={0}
        cash={0}
        savings={0}
        currency={'gbp'}
      />
    );

    expect(balances.contains(
      <FormattedNumber
        id="spends"
        value={0}
        style="currency"
        currency={'gbp'}
      />)).toBe(true);

    expect(balances.contains(
      <FormattedNumber
        id="cash"
        value={0}
        style="currency"
        currency={'gbp'}
      />)).toBe(true);

    expect(balances.contains(
      <FormattedNumber
        id="savings"
        value={0}
        style="currency"
        currency={'gbp'}
      />)).toBe(true);
  });
});
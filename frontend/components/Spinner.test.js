import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner';

test('sanity', () => {
  expect(true).toBe(true);
});

test('renders spinner when `on` is true', () => {
  const { getByTestId } = render(<Spinner on={true} />);
  const spinnerElement = getByTestId('spinner');
  expect(spinnerElement).toBeInTheDocument();
});

test('does not render spinner when `on` is false', () => {
  const { queryByTestId } = render(<Spinner on={false} />);
  const spinnerElement = queryByTestId('spinner');
  expect(spinnerElement).not.toBeInTheDocument();
});


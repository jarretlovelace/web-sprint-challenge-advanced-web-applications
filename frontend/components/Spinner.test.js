// Spinner.test.js
import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner';
import '@testing-library/jest-dom/extend-expect';

test('sanity', () => {
  expect(true).toBe(true);
});

test('renders spinner when `on` is true', () => {
  const { getById } = render(<Spinner on={true} />);
  const spinnerElement = getById('spinner');
  expect(spinnerElement).toBeInTheDocument();
});

test('does not render spinner when `on` is false', () => {
  const { queryById } = render(<Spinner on={false} />);
  const spinnerElement = queryById('spinner');
  expect(spinnerElement).not.toBeInTheDocument();
});

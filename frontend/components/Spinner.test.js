// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react'
import { render } from '@testing-library/react'
import Spinner from './Spinner'

test('sanity', () => {
  expect(true).toBe(false)
})

describe('Spinner component', () => {
  test('renders corrent when spinner is on', () => {
const { container } = render(<Spinner on={true} />);
expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  test('does not render when spinner is off', () => {
    const { container } = render(<Spinner on={false} />)
    expect(container.querySelector('.spinner')).not.toBeInTheDocument();
  });
});
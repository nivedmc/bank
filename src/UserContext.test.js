import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProvider, useUser } from './UserContext'; // Replace with the actual file path

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const TestComponent = () => {
  const { username, updateUsername, acntbalance, updatebalance } = useUser();

  return (
    <div>
      <span data-testid="username">{username}</span>
      <span data-testid="acntbalance">{acntbalance}</span>
      <button onClick={() => updateUsername('NewUser')}>Update Username</button>
      <button onClick={() => updatebalance('1000')}>Update Balance</button>
    </div>
  );
};

describe('UserContext', () => {
  it('renders the component with initial values from localStorage', () => {
    localStorage.setItem('username', 'InitialUser');
    localStorage.setItem('balance', '500');

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );


  });

  it('updates context values on button click', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Click the button to update the username
    userEvent.click(screen.getByText('Update Username'));


    // Click the button to update the balance
    userEvent.click(screen.getByText('Update Balance'));

  });
});

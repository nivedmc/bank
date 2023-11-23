import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BrowserRouter as Router, Route ,Routes} from 'react-router-dom';
import {
  ProtectedRoute,
  StaffProtectedRoute,
  ManagerProtectedRoute,
} from './protectedroute';

describe('ProtectedRoute components', () => {
  it('renders children when user is logged in', () => {
    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn(() => 'mockAccessToken'),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    render(
      <Router initialEntries={['/protected']}>
        <ProtectedRoute>
          <Route path="/protected">
            <div data-testid="protected-content">Protected Content</div>
          </Route>
        </ProtectedRoute>
      </Router>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('redirects to login when user is not logged in (ProtectedRoute)', () => {
    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn(() => null),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute>
          <Route path="/protected">
            <div data-testid="protected-content">Protected Content</div>
          </Route>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Ensure that useNavigate is called to redirect to the login page
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  // it('renders children when user is logged in as staff', () => {
  //   const mockLocalStorage = {
  //     getItem: jest.fn(() => null),
  //   };
  //   Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

  //   render(
  //     <MemoryRouter initialEntries={['/protected']}>
  //       <Routes>
  //         <StaffProtectedRoute path="/protected">
  //         <Route path="/protected">
  //           <div data-testid="protected-content">Protected Content</div>
  //         </Route>
  //         </StaffProtectedRoute>
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  // });
  

  // Similar test cases can be written for StaffProtectedRoute and ManagerProtectedRoute
});

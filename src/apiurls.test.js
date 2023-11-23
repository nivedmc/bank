import { customerService, staffService, managerService } from './apiurls';
import { waitFor } from '@testing-library/react';

// Mock the axiosPrivate module
jest.mock('./interceptor', () => {
  const axiosInstance = {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };

  return {
    axiosPrivate: axiosInstance,
  };
});

describe('Service functions', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('customerService', () => {
    it('calls axiosPrivate.post for login', async () => {
      await customerService.login({ username: 'testuser', password: 'testpassword' });
      expect(require('./interceptor').axiosPrivate.post).toHaveBeenCalledWith('login/', {
        username: 'testuser',
        password: 'testpassword',
      });
    });

    it('calls axiosPrivate.post for register', async () => {
      await customerService.register({ username: 'testuser', password: 'testpassword' });
      expect(require('./interceptor').axiosPrivate.post).toHaveBeenCalledWith('userregistration/', {
        username: 'testuser',
        password: 'testpassword',
      });
    });
    it('tranasction', async () => {
      await customerService.transaction({ amount: '100', transactionType: 'deposit' });
      expect(require('./interceptor').axiosPrivate.post).toHaveBeenCalledWith('transactions/', {
        amount: '100', transactionType: 'deposit'
      });
    });
    // it('calls for profile update', async () => {
    //   await customerService.updateprofile();
    //   expect(require('./interceptor').axiosPrivate.put).toHaveBeenCalledWith(`updateprofile/${'1'}/`, {
    //     username: 'testuser',
    //   });
    // });


  });

  describe('staffService', () => {
    it('customer list', async () => {
      await staffService.pendinglist();
      expect(require('./interceptor').axiosPrivate.get).toHaveBeenCalledWith('pendingcustomers/');
    });
    it('customer deactivate', async () => {
      await staffService.deactivateAccount('1');
      expect(require('./interceptor').axiosPrivate.patch).toHaveBeenCalledWith(`accounts/${'1'}/deactivate/`);
    });
    it('customer activate', async () => {
      await staffService.approveAccount('1');
      expect(require('./interceptor').axiosPrivate.patch).toHaveBeenCalledWith(`activatecustomer/${'1'}/`);
    });
    it('account details', async () => {
      await staffService.accountdetails('1');
      expect(require('./interceptor').axiosPrivate.get).toHaveBeenCalledWith(`accounts/${'1'}/`);
    });
  });

  describe('managerService', () => {
    it('staff list', async () => {
      await managerService.Staffmanagment();
      expect(require('./interceptor').axiosPrivate.get).toHaveBeenCalledWith('staffmanagement/');
    });
    it('staff removal', async () => {
      await managerService.removestaff('1');
      expect(require('./interceptor').axiosPrivate.delete).toHaveBeenCalledWith(`removestaff/${'1'}/`);
    });
  });
  });

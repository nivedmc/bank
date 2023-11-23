import { axiosPrivate } from "./interceptor";

const login = (data) => {
    return axiosPrivate.post('login/',data);
  };

const register = (data) => {
    return axiosPrivate.post('userregistration/',data);
  };

  const transaction = (data) => {
    return axiosPrivate.post('transactions/',data);
  };
  const pendinglist= () => {
    return axiosPrivate.get(`pendingcustomers/`);
  }
  const accountdetails= (id) => {
    return axiosPrivate.get(`accounts/${id}/`);
  }
  const approveAccount = (id) => {
    return axiosPrivate.patch(`activatecustomer/${id}/`)
  }
  const deactivateAccount = (id) => {
    return axiosPrivate.patch(`accounts/${id}/deactivate/`)
  }

  const Staffmanagment = () => {
    return axiosPrivate.get(`staffmanagement/`);
  }
  const removestaff = (id) => {
    return axiosPrivate.delete(`removestaff/${id}/`);
  }
  const updateprofile = (id,formData) => {
    return axiosPrivate.put(`updateprofile/${id}/`,formData)
  }
  const userdetails = (id,data) => {
    return axiosPrivate.get(`profile/${id}/`,data)
  }
  
  const managerService = {
    Staffmanagment,
    removestaff,
  } 
  

  const customerService = {
    login,
    register,
    updateprofile,
    userdetails,
    transaction,    
  };
  const staffService ={
    pendinglist,
    approveAccount,
    deactivateAccount,
    accountdetails
  }

export { customerService,staffService,managerService};
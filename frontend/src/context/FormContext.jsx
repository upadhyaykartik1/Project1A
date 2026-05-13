import { createContext, useContext } from 'react';

const FormContext = createContext(null);

export const FormProvider = FormContext.Provider;

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
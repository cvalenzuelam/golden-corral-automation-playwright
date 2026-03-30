export interface RegisterData {
  name: string;
  lastName: string;
  organization: string;
  billingAddress: string;
  billingAddressTwo: string;
  state: string;
  city: string;
  zipCode: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export const validUser: RegisterData = {
  name: 'John',
  lastName: 'Doe',
  organization: 'Test Organization',
  billingAddress: '123 Main St',
  billingAddressTwo: 'Apt 4B',
  state: 'Texas',
  city: 'Abbott',
  zipCode: '76621',
  countryCode: '+52',
  phoneNumber: '1234567890',
  email: `qa.test+${Date.now()}@goldencorral.com`,
  password: 'SecurePassword123!',
};

export const duplicateUser: RegisterData = {
  name: 'John',
  lastName: 'Doe',
  organization: 'Test Organization',
  billingAddress: '123 Main St',
  billingAddressTwo: 'Apt 4B',
  state: 'Texas',
  city: 'Abbott',
  zipCode: '76621',
  countryCode: '+52',
  phoneNumber: '1234567890',
  email: 'cvalenzuelam92@gmail.com',
  password: 'SecurePassword123!',
};

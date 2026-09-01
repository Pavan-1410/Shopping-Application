export interface Address {
  address_id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CreateAddressInput {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
}
export type RestaurantAddress = {
  street: string;
  city: string;
  cap: string;
  civic: string;
};

export type RestaurantSettings = {
  name: string;
  slogan: string;
  telNumber: string;
  cellNumber: string;
  address: RestaurantAddress;
  pIva: string;
};

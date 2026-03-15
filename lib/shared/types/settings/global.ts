import { ApplicationSettings } from "./application";
import { OperationalSettings } from "./operational";
import { RestaurantSettings } from "./restaurant";

export type GlobalSettings = {
  profile: RestaurantSettings;
  operational: OperationalSettings;
  application: ApplicationSettings;
};

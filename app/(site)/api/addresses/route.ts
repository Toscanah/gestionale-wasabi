import { createHandler } from "../../lib/api/createHandler";
import { ADDRESS_ACTIONS } from "./actions";

const handler = createHandler(ADDRESS_ACTIONS);

export { handler as GET, handler as POST, handler as PATCH };

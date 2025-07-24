import { createHandler } from "../../lib/api/createHandler";
import { CUSTOMER_ACTIONS } from "./actions";

const handler = createHandler(CUSTOMER_ACTIONS);

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };

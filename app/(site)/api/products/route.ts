import { createHandler } from "../../lib/api/createHandler";
import { PRODUCT_ACTIONS } from "./actions";

const handler = createHandler(PRODUCT_ACTIONS);

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };

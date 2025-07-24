import { createHandler } from "../../lib/api/createHandler";
import { ORDER_ACTIONS } from "./actions";

const handler = createHandler(ORDER_ACTIONS);

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };

import { createHandler } from "../../lib/api/createHandler";
import { RICE_ACTIONS } from "./actions";

const handler = createHandler(RICE_ACTIONS);

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };

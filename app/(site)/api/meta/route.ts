import { createHandler } from "../../lib/api/createHandler";
import { META_ACTIONS } from "./actions";

const handler = createHandler(META_ACTIONS);

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };

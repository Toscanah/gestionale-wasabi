import { createHandler } from "../../lib/api/createHandler";
import { CATEGORY_ACTIONS } from "./actions";

const handler = createHandler(CATEGORY_ACTIONS);

export { handler as GET, handler as POST, handler as PATCH };

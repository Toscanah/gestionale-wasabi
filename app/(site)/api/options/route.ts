import { createHandler } from "../../lib/api/createHandler";
import { OPTION_ACTIONS } from "./actions";

const handler = createHandler(OPTION_ACTIONS);

export { handler as GET, handler as POST, handler as PATCH };

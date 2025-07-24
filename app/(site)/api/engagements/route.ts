import { createHandler } from "../../lib/api/createHandler";
import { ENGAGEMENT_ACTIONS } from "./actions";

const handler = createHandler(ENGAGEMENT_ACTIONS);

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };

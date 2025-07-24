import { createHandler } from "../../lib/api/createHandler";
import { PAYMENT_ACTIONS } from "./actions";

const handler = createHandler(PAYMENT_ACTIONS);

export { handler as GET, handler as POST };

import Koa, { DefaultState, Context } from "koa";
import Router from "koa-router";
import koaBody from "koa-body";

const app = new Koa();
const router = new Router();

router.get("/", koaBody(), async (ctx, next) => {
  ctx.body = "this app for twilio webhooks";
  await next();
});

/**
 * https://www.twilio.com/docs/sms/tutorials/how-to-receive-and-reply-node-js
 */
router.post("/api/webhooks/sms", koaBody(), async (ctx: Context) => {
  const { Body } = ctx.request.body;
  const MessagingResponse = require("twilio").twiml.MessagingResponse;
  const twiml = new MessagingResponse();
  if (["Yes", "Y"].includes(Body)) {
    twiml.message("Great! A Compass agent will call you within 5 minutes");
  } else if (["No", "N"].includes(Body)) {
    twiml.message(
      "Thank you for your feedback, if you have any housing needs in the future, you can contact us at any time."
    );
  } else {
    twiml.message("Please reply Yes (Y) or No (N)");
  }
  ctx.status = 200;
  ctx.set("Content-Type", "text/xml");
  ctx.body = twiml.toString();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.info(`App listening on port: 3000`);
});

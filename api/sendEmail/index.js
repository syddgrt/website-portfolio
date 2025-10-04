const { EmailClient } = require("@azure/communication-email");

module.exports = async function (context, req) {
    try {
        if (!req.body || !req.body.email || !req.body.message) {
            context.res = { status: 400, body: { error: "Missing required fields" } };
            return;
        }

        const emailClient = new EmailClient(process.env.ACS_CONNECTION_STRING);

        const message = {
            senderAddress: "DoNotReply@syedrious.cloud", // must match your verified ACS domain
            content: {
                subject: `Contact Form: ${req.body.email}`,
                plainText: `Message from ${req.body.name || "Anonymous"} (${req.body.email}):\n\n${req.body.message}`,
                html: `<p><strong>From:</strong> ${req.body.name || "Anonymous"} (${req.body.email})</p><p>${req.body.message}</p>`
            },
            recipients: {
                to: [{ address: "you@syedrious.cloud", displayName: "Syed" }]
            }
        };

        const poller = await emailClient.beginSend(message);
        const result = await poller.pollUntilDone();

        context.res = { status: 200, body: { success: true, result } };
    } catch (err) {
        context.res = { status: 500, body: { error: err.message } };
    }
};

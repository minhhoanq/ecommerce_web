import nodemailer from "nodemailer";

const sendMail = async ({
    email,
    html,
    subject,
}: {
    email: string;
    html: any;
    subject: string;
}) => {
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const main = async () => {
        const info = await transport.sendMail({
            from: '"Admin" <no-reply@minhhoang.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: "Hello world?", // plain text body
            html: html, // html body
        });
        console.log("Message sent: %s", info.messageId);
    };

    main().catch(console.error);
};

export default sendMail;

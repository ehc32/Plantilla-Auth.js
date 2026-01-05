import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (payload: {
  to: string;
  subject: string;
  text: string;
}) => {
  try {
    const response = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "xzenzi259@gmail.com", // testing: solo a tu correo
      subject: payload.subject,
      text: payload.text,
    });

    console.log("Email sent successfully:", response);
    return !!response?.data;
  } catch (error: any) {
    console.error("Error sending email:", error);
    return false;
  }
};

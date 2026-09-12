import nodemailer from "nodemailer";

interface DonationEmailParams {
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  sevaCategory: string;
  paymentId: string;
  orderId: string;
}

export async function sendDonationNotificationEmail(params: DonationEmailParams) {
  const {
    donorName,
    donorEmail,
    donorPhone,
    amount,
    sevaCategory,
    paymentId,
    orderId,
  } = params;

  const adminEmail = process.env.ADMIN_EMAIL || "saibabavedhagarden@gmail.com";
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // If SMTP configuration is present, send email via Nodemailer
  if (smtpHost && smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const emailSubject = `🙏 New Donation Received: ₹${amount.toLocaleString()} for ${sevaCategory || "General Donation"}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded-radius: 8px;">
        <div style="background-color: #f59e0b; padding: 15px; text-align: center; color: white; border-radius: 6px 6px 0 0;">
          <h2 style="margin: 0;">SRI SHIRDI SAIBABA RELIGIOUS TRUST</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Donation Successful Notification</p>
        </div>
        <div style="padding: 20px; background-color: #ffffff;">
          <h3 style="color: #333333; margin-top: 0;">Donation Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Donor Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${donorName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Amount Paid:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 18px; color: #d97706; font-weight: bold;">₹${amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Seva Category:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #b45309;">${sevaCategory || "General Donation"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email Address:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${donorEmail}">${donorEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Mobile Number:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${donorPhone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Payment ID:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-family: monospace;">${paymentId}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Order ID:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-family: monospace;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Status:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><span style="background-color: #dcfce7; color: #15803d; padding: 4px 8px; border-radius: 4px; font-weight: bold;">SUCCESSFUL</span></td>
            </tr>
          </table>
          <p style="font-size: 13px; color: #666666; margin-top: 20px;">
            This email was automatically sent upon successful completion of payment via Razorpay & Supabase.
          </p>
        </div>
      </div>
    `;

    try {
      // Send notification to Admin/Trust email
      await transporter.sendMail({
        from: `"Sri Shirdi Saibaba Trust" <${smtpUser}>`,
        to: adminEmail,
        subject: emailSubject,
        html: htmlContent,
      });

      // Send thank you confirmation email to donor
      if (donorEmail) {
        await transporter.sendMail({
          from: `"Sri Shirdi Saibaba Trust" <${smtpUser}>`,
          to: donorEmail,
          subject: `🙏 Thank You for Your Donation to Sri Shirdi Saibaba Religious Trust`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <div style="background-color: #f59e0b; padding: 15px; text-align: center; color: white; border-radius: 6px 6px 0 0;">
                <h2 style="margin: 0;">SRI SHIRDI SAIBABA RELIGIOUS TRUST</h2>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Donation Receipt Confirmation</p>
              </div>
              <div style="padding: 20px; background-color: #ffffff;">
                <p>Dear <strong>${donorName}</strong>,</p>
                <p>Om Sai Ram! Thank you for your generous donation to Sri Shirdi Saibaba Religious Trust.</p>
                <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0;">
                  <p style="margin: 4px 0;"><strong>Seva Category:</strong> ${sevaCategory || "General Donation"}</p>
                  <p style="margin: 4px 0;"><strong>Amount Paid:</strong> ₹${amount.toLocaleString()}</p>
                  <p style="margin: 4px 0;"><strong>Payment ID:</strong> ${paymentId}</p>
                </div>
                <p>May Sadguru Sri Shirdi Saibaba bless you and your family with health, peace, and prosperity.</p>
                <p style="margin-top: 20px;">Warm Regards,<br/><strong>Sri Shirdi Saibaba Religious Trust</strong></p>
              </div>
            </div>
          `,
        });
      }
      console.log("Donation notification emails sent successfully.");
    } catch (err) {
      console.error("Failed to send email notification via nodemailer:", err);
    }
  } else {
    console.log(
      "SMTP credentials not fully configured in environment. Donation details:",
      { donorName, donorEmail, donorPhone, amount, sevaCategory, paymentId, orderId }
    );
  }
}

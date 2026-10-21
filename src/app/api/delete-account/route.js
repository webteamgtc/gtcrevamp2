import { NextResponse } from "next/server";
import { MAILGUN_DOMAIN, MAILGUN_FROM, mailgunClient, transporter } from "../../../config/nodemailer";

export async function POST(req) {
  const data = await req.json();
  const mailData = {
    from: MAILGUN_FROM,
    to: "deleteacct@gtcfx.com",
    bcc: "mohammad.zeeshan@gtcfx.com",
    subject: "Account Deletion",
    html: `      
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Live Trading Account is Now Active</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #F7F7F7; font-family: 'Outfit', Arial, sans-serif; color: #1e2158; text-align: left; line-height: 22px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="border-spacing: 0; width: 100%;">
        <tr>
            <td align="center" bgcolor="#F7F7F7">
                <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #192055; padding: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-radius: 36px; padding: 20px; background-color: #fff; width: 100%;">
                        <tr>
                            <td class="header" style="padding: 20px; text-align: center;">
                                <img src="https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/email-test.png" alt="GTC Global Capital Trade Logo" style="max-width: 165px; height: auto;">
                            </td>
                        </tr>
                        <tr>                
                          <td class="content">                  
                              <h1 style="color: #192055; text-align: center; font-size: 17px; margin: 0px auto 20px;">
                                  Account Deletion Request
                              </h1>
                                                
                              <table class="content-table" style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                                   <tr>
                                      <th style="padding: 10px; text-align: left; background-color: #f2f2f2; color: #192055;">Full Name</th>
                                      <td style="padding: 10px; border: 1px solid #ddd;">${data?.fullName}</td>
                                  </tr>
                                    <tr>
                                      <th style="padding: 10px; text-align: left; background-color: #f2f2f2; color: #192055;">Email</th>
                                      <td style="padding: 10px; border: 1px solid #ddd;">${data?.email}</td>
                                  </tr>
                                    <tr>
                                      <th style="padding: 10px; text-align: left; background-color: #f2f2f2; color: #192055;">Phone</th>
                                      <td style="padding: 10px; border: 1px solid #ddd;">${data?.phone}</td>
                                  </tr>
                                  <tr>
                                      <th style="padding: 10px; text-align: left; background-color: #f2f2f2; color: #192055;">Login ID</th>
                                      <td style="padding: 10px; border: 1px solid #ddd;">${data?.accounts}</td>
                                  </tr>
                                      <tr>
                                      <th style="padding: 10px; text-align: left; background-color: #f2f2f2; color: #192055;">Platform</th>
                                      <td style="padding: 10px; border: 1px solid #ddd;">${data?.platform}</td>
                                  </tr>
                                        <tr>
                                      <th style="padding: 10px; text-align: left; background-color: #f2f2f2; color: #192055;">Reason</th>
                                      <td style="padding: 10px; border: 1px solid #ddd;">${data?.reason}</td>
                                  </tr>
                                
                              </table>                          
                              <p style="line-height: 30px; padding-top: 20px;">
                                  Best Regards,<br/>
                                  <strong style="color: #192055; margin-top: 5px;">GTCFX Team</strong>
                              </p>
                          </td>
                      </tr>
                      
                          
                        
                        
                        <tr>
                          <td class="footer" style="padding: 20px 0px; font-size: 10px; color: #000; background-color: #f7f7f736; border-radius: 0 0 36px 36px; text-align: left;">
                                <div class="social-icons" style="padding-bottom: 10px; text-align: center;">
                                    <a href="https://www.facebook.com/gtcfxofficial" style="text-decoration: none;" target="_blank">
                                        <img alt="Facebook" src="https://d3k81ch9hvuctc.cloudfront.net/assets/email/buttons/default/facebook_96.png" style="width: 24px; height: 24px; margin: 0 5px;">
                                    </a>
                                    <a href="https://twitter.com/GTC_fx" style="text-decoration: none;" target="_blank">
                                        <img alt="Twitter" src="https://d3k81ch9hvuctc.cloudfront.net/assets/email/buttons/default/twitter_96.png" style="width: 24px; height: 24px; margin: 0 5px;">
                                    </a>
                                    <a href="https://linkedin.com/company/gtcfx-official" style="text-decoration: none;" target="_blank">
                                        <img alt="LinkedIn" src="https://d3k81ch9hvuctc.cloudfront.net/assets/email/buttons/default/linkedin_96.png" style="width: 24px; height: 24px; margin: 0 5px;">
                                    </a>
                                    <a href="https://www.youtube.com/channel/UCnKWakjm1b9Bm63xgwNFXHA" style="text-decoration: none;" target="_blank">
                                        <img alt="YouTube" src="https://d3k81ch9hvuctc.cloudfront.net/assets/email/buttons/default/youtube_96.png" style="width: 24px; height: 24px; margin: 0 5px;">
                                    </a>
                                    <a href="https://www.instagram.com/gtcfxofficial" style="text-decoration: none;" target="_blank">
                                        <img alt="Instagram" src="https://d3k81ch9hvuctc.cloudfront.net/assets/email/buttons/default/instagram_96.png" style="width: 24px; height: 24px; margin: 0 5px;">
                                    </a>
                                    <a href="https://www.tiktok.com/@gtcgroup_official" style="text-decoration: none;" target="_blank">
                                        <img alt="TikTok" src="https://d3k81ch9hvuctc.cloudfront.net/assets/email/buttons/default/tiktok_96.png" style="width: 24px; height: 24px; margin: 0 5px;">
                                    </a>
                                </div>
                                <p>
                                    Company name: GTC FX / Website: www.gtcfx.com / Email:
                                    support@gtcfx.com
                                  </p>
                                  <p>
                                    Disclaimers: The information in this email is for general
                                    purposes only and does not constitute personal financial
                                    advice. Please assess the relevance of this information to
                                    your financial goals and situation before making any
                                    financial decisions.
                                  </p>
                                  <p>
                                    Note: Our products and services are not available in
                                    restricted countries.
                                  </p>
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
    `,
  };
  try {
      const res = await mailgunClient.messages.create(MAILGUN_DOMAIN, mailData);
    return NextResponse.json(
      { message: "Send Successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error Sending Mail" },
      { status: 500 }
    );
  }
}

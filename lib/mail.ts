import nodemailer from "nodemailer";

// Tạo cổng gửi thư (Transporter) kết nối với Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SendResetPasswordEmailParams {
  to: string;
  userName?: string;
  resetUrl: string;
}

export async function sendResetPasswordEmail({ to, userName, resetUrl }: SendResetPasswordEmailParams) {
  const mailOptions = {
    from: `"Cửa Hàng Điện Tử" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔐 [Electronics Store] Yêu cầu đặt lại mật khẩu của bạn",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #2563eb; text-align: center; margin-bottom: 24px;">CỬA HÀNG ĐIỆN TỬ</h2>
        <p style="font-size: 16px; color: #18181b;">Xin chào <strong>${userName || "Quý khách"}</strong>,</p>
        <p style="font-size: 14px; color: #52525b; line-height: 1.6;">
          Hệ thống nhận được yêu cầu đặt lại mật khẩu cho tài khoản mua sắm của bạn. Vui lòng bấm vào nút bên dưới để tiến hành tạo mật khẩu mới:
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; font-size: 15px; font-weight: bold; border-radius: 8px; display: inline-block;">
            Đặt Lại Mật Khẩu Ngay
          </a>
        </div>

        <p style="font-size: 13px; color: #dc2626; line-height: 1.5;">
          ⚠️ <strong>Lưu ý:</strong> Đường link này chỉ có hiệu lực trong vòng <strong>15 phút</strong>. Sau 15 phút, link sẽ tự động bị vô hiệu hóa vì lý do bảo mật.
        </p>

        <p style="font-size: 13px; color: #71717a; line-height: 1.5; margin-top: 24px; border-top: 1px solid #f4f4f5; padding-top: 16px;">
          Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email. Mật khẩu hiện tại của bạn vẫn được giữ an toàn tuyệt đối.
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}
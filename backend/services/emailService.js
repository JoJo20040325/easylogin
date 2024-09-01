/**
 * emailService.js
 * 这个模块提供了邮件发送服务，使用 Ethereal Email 进行模拟。
 * 注意：这是一个用于开发和测试的模拟 SMTP 服务，不会实际发送邮件。
 */

const nodemailer = require("nodemailer");
const { promisify } = require("util");
const sleep = promisify(setTimeout);

/**
 * 创建 Nodemailer transporter
 * 使用 Ethereal Email 的配置
 */
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // 使用 TLS
  auth: {
    user: "lexi.donnelly@ethereal.email",
    pass: "rX4HY2NDjJRKdPtNZk",
  },
});

/**
 * 带重试机制的邮件发送函数
 * @param {Object} mailOptions - Nodemailer 邮件选项
 * @param {number} [maxRetries=3] - 最大重试次数
 * @throws {Error} 如果在最大重试次数后仍然失败
 */
async function sendMailWithRetry(mailOptions, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      console.log("邮件发送成功");
      return;
    } catch (error) {
      console.error(
        `邮件发送失败 (尝试 ${attempt}/${maxRetries}):`,
        error.message
      );
      if (attempt === maxRetries) throw error;
      // 指数退避策略
      await sleep(1000 * Math.pow(2, attempt - 1));
    }
  }
}

/**
 * 发送密码重置邮件
 * @param {string} email - 接收者的邮箱地址
 * @param {string} resetUrl - 密码重置链接
 * @throws {Error} 如果邮件发送失败
 */
exports.sendPasswordResetEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: '"Your App" <noreply@yourapp.com>',
    to: email,
    subject: "密码重置",
    text: `您请求了密码重置。请点击此链接重置密码：${resetUrl}\n如果您没有请求重置密码,请忽略此邮件。`,
    html: `<p>您请求了密码重置。请点击<a href="${resetUrl}">此链接</a>重置密码。</p><p>如果您没有请求重置密码,请忽略此邮件。</p>`,
  };

  try {
    await sendMailWithRetry(mailOptions);
  } catch (error) {
    console.error("邮件发送最终失败:", error);
    throw new Error("发送密码重置邮件失败");
  }
};
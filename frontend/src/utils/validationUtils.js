/**
 * utils/validationUtils.js
 * 这个文件提供了用于前端验证的工具函数。
 */
import zxcvbn from 'zxcvbn';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,16}$/;


/**
 * 验证邮箱格式
 * @param {string} email - 要验证的邮箱地址
 * @returns {boolean} 是否为有效邮箱
 */
export const validateEmail = (email) => EMAIL_REGEX.test(String(email).toLowerCase());


/**
 * 验证用户名格式
 * @param {string} username - 要验证的用户名
 * @returns {Object} 包含验证结果和消息的对象
 */
export const validateUsername = (username) => {
  if (!USERNAME_REGEX.test(username)) {
    return {
      isValid: false,
      message: '用户名必须是3-16个字符,只能包含字母、数字、下划线和连字符',
    };
  }
  return { isValid: true, message: '' };
};

/**
 * 验证密码强度
 * @param {string} password - 要验证的密码
 * @returns {Object} 包含验证结果、分数和反馈的对象
 */
export const validatePassword = (password) => {
  const result = zxcvbn(password);
  if (result.score < 3) {
    return {
      isValid: false,
      score: result.score,
      message: '密码强度不足',
      feedback: result.feedback.suggestions.join('. '),
    };
  }
  return {
    isValid: true,
    score: result.score,
    message: '密码强度足够',
    feedback: '很好！这是一个强密码。',
  };
};

/**
 * 验证多个输入字段
 * @param {Object} fields - 包含要验证的字段的对象
 * @returns {Object} 包含各字段错误信息的对象
 */
export const validateInputs = (fields) => {
  const errors = {};
  if (fields.username) {
    const usernameValidation = validateUsername(fields.username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.message;
    }
  }
  if (fields.email && !validateEmail(fields.email)) {
    errors.email = '请输入有效的电子邮箱地址';
  }
  if (fields.password) {
    const passwordValidation = validatePassword(fields.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }
  }
  return errors;
};

/**
 * 验证用户更新数据
 * @param {Object} updateData - 要更新的用户数据
 * @returns {Object} 包含各字段错误信息的对象
 */
export const validateUserUpdate = (updateData) => {
  const errors = {};
  if (updateData.username !== undefined) {
    const usernameValidation = validateUsername(updateData.username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.message;
    }
  }
  if (updateData.email !== undefined && !validateEmail(updateData.email)) {
    errors.email = '请输入有效的电子邮箱地址';
  }
  return errors;
};
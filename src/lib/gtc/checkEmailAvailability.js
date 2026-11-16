/** True when GTC check_email allows registration for this address. */
export function isEmailAvailableForRegistration(check) {
  if (!check || check.code !== 200) return false;
  const msg = String(check.message ?? '').toLowerCase();
  if (/exist|registered|taken|already|duplicate|已注册|已存在|重复/.test(msg)) return false;
  if (/available|not exist|can register|可以注册|未注册|不存在/.test(msg)) return true;
  const data = check.data;
  if (data === true || data?.available === true || data?.is_available === true) return true;
  if (data === false || data?.available === false) return false;
  // Upstream often returns code 200 + neutral/empty message when the email is free.
  return true;
}
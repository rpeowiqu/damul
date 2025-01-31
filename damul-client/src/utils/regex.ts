const REGEX_NICKNAME: RegExp = new RegExp("^[a-zA-Z가-힣0-9]{2,8}$");

export const checkNickname = (nickname: string): boolean => {
  return REGEX_NICKNAME.test(nickname);
};

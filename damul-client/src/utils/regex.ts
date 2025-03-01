const REGEX_NICKNAME = new RegExp("^[a-zA-Z가-힣0-9]{2,8}$");

export const isValidNickname = (nickname: string): boolean => {
  return REGEX_NICKNAME.test(nickname);
};

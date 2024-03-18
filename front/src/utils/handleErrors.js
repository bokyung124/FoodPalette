export const formatErrorMessage = (errorObj) => {
  const messages = Object.entries(errorObj).map(([key, value]) => {
    // 각 키에 대해, 첫 번째 에러 메시지만 사용합니다.
    // 더 많은 메시지가 있다면, 이 부분을 수정하여 모든 메시지를 포함시킬 수 있습니다.
    const message = value[0];
    return `'${key}': ${message}`;
  });

  // 모든 메시지를 개행 문자로 구분하여 하나의 문자열로 결합합니다.
  const combinedMessage = messages.join(" \n ");
  return { message: combinedMessage };
};

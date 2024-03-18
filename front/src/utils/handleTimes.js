export default function formatTimeString(dateTime) {
  const localDate = new Date(dateTime);

  // 로컬 시간대에 맞춰 날짜를 문자열로 포맷팅
  const formattedDate = localDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24시간 표시 형식 사용
  });

  return formattedDate;
}

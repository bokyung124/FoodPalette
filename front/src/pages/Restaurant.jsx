import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { MdLocationOn, MdPhone } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { formatErrorMessage } from "../utils/handleErrors";
import formatTimeString from "../utils/handleTimes";

export default function Restaurant() {
  const { currentUser, error, loading } = useSelector((state) => state.user);

  const params = useParams();
  const restId = params.restId;
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [reviews, setReviews] = useState({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  const [isFavorited, setIsFavorited] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [formData, setFormData] = useState({
    source: "F",
    username: "",
    comment: "",
    date: "",
    rate: 0,
    user: "",
    restaurant: params.restId || "",
  });

  const fetchFavorite = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/favorite/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${currentUser.token}`,
          },
        }
      );

      const data = await res.json();

      if (res.status !== 200) {
        return;
      }

      // 성공적으로 즐겨찾기 목록을 받아 온 경우, 배열 형태이다.
      if (data && data.length > 0) {
        if (
          data.some((favoriteInfo) => favoriteInfo.restaurant === params.restId)
        ) {
          setIsFavorited(true);
        } else {
          setIsFavorited(false);
        }
      }

      return data;
    } catch (error) {}
  };

  const fetchReviews = async (fetchUrl) => {
    try {
      // 리뷰 요청
      const res = await fetch(fetchUrl);
      const newReviews = await res.json();

      if (res.status !== 200) {
        return;
      }

      if (newReviews.next) {
        // 리뷰는 다섯 개씩.
        setShowMore(true);
      } else {
        setShowMore(false);
      }

      setReviews((prevReviews) => ({
        ...newReviews, // newReviews의 나머지 필드(count, next, previous)를 새 상태로 복사합니다.
        results: [...prevReviews.results, ...newReviews.results], // 기존 results 배열과 newReviews의 results 배열을 합칩니다.
      }));
    } catch (error) {}
  };

  useEffect(() => {
    const fetchRestaurntInfo = async () => {
      try {
        // 레스토랑 정보 요청
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/main/search/${params.restId}`
        );
        const data = await res.json();

        setRestaurantInfo(data);
      } catch (error) {}
    };

    fetchRestaurntInfo();
    fetchFavorite();
    fetchReviews(
      `${import.meta.env.VITE_BACKEND_API_URL}/main/search/${
        params.restId
      }/reviews?page=1`
    );
  }, [params.restId]);

  const handleReivewSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    const dateString = today
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, "-")
      .replace(".", "");

    const updatedFormData = {
      ...formData,
      date: dateString,
      user: currentUser.uuid,
      username: currentUser.nickname || "",
    };

    try {
      // 리뷰 데이터 등록 요청
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/main/search/${
          params.restId
        }/reviews/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );
      const data = await res.json();

      if (res.status !== 201) {
        return;
      } else if (res.status === 201) {
        setReviews((prevReviews) => ({
          ...prevReviews,
          results: [data, ...prevReviews.results],
          count: prevReviews.count + 1,
        }));
      }
    } catch (error) {}

    resetFormData(); // 입력 필드 초기화
  };

  const resetFormData = () => {
    setFormData({
      source: "F",
      username: "",
      comment: "",
      date: "",
      rate: 0,
      user: "",
      restaurant: params.restId || "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const showMoreReviews = () => {
    const nextUrl = reviews.next;
    if (nextUrl !== null) {
      fetchReviews(nextUrl);
    }
  };

  const toggleFavorite = async () => {
    let res;

    try {
      if (isFavorited) {
        // 즐겨찾기에 추가 된 상태라면

        const favoriteInfo = await fetchFavorite();

        const record = favoriteInfo.filter(
          (item) => item.restaurant === params.restId
        );

        if (record.length > 0) {
          res = await fetch(
            `${import.meta.env.VITE_BACKEND_API_URL}/user/favorite/${
              record[0].id
            }`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${currentUser.token}`,
              },
            }
          );
        }
      } else {
        // 즐겨찾기에 추가 되지 않은 상태라면

        res = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/user/favorite/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${currentUser.token}`,
            },
            body: JSON.stringify({
              user: currentUser.uuid,
              restaurant: params.restId,
            }),
          }
        );
      }

      if (res.status === 201 || res.status === 204) {
        setIsFavorited((prev) => !prev);
      }
    } catch (error) {}
  };

  return (
    restaurantInfo && (
      <main className="max-w-4xl mx-auto p-5 bg-gray-50 shadow-xl rounded-lg mt-5 min-h-screen flex flex-col gap-8">
        <div className="flex w-full items-center">
          <div className="w-1/4">
            {/* 왼쪽 공간을 위한 빈 div, 필요에 따라 내용 추가 가능 */}
          </div>
          <h1 className="w-1/2 text-center text-4xl font-bold text-indigo-700 flex justify-center items-center gap-2">
            <div>{restaurantInfo.name}</div>
            <div className="flex items-center justify-center">
              {currentUser && (
                <FaHeart
                  onClick={toggleFavorite}
                  className={`mr-1 ml-1 cursor-pointer ${
                    isFavorited ? "text-red-500" : "text-gray-400"
                  }`}
                  size="0.8em"
                />
              )}
            </div>
          </h1>

          <div className="w-1/4 text-right">
            {restaurantInfo.store_info_last_update && (
              <span className="text-sm text-gray-500">
                최근 업데이트: {restaurantInfo.store_info_last_update}
              </span>
            )}
          </div>
        </div>

        {/* 혼잡도 정보 */}
        <div className="flex flex-col w-full text-center mt-4 py-4 bg-indigo-100 rounded-lg shadow">
          <div className="font-bold text-2xl">관련장소</div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
            <div className="flex items-center text-lg font-semibold text-gray-800">
              <MdLocationOn className="h-5 w-5 text-blue-500" />
              <span className="ml-2">
                {restaurantInfo.congestion_info.location}
              </span>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                restaurantInfo.congestion_info.area_congest === "여유"
                  ? "bg-green-200 text-green-800"
                  : restaurantInfo.congestion_info.area_congest === "보통"
                  ? "bg-yellow-200 text-yellow-800"
                  : restaurantInfo.congestion_info.area_congest === "약간 붐빔"
                  ? "bg-orange-200 text-orange-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {restaurantInfo.congestion_info.area_congest}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {restaurantInfo.congestion_info.area_congest_msg}
          </p>
          <div className="text-sm text-gray-600 mt-2">
            <span>추정 인구: </span>
            <span>
              {restaurantInfo.congestion_info.area_population_min} -
              {restaurantInfo.congestion_info.area_population_max}명
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <span>업데이트 시간: </span>
            <span>
              {formatTimeString(restaurantInfo.congestion_info.request_time)}
            </span>
          </div>
          {/* <div className="flex justify-center gap-8 mt-2">
            <div className="text-sm text-gray-600">
              <span>남성 비율: </span>
              <span>{restaurantInfo.congestion_info.male_rate}%</span>
            </div>
            <div className="text-sm text-gray-600">
              <span>여성 비율: </span>
              <span>{restaurantInfo.congestion_info.female_rate}%</span>
            </div>
          </div> */}
          <div className="p-4">
            <div className="w-full mt-4 bg-gray-200 rounded-full h-6 flex items-center overflow-hidden">
              <div
                style={{
                  width: `${restaurantInfo.congestion_info.male_rate}%`,
                }}
                className="bg-blue-500 h-6 text-right pr-2 flex items-center justify-end text-white font-semibold"
              >
                {restaurantInfo.congestion_info.male_rate}% 남성
              </div>
              <div
                style={{
                  width: `${restaurantInfo.congestion_info.female_rate}%`,
                }}
                className="bg-pink-500 h-6 text-left pl-2 flex items-center text-white font-semibold"
              >
                {restaurantInfo.congestion_info.female_rate}% 여성
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap w-full items-stretch">
          <div className="flex flex-col w-full md:w-1/2 px-4">
            {/* 기본 정보 */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                기본 정보
              </h2>
              <div className="flex flex-col gap-1">
                <div className="text-gray-600 flex items-center gap-1">
                  <MdLocationOn className="h-4 w-4 text-green-700" />
                  <span className="font-semibold">주소:</span>{" "}
                  {restaurantInfo.address}
                </div>
                <p className="text-gray-600 flex items-center gap-1">
                  <MdPhone className="h-4 w-4 text-blue-700" />
                  <span className="font-semibold">전화번호:</span>{" "}
                  {restaurantInfo.phone}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">운영 시간:</span>{" "}
                  {restaurantInfo.open_hours[0]["opening_hours"]}
                </p>
                {restaurantInfo.homepage && (
                  <p className="text-gray-700">
                    <span className="font-semibold">홈페이지:</span>
                    <a
                      href={restaurantInfo.homepage}
                      className="text-indigo-600 hover:underline"
                    >
                      {restaurantInfo.homepage}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full md:w-1/2 px-4 mt-2 sm:mt-0">
            {/* 태그 */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                태그
              </h2>
              <div className="flex flex-wrap">
                {restaurantInfo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm bg-indigo-200 text-indigo-800 m-1 p-2 rounded-full"
                  >
                    {tag.tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="w-full px-4">
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">메뉴</h2>
            {restaurantInfo.menu.length > 0 &&
              restaurantInfo.menu.map((menuInfo, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 last:border-b-0 py-4"
                >
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-2 md:mb-0">
                      <span className="font-semibold text-lg">
                        {menuInfo.menu}
                      </span>
                      <span className="ml-4 text-gray-600">
                        가격: {menuInfo.price}
                      </span>
                    </div>

                    {menuInfo.description && (
                      <div className="text-gray-500 text-sm mt-2 md:mt-0 max-w-md">
                        {menuInfo.description}
                      </div>
                    )}
                  </div>
                  {menuInfo.img && (
                    <img
                      src={menuInfo.img}
                      alt={menuInfo.menu}
                      className="mt-4 max-w-xs rounded-lg"
                    />
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* 리뷰 섹션 */}
        <div className="w-full px-4">
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">리뷰</h2>
            {/* 리뷰 등록 */}
            {currentUser && (
              <form
                onSubmit={handleReivewSubmit}
                className="mb-4 flex flex-col"
              >
                <textarea
                  id="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="리뷰를 작성해주세요."
                />
                {/* 별점 */}
                <div className="flex items-center mt-4">
                  <span className="text-gray-700 mr-2">별점:</span>
                  {[...Array(5)].map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, rate: index + 1 })
                      }
                      className={`text-lg ${
                        index < formData.rate
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="ml-auto mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  리뷰 등록
                </button>
              </form>
            )}

            {/* 리뷰 목록 */}
            <div>
              {reviews.results.length > 0 &&
                reviews.results.map((review, index) => (
                  <div
                    key={index}
                    className="border-t border-gray-200 pt-4"
                  >
                    <p className="text-gray-700">{review.comment}</p>
                    <div className="flex items-center mt-2">
                      {/* 별점 표시 */}
                      {[...Array(5)].map((_, starIndex) => (
                        <span
                          key={starIndex}
                          className={`text-lg ${
                            starIndex < review.rate
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="ml-auto">
                        {review.source} 리뷰, {review.date}
                      </div>
                    </div>
                  </div>
                ))}
              {showMore && (
                <button
                  onClick={showMoreReviews}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  더보기
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  );
}

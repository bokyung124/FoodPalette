import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantItem from "../components/RestaurantItem";

export default function Search() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [restaurantInfos, setRestaurantInfos] = useState({
    results: [],
    count: 0,
    next: null,
    previous: null,
  });
  const [showMore, setShowMore] = useState(false);

  const locationOptions = {
    강남구: [
      "가로수길",
      "강남역",
      "논현역",
      "선릉역",
      "신논현역",
      "압구정로데오거리",
      "역삼역",
      "청담동",
    ],
    강동구: ["고덕역", "광나루한강공원", "암사동", "천호역"],
    강북구: [
      "419카페거리주변",
      "미아사거리역",
      "북서울꿈의숲",
      "북한산우이역",
      "수유리",
      "수유역",
    ],
    강서구: [
      "강서한강공원",
      "김포공항",
      "마곡나루역",
      "발산역",
      "서울식물원역",
    ],
    관악구: ["서울대입구역", "신림역"],
    광진구: ["건대입구역", "군자역", "뚝섬한강공원", "아차산", "어린이대공원"],
    구로구: [
      "고척돔",
      "구로디지털단지역",
      "구로역",
      "남구로역",
      "대림역",
      "신도림역",
    ],
    금천구: ["가산디지털단지역"],
    도봉구: ["쌍문동 맛집거리", "창동"],
    동대문구: ["외대앞", "장한평역", "청량리", "회기역"],
    동작구: ["노량진", "사당역", "총신대입구(이수)역"],
    마포구: [
      "DMC",
      "난지한강공원",
      "망원한강공원",
      "신촌역",
      "연남동",
      "월드컵공원",
      "이대역",
      "합정역",
    ],
    서대문구: ["불광천", "충정로역"],
    서초구: [
      "고속터미널역",
      "교대역",
      "몽마르뜨공원",
      "반포한강공원",
      "방배역",
      "서리풀공원",
      "양재역",
      "잠원한강공원",
      "청계산",
    ],
    성동구: ["뚝섬역", "서울숲공원", "성수카페거리", "왕십리역", "응봉산"],
    성북구: ["성신여대입구역"],
    송파구: ["가락시장", "잠실종합운동장", "잠실한강공원", "장지역"],
    양천구: ["오목교역"],
    영등포구: ["양화한강공원", "여의도", "여의도한강공원", "영등포"],
    용산구: [
      "경리단길",
      "국립중앙박물관",
      "노들섬",
      "삼각지역",
      "서울역",
      "용리단길",
      "용산가족공원",
      "용산역",
      "이촌한강공원",
      "이태원",
      "이태원역",
      "해방촌",
    ],
    은평구: ["연신내역"],
    종로구: [
      "경복궁",
      "광장시장",
      "광화문",
      "광화문광장",
      "낙산공원",
      "덕수궁",
      "동대문역",
      "보신각",
      "북촌한옥마을",
      "서촌",
      "이화마을",
      "익선동",
      "인사동",
      "종묘",
      "창덕궁",
      "청와대",
      "혜화역",
    ],
    중구: ["DDP", "남산공원", "덕수궁길", "정동길"],
  };
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    location: locationOptions["강남구"],
    gu: "강남구",
    area_congest: "여유",
    page: 1,
  });

  const [selectedLocation, setSelectedLocation] = useState([]);

  const fetchRestaurntInfos = async (searchQuery, clickMore = false) => {
    setLoading(true);
    setShowMore(false);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/main/search/?${searchQuery}`
      );
      const newInfos = await res.json();

      if (res.status !== 200) {
        setLoading(false);
        return;
      }

      // 더보기 처리
      if (newInfos.next !== null) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }

      if (clickMore) {
        setRestaurantInfos((preInfos) => ({
          ...newInfos,
          results: [...preInfos.results, ...newInfos.results],
        }));
      } else {
        setRestaurantInfos(newInfos);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      // setLoading((prevLoading) => !prevLoading);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    // 쿼리 파싱
    const searchTermFromUrl = urlParams.get("searchTerm");
    const guFromUrl = urlParams.get("gu");
    const areaCongestFromUrl = urlParams.get("area_congest");
    const pageFromUrl = urlParams.get("page");
    const locationFromUrl = urlParams.get("location");

    if (
      searchTermFromUrl ||
      guFromUrl ||
      areaCongestFromUrl ||
      pageFromUrl ||
      locationFromUrl
    ) {
      // 쿼리 조건 값이 하나라도 있으면
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        gu: guFromUrl || "",
        area_congest: areaCongestFromUrl || "",
        page: pageFromUrl || 1,
        location: locationFromUrl || "",
      });
    }

    setSelectedLocation(locationOptions[sidebardata.gu] || []);

    urlParams.set("searchTerm", searchTermFromUrl || sidebardata.searchTerm);
    urlParams.set("gu", guFromUrl || sidebardata.gu);
    urlParams.set(
      "area_congest",
      areaCongestFromUrl || sidebardata.area_congest
    );
    urlParams.set("page", pageFromUrl || 1);

    const searchQuery = urlParams.toString();
    fetchRestaurntInfos(searchQuery);
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "gu") {
      // 지역구가 변경된 경우, 선택된 지역구에 맞는 위치 상태 업데이트
      const locations = locationOptions[e.target.value] || [];
      setSelectedLocation(locations);
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.value,
      });
    } else {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("gu", sidebardata.gu);
    urlParams.set("area_congest", sidebardata.area_congest);
    urlParams.set("page", sidebardata.page);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    if (showMore) {
      const urlParams = new URLSearchParams(location.search);
      // 쿼리 파싱
      const searchTermFromUrl = urlParams.get("searchTerm");
      const guFromUrl = urlParams.get("gu");
      const areaCongestFromUrl = urlParams.get("area_congest");

      urlParams.set("searchTerm", searchTermFromUrl || "");
      urlParams.set("gu", guFromUrl || "");
      urlParams.set("area_congest", areaCongestFromUrl || "");
      urlParams.set("page", restaurantInfos.next || "");

      const searchQuery = urlParams.toString();

      fetchRestaurntInfos(searchQuery, true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* 검색 사이드 바 */}
      <div className="p-7 border-b-2 md:border-r-4 md:min-h-screen">
        <div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8"
          >
            {/* 검색어 입력 */}
            <div className="flex items-center gap-2">
              <label className="">메뉴명: </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="뭐 먹을까?"
                className="border rounded-lg p-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-2">
              <label>지역구:</label>
              <select
                id="gu"
                value={sidebardata.gu}
                onChange={handleChange}
                className="border-gray-300 rounded-lg p-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">지역구</option>
                <option value="강남구">강남구</option>
                <option value="강동구">강동구</option>
                <option value="강북구">강북구</option>
                <option value="강서구">강서구</option>
                <option value="관악구">관악구</option>
                <option value="광진구">광진구</option>
                <option value="구로구">구로구</option>
                <option value="금천구">금천구</option>
                <option value="노원구">노원구</option>
                <option value="도봉구">도봉구</option>
                <option value="동대문구">동대문구</option>
                <option value="동작구">동작구</option>
                <option value="마포구">마포구</option>
                <option value="서대문구">서대문구</option>
                <option value="서초구">서초구</option>
                <option value="성동구">성동구</option>
                <option value="성북구">성북구</option>
                <option value="송파구">송파구</option>
                <option value="양천구">양천구</option>
                <option value="영등포구">영등포구</option>
                <option value="용산구">용산구</option>
                <option value="은평구">은평구</option>
                <option value="종로구">종로구</option>
                <option value="중구">중구</option>
                <option value="중랑구">중랑구</option>
              </select>
            </div>

            {/* 관련 위치 */}
            <div className="flex items-center gap-2">
              <label htmlFor="location">관련장소: </label>
              <select
                id="location"
                name="location"
                value={sidebardata.location}
                onChange={handleChange}
                className="border-gray-300 rounded-lg p-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">장소 선택</option>
                {selectedLocation.length > 0 &&
                  selectedLocation.map((loc) => (
                    <option
                      key={loc}
                      value={loc}
                    >
                      {loc}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="area_congest">혼잡도: </label>
              <select
                name="area_congest"
                id="area_congest"
                onChange={handleChange}
                value={sidebardata.area_congest}
                className="border-gray-300 rounded-lg p-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">상관없음</option>
                <option value="여유">여유</option>
                <option value="보통">보통</option>
                <option value="약간 붐빔">약간 붐빔</option>
                <option value="붐빔">붐빔</option>
              </select>
            </div>

            {/* 정렬 조건 추가 할 것 */}

            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
              검색
            </button>
          </form>
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          검색 결과 ...
        </h1>
        <div className="flex justify-center sm:justify-normal flex-wrap gap-4 p-7">
          {/* 검색 결과가 없을 경우 */}
          {!loading && restaurantInfos.results.length === 0 && (
            <p>그런 상점은 없네요 ?!</p>
          )}
          {/* 로딩 메세지 */}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              검색 중입니다... 조금만 기다려 주세요
            </p>
          )}
          {/* 샘플 */}
          {restaurantInfos.results.length > 0 &&
            restaurantInfos.results.map((restItem) => (
              <RestaurantItem
                key={restItem.uuid}
                restaurant={restItem}
              />
            ))}

          {/* 더보기 */}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              더보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

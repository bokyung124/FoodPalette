import React, { useEffect, useState } from "react";
import AreaList from "../components/AreaList";
import AreaRankings from "../components/AreaRankings";
import RankingCard from "../components/Rankings";
import RankingCard2 from "../components/Rankings2";

const tmp = {
  crowded_areas: [
    {
      area_name: "강남역",
      population_max: 5000,
    },
    {
      area_name: "서울식물원·마곡나루역",
      population_max: 4500,
    },
    {
      area_name: "강동구",
      population_max: 3500,
    },
    {
      area_name: "도봉구",
      population_max: 2500,
    },
    {
      area_name: "송파구",
      population_max: 1500,
    },
  ],
  quiet_areas: [
    {
      area_name: "송파구",
      population_max: 1500,
    },
    {
      area_name: "도봉구",
      population_max: 2500,
    },
    {
      area_name: "강동구",
      population_max: 3500,
    },
    {
      area_name: "서울식물원·마곡나루역",
      population_max: 4500,
    },
    {
      area_name: "강남역",
      population_max: 5000,
    },
  ],
};

export default function Home() {
  const [crowdedAreas, setCrowdedAreas] = useState(null);
  const [quietAreas, setQuietAreas] = useState(null);
  const [genderRank, setGenderRank] = useState(false);
  const [ageRank, setAgeRank] = useState(false);
  const [strengthLocationRank, setStrengthLocationRank] = useState({});

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/main/congestion/`
        );
        const data = await res.json();

        if (res.status !== 200) {
          return;
        }

        setCrowdedAreas(data.crowded_areas);
        setQuietAreas(data.quiet_areas);
      } catch (error) {}
    };

    const fetchHotCategoryByGender = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/analytics/category/gender/`
        );
        if (res.status !== 200) {
          return;
        }

        const data = await res.json();

        setGenderRank(data);
      } catch (error) {}
      // const data = {
      //   M: [
      //     { category: "갈비1", count: 23416 },
      //     { category: "갈비2", count: 23415 },
      //     { category: "갈비3", count: 23414 },
      //     { category: "갈비4", count: 23413 },
      //     { category: "갈비5", count: 23412 },
      //   ],
      //   Y: [
      //     { category: "이탈리안1", count: 19555 },
      //     { category: "이탈리안2", count: 19554 },
      //     { category: "이탈리안3", count: 19553 },
      //     { category: "이탈리안4", count: 19552 },
      //     { category: "이탈리안5", count: 19551 },
      //   ],
      // };
    };

    const fetchHotCategoryByAge = async () => {
      // const data = {
      //   20: [
      //     { category: "갈비1", count: 23416 },
      //     { category: "갈비2", count: 23415 },
      //     { category: "갈비3", count: 23414 },
      //     { category: "갈비4", count: 23413 },
      //     { category: "갈비5", count: 23412 },
      //   ],
      //   30: [
      //     { category: "갈비1", count: 23416 },
      //     { category: "갈비2", count: 23415 },
      //     { category: "갈비3", count: 23414 },
      //     { category: "갈비4", count: 23413 },
      //     { category: "갈비5", count: 23412 },
      //   ],
      //   40: [
      //     { category: "갈비1", count: 23416 },
      //     { category: "갈비2", count: 23415 },
      //     { category: "갈비3", count: 23414 },
      //     { category: "갈비4", count: 23413 },
      //     { category: "갈비5", count: 23412 },
      //   ],
      // };
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/analytics/category/age/`
        );
        if (res.status !== 200) {
          return;
        }

        const data = await res.json();

        setAgeRank(data);
      } catch (error) {}
    };

    const fetchHotLocationByStrength = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/analytics/score/`
        );
        if (res.status !== 200) {
          return;
        }

        const data = await res.json();

        setStrengthLocationRank(data);
      } catch (error) {}
    };

    fetchLocations();
    fetchHotCategoryByGender();
    fetchHotCategoryByAge();
    fetchHotLocationByStrength();
  }, []);

  return (
    <main className="">
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {/* 인구 혼잡도 정보 */}
        <div>
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-700">
              지금 사람들은?
            </h2>
          </div>
          {/* 인구 혼잡도 데이터 */}
          <div className="flex flex-wrap gap-4">
            {crowdedAreas && (
              <AreaRankings
                // className="w-1/2"
                areas={crowdedAreas}
                title="Top 5 붐비는 지역"
              />
            )}
            {quietAreas && (
              <AreaRankings
                // className="w-1/2"
                areas={quietAreas}
                title="Bottom 5 조용한 지역"
              />
            )}
          </div>
        </div>
        {/* 태그 기반  */}
        <div>
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-700">태그 별</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {strengthLocationRank &&
              Object.entries(strengthLocationRank).map(([key, data]) => (
                <RankingCard2
                  key={key}
                  data={data}
                  title={`${key}`}
                  colorLevel={500}
                />
              ))}
          </div>
        </div>
        {/* 남녀 */}
        <div>
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-700">
              남녀는 다를까?
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {genderRank && (
              <RankingCard
                // className="w-1/2"
                data={genderRank["M"]}
                title="남자"
                colorLevel={600}
              />
            )}
            {genderRank && (
              <RankingCard
                // className="w-1/2"
                data={genderRank["F"]}
                title="여자"
                colorLevel={600}
              />
            )}
          </div>
        </div>
        {/* 나이대  */}
        <div>
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-700">나이대별</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {ageRank &&
              Object.entries(ageRank).map(([key, data]) => (
                <RankingCard
                  key={key}
                  data={data}
                  title={`${key}대`}
                  colorLevel={500}
                />
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}

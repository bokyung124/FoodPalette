import { useEffect, useState } from "react";
import formatTimeString from "../utils/handleTimes";

const AreaRankings = ({ areas, title }) => {
  const [date, setDate] = useState("");

  useEffect(() => {
    const sample = areas[0];
    const requestTime = sample.request_time; // utc 기준

    const formattedDate = formatTimeString(requestTime);

    setDate(formattedDate);
  }, []);

  return (
    <div className=" bg-white rounded-xl shadow-md overflow-hidden w-full sm:w-[330px]">
      {/* <div className=""> */}
      <div className="">
        <div className="bg-indigo-500 text-white font-semibold uppercase tracking-wide text-sm p-3 rounded">
          <div className="flex justify-between items-center">
            <div>{title}</div>
            <div className="text-gray-300 text-xs">{date}</div>
          </div>
        </div>
        <ul className="p-5">
          {areas.map((area, index) => (
            <li
              key={index}
              className="mt-2"
            >
              {index + 1}. {area.area_name} - 최대 인구: 약{" "}
              {area.population_max.toLocaleString()} 명
            </li>
          ))}
        </ul>
      </div>
      {/* </div> */}
    </div>
  );
};

export default AreaRankings;

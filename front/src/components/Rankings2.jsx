const RankingCard = ({ data, title, colorLevel }) => {
  const rankColor = (index) => {
    switch (index) {
      case 0:
        return "text-yellow-400"; // 1위는 금색
      case 1:
        return "text-gray-300"; // 2위는 은색
      case 2:
        return "text-orange-400"; // 3위는 동색
      default:
        return "text-gray-800"; // 나머지는 기본 색상
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full sm:w-[330px]">
        <div
          className={`bg-indigo-${colorLevel} text-white font-bold uppercase tracking-wide text-sm p-4`}
        >
          {title}
        </div>
        <ul className="">
          {data &&
            data.map((item, index) => (
              <li
                key={index}
                className={`flex justify-between items-center p-2 ${
                  index % 2 === 0 ? "bg-indigo-50" : "bg-white"
                }`}
              >
                {/* <span
                className={`font-semibold ${
                  index === 0 ? "text-indigo-500" : ""
                }`}
              >
                #{index + 1}
              </span> */}
                <span className={`font-bold ${rankColor(index)}`}>
                  #{index + 1}
                </span>
                <span className="text-indigo-800 font-medium">
                  {item.keyword}
                </span>
                <span className="text-sm bg-indigo-200 text-indigo-800 py-1 px-2 rounded-full">
                  {item.score.toLocaleString()} 회
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default RankingCard;

// const RankingCard = ({ data, title }) => {
//   const rankColor = (index) => {
//     switch (index) {
//       case 0:
//         return "text-yellow-400"; // 1위는 금색
//       case 1:
//         return "text-gray-300"; // 2위는 은색
//       case 2:
//         return "text-orange-400"; // 3위는 동색
//       default:
//         return "text-gray-800"; // 나머지는 기본 색상
//     }
//   };

//   return (
//     <div className="flex flex-col space-y-4">
//       <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl shadow-lg overflow-hidden w-full sm:w-[330px]">
//         <div className="font-bold uppercase tracking-wide text-sm p-4">
//           {title}
//         </div>
//         <ul className="divide-y divide-gray-200">
//           {data.map((item, index) => (
//             <li
//               key={index}
//               className={`flex justify-between items-center p-3 ${
//                 index < 3 ? "bg-white bg-opacity-20" : "bg-white bg-opacity-10"
//               }`}
//             >
//               <span className={`font-bold ${rankColor(index)}`}>
//                 #{index + 1}
//               </span>
//               <span className="flex-1 text-left pl-4">{item.category}</span>
//               <span className="bg-white bg-opacity-50 text-gray-800 py-1 px-3 rounded-full">
//                 {item.count.toLocaleString()}회
//               </span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default RankingCard;

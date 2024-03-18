const Card = ({ areaName, populationMax }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{areaName}</div>
        <p className="text-gray-700 text-base">최대 인구: {populationMax}</p>
      </div>
    </div>
  );
};

export default Card;

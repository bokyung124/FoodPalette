import Card from "./Card";

const AreaList = ({ areas, title }) => {
  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold my-4">{title}</h2>
      <div className="flex flex-wrap justify-center">
        {areas.map((area, index) => (
          <Card
            key={index}
            areaName={area.area_name}
            populationMax={area.population_max}
          />
        ))}
      </div>
    </div>
  );
};

export default AreaList;

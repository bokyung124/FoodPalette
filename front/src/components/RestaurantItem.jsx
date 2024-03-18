import { MdLocationOn, MdPhone } from "react-icons/md";
import { FaUtensils } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function RestaurantItem({ restaurant }) {
  return (
    <Link to={`/restaurant/${restaurant.uuid}`}>
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg h-[280px] sm:h-[300px] w-[300px] sm:w-[330px]">
        <div className="p-3 flex flex-col gap-2 w-full">
          <h2 className="truncate text-lg font-semibold text-slate-700">
            {restaurant.name}
          </h2>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {restaurant.address}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <MdPhone className="h-4 w-4 text-blue-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {restaurant.phone}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            <strong>카테고리: </strong>
            {restaurant.category.map((cat, index) => (
              <span key={index}>
                {cat.name}
                {index < restaurant.category.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            <strong>태그: </strong>
            {/* <div> */}
            {restaurant.tags &&
              restaurant.tags.map((tag, index) => (
                <span
                  key={index}
                  className="mr-1 bg-green-200 rounded-full px-2 py-1 text-xs"
                >
                  {tag.tag}
                </span>
              ))}
            {/* </div> */}
          </div>
          <div className="mt-2">
            {restaurant.menu.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-200 py-2"
              >
                <FaUtensils className="text-green-500" />
                <p className="flex-1 ml-2 text-sm text-gray-700">{item.menu}</p>
                <p className="text-sm text-gray-900">
                  ₩{parseInt(item.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

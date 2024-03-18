import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { formatErrorMessage } from "../utils/handleErrors.js";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/signup/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.status !== 201) {
        setLoading(false);
        setError(formatErrorMessage(data).message);
        return;
      }

      // 성공
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-4xl mx-auto bg-gray-50">
      <h1 className="text-3xl text-center font-semibold p-4">회원가입</h1>
      <form
        onSubmit={handleSubmit}
        action=""
        className="flex flex-col gap-4 px-10"
      >
        <input
          id="email"
          type="text"
          placeholder="맛집@foodpalatte.com"
          className="border p-3 rounded-lg"
          onChange={handleFormChange}
        />
        <input
          id="nickname"
          type="text"
          placeholder="별명"
          className="border p-3 rounded-lg"
          onChange={handleFormChange}
        />
        <input
          id="name"
          type="text"
          placeholder="이름"
          className="border p-3 rounded-lg"
          onChange={handleFormChange}
        />
        <input
          id="password"
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleFormChange}
        />

        <div className="flex gap-2">
          <div>지역구:</div>
          <select
            id="location"
            value={formData.location}
            onChange={handleFormChange}
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

        <div className="flex gap-2">
          <div>생년월일:</div>
          <input
            type="date"
            id="birth"
            value={formData.birthday}
            onChange={handleFormChange}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex gap-2">
            <span>남자</span>
            <input
              id="gender"
              type="radio"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleFormChange}
            />
          </div>

          <div className="flex gap-2">
            <span>여자</span>
            <input
              id="gender"
              type="radio"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleFormChange}
            />
          </div>
        </div>
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
          {loading ? "처리중..." : "회원가입"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>계정이 있나요?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">로그인</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}

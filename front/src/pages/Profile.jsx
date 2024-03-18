import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice.js";
import { formatErrorMessage } from "../utils/handleErrors.js";

export default function Profile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  // 초기 상태를 설정할 때 currentUser의 정보 사용
  const [formData, setFormData] = useState({
    email: currentUser.email || "",
    nickname: currentUser.nickname || "",
    name: currentUser.name || "",
    location: currentUser.location || "",
    birthday: currentUser.birth || "", // 생년월일의 기본값 설정
    gender: currentUser.gender || "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const dispatch = useDispatch();

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/profile/${
          currentUser.uuid
        }/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${currentUser.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.status !== 200) {
        dispatch(updateUserFailure(formatErrorMessage(data).message));
        return;
      }

      // 업데이트 성공
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/delete/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${currentUser.token}`,
          },
        }
      );

      const data = await res.json();

      if (res.status !== 200) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/logout/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${currentUser.token}`,
          },
        }
      );

      const data = await res.json();
      if (res.status !== 200) {
        dispatch(signOutFailure(data.message));
        return;
      }

      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-4">회원정보</h1>
      <div className="">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            id="email"
            type="text"
            placeholder="맛집@foodpalatte.com"
            className="border p-3 rounded-lg"
            onChange={handleFormChange}
            defaultValue={currentUser.email}
          />
          <input
            id="nickname"
            type="text"
            placeholder="별명"
            className="border p-3 rounded-lg"
            onChange={handleFormChange}
            defaultValue={currentUser.nickname}
          />
          <input
            id="name"
            type="text"
            placeholder="이름"
            className="border p-3 rounded-lg"
            onChange={handleFormChange}
            defaultValue={currentUser.name}
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

          <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
            업데이트
          </button>
        </form>
        <div className="flex justify-between mt-5 mx-2">
          <span
            onClick={handleDeleteUser}
            className="text-red-700 cursor-pointer"
          >
            계정삭제
          </span>
          <span
            onClick={handleSignOut}
            className="text-red-700 cursor-pointer"
          >
            로그아웃
          </span>
        </div>
      </div>
    </div>
  );
}

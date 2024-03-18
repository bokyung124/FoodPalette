import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatErrorMessage } from "../utils/handleErrors.js";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice.js";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { error, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.status !== 200) {
        dispatch(signInFailure(formatErrorMessage(data).message));
        return;
      }

      // 로그인 성공시
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold p-4">로그인</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <input
          id="email"
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          id="password"
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="
          bg-slate-700
          text-white
          p-3
          rounded-lg
          uppercase
          hover:opacity-95
          "
        >
          {loading ? "처리중..." : "로그인"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>계정이 없나요?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">회원가입</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}

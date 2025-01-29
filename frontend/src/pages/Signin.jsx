import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

export function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();
  return (
    <div className="flex flex-col items-center h-screen justify-centerbg-gray-100">
      <div className="flex flex-col items-center h-screen justify-center">
        <div className="font-bold text-5xl text-gray-800 mb-2 hover:text-blue-500 transition duration-300 ease-in-out">
          <span className="text-blue-500">EZ</span>Pay
        </div>
        <h2 className="text-slate-500 text-md pt-1 px-4 pb-4">
          Enter your information to Sign in
        </h2>
        <div className="flex flex-col">
          <label className="formlabel">Email</label>
          <input
            className="forminput"
            id="em"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          <label className="formlabel">Passwrod</label>
          <input
            className="forminput"
            id="pd"
            type="password"
            placeholder="Enter your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <button
            onClick={() =>
              axios({
                method: "post",
                url: "https://ezpay-4du6.onrender.com/api/v1/user/signin",
                headers: {
                  "Content-Type": "application/json", // Ensure Content-Type is set
                },
                data: {
                  username,
                  password,
                },
              })
                .then((res) => {
                  if (res.status === 200) {
                    localStorage.setItem("token", res.data.token);
                    Navigate("/dashboard");
                  }
                })
                .catch((err) => {
                  alert(err.response.data.message);
                })
            }
            className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-5"
          >
            Sign In
          </button>
        </div>
        <label> Don't have an account</label>
        <a className=" underline font-bold" href="/signup">
          Sign up
        </a>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export function Signup() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <div className="font-bold text-5xl text-gray-800 mb-2 hover:text-blue-500 transition duration-300 ease-in-out">
        <span className="text-blue-500">EZ</span>Pay
      </div>{" "}
      <h2 className="text-slate-500 text-md pt-1 px-4 pb-4">
        Enter your information to create an account
      </h2>
      <div className="flex flex-col">
        <label className="formlabel">First Name</label>
        <input
          className="forminput"
          id="fn"
          type="text"
          placeholder="Enter first name"
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        ></input>
        <label className="formlabel">Last Name</label>
        <input
          className="forminput"
          id="ln"
          type="text"
          placeholder="Enter last name"
          onChange={(e) => {
            setLastName(e.target.value);
          }}
        ></input>
        <label className="formlabel">Email</label>
        <input
          className="forminput"
          id="em"
          type="text"
          placeholder="Enter your email"
          onChange={(e) => {
            setusername(e.target.value);
          }}
        ></input>
        <label className="formlabel">Password</label>
        <input
          className="forminput"
          id="pd"
          type="password"
          placeholder="Enter your password"
          onChange={(e) => {
            setpassword(e.target.value);
          }}
        ></input>
        <button
          onClick={() =>
            axios({
              method: "post",
              url: "https://ezpay-4du6.onrender.com/api/v1/user/signup",
              headers: {
                "Content-Type": "application/json", // Ensure Content-Type is set
              },
              data: {
                firstname,
                lastname,
                username,
                password,
              },
            })
              .then((res) => {
                if (res.status === 201) {
                  localStorage.setItem("token", res.data.token);
                  alert("Account Created Successfully");
                  navigate("/");
                }
              })
              .catch((err) => {
                alert(err.response.data.message);
              })
          }
          className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-5"
        >
          Sign Up
        </button>
      </div>
      <label>Already have an account ? </label>
      <a className=" underline font-bold" href="/">
        Sign in
      </a>
    </div>
  );
}

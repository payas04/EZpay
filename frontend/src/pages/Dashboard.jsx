import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { SendMoney } from "./SendMoney";
export function Dashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);
  return (
    <div className="h-screen overflow-y-auto bg-gray-100">
      <AppBar />
      <YourBalance />
      <Users />
    </div>
  );
}
function Users() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState();
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:3000/api/v1/user/bulk",
      params: { filter },
    })
      .then((res) => {
        if (res.status === 200) {
          setUsers(res.data.users);
        }
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Error fetching users");
      });
  }, [filter]); //call only runs when `filter` changes

  return (
    <div>
      <div className="font-bold text-lg mx-8 my-2 ">
        Users
        <input
          className="p-1 ml-7 hover:border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 "
          type="text"
          placeholder="Search Users..."
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        ></input>
      </div>
      <div>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}

function User({ user }) {
  const navigate = useNavigate();
  //console.log(user);
  return (
    <div className="flex justify-between items-center mx-8 my-2  ">
      <div className="flex gap-4 ">
        <div className="text-center border-2 rounded-full h-12 w-12 p-2 bg-slate-200">
          {user.firstname[0]}
        </div>
        <div className="p-3">
          {user.firstname} {user.lastname}
        </div>
      </div>

      <button
        onClick={() => {
          navigate("/sendMoney", { state: { user } });
        }}
        className=" w-40 rounded-md bg-gray-800 hover:bg-gray-900 text-white py-2 font-medium px-5 hover:cursor-pointer my-2 focus:outline-none focus:ring-4 focus:ring-gray-300"
      >
        Send Money
      </button>
    </div>
  );
}
function YourBalance() {
  const [balance, setBalance] = useState();
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:3000/api/v1/account/balance",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setBalance(res.data.balance.toFixed(2));
      })
      .catch((err) => {
        alert(err.error.message);
      });
  }, []);

  return (
    <div className="flex justify-between p-4 bg-white mx-6 mb-5 rounded-lg shadow-md">
      <div className="font-semibold text-lg text-gray-600">Your Balance</div>
      <div className="text-2xl font-bold text-blue-600">Rs {balance}</div>
    </div>
  );
}
function AppBar() {
  const [user, setUser] = useState();
  const token = localStorage.getItem("token");
  const [showSignout, setSignout] = useState(false);
  const Navigate = useNavigate();
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:3000/api/v1/user/me",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        alert(err.error.message);
      });
  }, []);
  return (
    <div className="h-14  flex justify-between bg-blue-50 p-2 px-5 shadow-lg rounded-xl mx-5 mb-5 hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="font-bold text-3xl text-gray-800 mb-2  hover:text-blue-500 transition duration-300 ease-in-out">
        <span className="text-blue-500">EZ</span>Pay
      </div>
      <div className="flex">
        <div className="flex flex-col justify-center h-full mr-5 ">Hello</div>

        <div
          className="relative rounded-full h-10 w-10 bg-slate-200 flex justify-center  cursor-pointer"
          onClick={() => {
            setSignout(!showSignout);
          }}
        >
          <div className="flex flex-col justify-center h-full text-xl ">
            {user?.firstName[0]}
          </div>
          {showSignout && (
            <div
              className="absolute -bottom-14 right-6 bg-slate-800 text-white rounded-lg p-4 w-24 "
              onClick={() => {
                localStorage.removeItem("token"); // Remove token
                alert("Logged out!");
                Navigate("/");
              }}
            >
              Sign out
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
export function SendMoney() {
  const location = useLocation();
  // console.log(location);
  const user = location.state?.user;
  // console.log(user);
  const [amount, setAmount] = useState();
  const token = localStorage.getItem("token");
  // console.log(token);
  return (
    <div className="h-screen grid place-content-center">
      <div className="border-2 shadow-lg p-8">
        <h1 className="font-bold text-3xl text-center mb-10 "> Send Money </h1>
        <div className="flex gap-4">
          <div className=" flex justify-center items-center rounded-full h-14 w-14 border-2 bg-green-500 text-white">
            <div>{user.firstname[0]}</div>
          </div>
          <h2 className="flex items-center font-bold text-2xl">
            {user.firstname} {user.lastname}
          </h2>
        </div>
        <div className="text-base font-bold mb-2 mt-2"> Amount (in Rs) </div>

        <input
          type="number"
          value={amount}
          class=" mb-5 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  p-2.5 hover:"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
        <button
          class="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white hover:bg-green-600"
          onClick={() => {
            axios({
              method: "post",
              url: "http://localhost:3000/api/v1/account/transfer",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              data: {
                to: user.userId,
                amount,
              },
            })
              .then((res) => {
                if (res.status === 200) {
                  alert("Transfer Successful");
                  setAmount("");
                }
              })
              .catch((err) => {
                alert(err.response.data.message);
              });
          }}
        >
          Initiate Transfer
        </button>
      </div>
    </div>
  );
}

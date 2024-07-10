import axios from "axios";
import { loader } from "../assets";
import { useEffect, useState } from "react";

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getalluser = async () => {
      const res = await axios.get("https://critiqall-backend.onrender.com/getall");
      const user = res.data;
      var alld = [];
      for (var i = 0; i < user.length; i++) {
        const res2 = await axios.get("https://critiqall-backend.onrender.com/getbalance", {
          params: { pkey: user[i].pkey },
        });
        alld.push({ name: user[i].name, balance: res2.data.balance });
      }
      for (var k = 0; k < alld.length; k++) {
        for (var j = k + 1; j < alld.length; j++) {
          if (alld[k].balance < alld[j].balance) {
            var temp = alld[k];
            alld[k] = alld[j];
            alld[j] = temp;
          }
        }
      }
      setData(alld);
      setLoading(false);
    };
    getalluser();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      {loading ? (
        <div>
          <img className="h-24 w-24" src={loader} alt="" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full rounded-lg text-white">
            <thead>
              <tr className="bg-gray-500 text-xl">
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Balance</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user, k) => (
                <tr key={user.name} className="even:bg-gray-800">
                  <td className=" px-4 py-2">{k + 1}</td>
                  <td className=" px-4 py-2">{user.name}</td>
                  <td className=" px-4 py-2">{user.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

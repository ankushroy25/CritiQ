import { useStateAuth } from "../context/StateProvider";

const Profile = () => {
  const { userData } = useStateAuth();
  return (
    <div className="text-white">
      Profile
      <div className="flex flex-wrap justify-between items-center">
        <div>
          <p>Name : {userData.name}</p>
          <p>Description : {userData.description}</p>
          <p>Email : {userData.email}</p>
          <p>Wallet Address : {userData.walletAddress} </p>
        </div>
        <div className="mr-[20%]">
          <img src={userData.imageUrl} alt="Cover" className="h-64 w-64" />
        </div>
      </div>
    </div>
  );
};

export default Profile;

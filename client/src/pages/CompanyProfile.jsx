import { useStateAuth } from "../context/StateProvider";

const Profile = () => {
  const { userData } = useStateAuth();
  return (
    <div className="bg-[#1c1c24] text-white p-8 rounded-xl font-epilogue shadow-lg max-w-4xl mx-auto my-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
      <div className="flex flex-wrap justify-between items-center gap-8">
        <div className="space-y-4">
          <p className="text-lg">
            <span className="font-semibold text-gray-400">Name</span> <br />{" "}
            {userData.name}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-400">Description</span>{" "}
            <br />
            {userData.description}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-400">Email</span>
            <br /> {userData.email}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-400">Wallet Address</span>
            <br /> {userData.walletAddress}
          </p>
        </div>
        <div className="flex-shrink-0">
          <img
            src={userData.imageUrl}
            alt="Profile"
            className="h-64 w-64 rounded-full object-cover shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;

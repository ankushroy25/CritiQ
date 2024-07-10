import { useEffect, useState } from "react";
import { loader } from "../assets";
import CompanyCard from "../components/CompanyCard";
import { useStateAuth } from "../context/StateProvider";

const CompanyHomepage = () => {
  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { download, fetchProductsByOwner } = useStateAuth();

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const data = await fetchProductsByOwner();
      if (data.length > 0) setProducts(data);
      setLoading(false);
    };
    getProducts();
  }, [fetchProductsByOwner]);

  return (
    <div>
      {!download && (
        <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
          Please install metamask
        </h1>
      )}
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        View your products ({products.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && (products.length === 0 || products == null) && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No products to display
          </p>
        )}

        {!isLoading &&
          products.length > 0 &&
          products.map((product) => (
            <CompanyCard key={product.id} {...product} />
          ))}
      </div>
    </div>
  );
};

export default CompanyHomepage;

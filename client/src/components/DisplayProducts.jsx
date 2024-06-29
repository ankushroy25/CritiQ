import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { loader } from "../assets";

const DisplayProducts = ({ title, isLoading, products }) => {
  const navigate = useNavigate();
  const handleNavigate = (product) => {
    navigate(`/product-details/${product.id}`, { state: product });
  };

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({products.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && products.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No products to display
          </p>
        )}

        {!isLoading &&
          products.length > 0 &&
          products.map((product) => (
            <>
            {(product.status==="ongoing")&&
            <ProductCard
              key={product.id}
              {...product}
              handleClick={() => handleNavigate(product)}
            />}
            </>
          ))}
      </div>
    </div>
  );
};

export default DisplayProducts;

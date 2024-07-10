import FormComponent from "../components/FormComponent";

const CreateProduct = () => {
  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          List a Product
        </h1>
      </div>

      <FormComponent />
    </div>
  );
};

export default CreateProduct;

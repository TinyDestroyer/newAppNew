import React from "react";
import ProductForm from "../../../components/ProductForm";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-semibold text-primary-foreground py-10 w-3/4">
        Enter the Details of Product
      </div>
      <ProductForm />
    </div>
  );
};

export default page;

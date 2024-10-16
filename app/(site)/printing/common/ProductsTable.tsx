import { Line, Row, Text } from "react-thermal-printer";
import { ProductInOrderType } from "../../types/ProductInOrderType";

const ProductsTable = (products: ProductInOrderType[]) => {
  products.map((product) => {
    <>
      <Row
        left={product.quantity + " " + product.product.code + " " + product.product.desc}
        right={"eur " + product.quantity * product.total}
      />
    </>;
  });
  <Line />;
};

export default ProductsTable;

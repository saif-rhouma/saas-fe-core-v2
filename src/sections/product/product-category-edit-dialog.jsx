import ProductCategoryCreateDialog from './product-category-create-dialog';

const ProductCategoryEditDialog = ({ category, open, onClose, handler }) => (
  <ProductCategoryCreateDialog
    productCategory={category}
    open={open}
    onClose={onClose}
    handler={handler}
  />
);
export default ProductCategoryEditDialog;

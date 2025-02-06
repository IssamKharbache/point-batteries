import { ProductData } from "@/components/backend/table/TableActions";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
interface ProductSpecificationProps {
  product: ProductData;
}
const ProductSpecification = ({ product }: ProductSpecificationProps) => {
  return (
    <Table>
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell className="font-medium p-5">Marque</TableCell>
          <TableCell>{product.marque}</TableCell>
        </TableRow>
        <TableRow className="hover:bg-transparent">
          <TableCell className="font-medium p-5">Voltage</TableCell>
          <TableCell>{product.voltage} v</TableCell>
        </TableRow>
        <TableRow className="hover:bg-transparent">
          <TableCell className="font-medium p-5">Capacité</TableCell>
          <TableCell>{product.capacite} Ah</TableCell>
        </TableRow>

        <TableRow className="hover:bg-transparent">
          <TableCell className="font-medium p-5 ">
            Designation du produit
          </TableCell>
          <TableCell>{product.designationProduit}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ProductSpecification;

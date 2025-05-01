import ModalMenu from "../modal/ModalMenu";
import TableStockMenu from "../table/TableStockMenu";

const Menu = () => {
  return (
    <div className="h-96 w-full mt-3 flex flex-col">
      <div className="w-full flex justify-end">
        <ModalMenu />
      </div>

      <div className="mt-3 h-11/12 overflow-y-auto w-full ">
        <TableStockMenu />
      </div>
    </div>
  );
};

export default Menu;

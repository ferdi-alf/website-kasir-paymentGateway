import ModalUser from "../modal/ModalUser";
import TableUsers from "../table/TableUsers";

const UserMenu = () => {
  return (
    <div className="h-96 w-full mt-3 flex flex-col">
      <div className="w-full flex justify-end">
        <ModalUser />
      </div>

      <div className="mt-3 h-11/12 overflow-y-auto w-full ">
        <TableUsers />
      </div>
    </div>
  );
};

export default UserMenu;

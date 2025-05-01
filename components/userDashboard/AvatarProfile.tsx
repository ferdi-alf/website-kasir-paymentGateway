/* eslint-disable @next/next/no-img-element */
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
interface AvatarProps {
  avatar: string;
}

const AvatarPorfile = ({ avatar }: AvatarProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  return (
    <div className="relative   rounded-full ">
      <img
        className=" bg-amber-800 lg:h-72 lg:w-72 md:h-40 md:w-40 h-60 w-60  rounded-full object-cover"
        alt="User Avatar"
        src={preview || avatar}
      />
      <label
        htmlFor="avatar-profile"
        className="p-1 rounded-full absolute cursor-pointer hover:bg-gray-100 bg-white border right-10 md:right-0 lg:right-9  bottom-5"
      >
        <EditIcon />
      </label>
      <input
        onChange={handleImageChange}
        type="file"
        className="hidden"
        id="avatar-profile"
        name="file"
      />
    </div>
  );
};

export default AvatarPorfile;

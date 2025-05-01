/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

const ModalLayout = ({
  title,
  textButton,
  children,
  state,
}: Readonly<{
  textButton: string;
  title: string;
  children: React.ReactNode;
  state: any;
}>) => {
  const [modal, setModal] = useState(false);

  const handleClick = () => {
    setModal(!modal);
  };

  useEffect(() => {
    if (state?.success) {
      setModal(false);
    }
  }, [state]);

  return (
    <div className="">
      <button
        onClick={handleClick}
        data-modal-target="authentication-modal"
        data-modal-toggle="authentication-modal"
        className="block text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        type="button"
      >
        {textButton}
      </button>

      <div
        id="authentication-modal"
        tabIndex={-1}
        aria-hidden="true"
        className={`${
          modal ? "flex" : "hidden"
        } overflow-y-auto overflow-x-hidden bg-black/40 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0  h-screen`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t  border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 ">{title}</h3>
              <button
                type="button"
                onClick={handleClick}
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                data-modal-hide="authentication-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <div className="space-y-4">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLayout;

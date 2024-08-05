import React, { memo } from "react";
import { CgSpinner } from "react-icons/cg";
const Button = ({
    children,
    handleOnClick,
    style,
    fw,
    type = "button",
    disabled,
}) => {
    return (
        <button
            type={type}
            className={
                style
                    ? style
                    : `px-4 py-2 rounded-none text-white flex items-center justify-center bg-main text-semibold my-2 hover:bg-red-500 ${
                          fw ? "w-full" : "w-fit"
                      } ${
                          disabled
                              ? "bg-red-200 cursor-not-allowed hover:bg-red-200"
                              : ""
                      }`
            }
            onClick={() => {
                handleOnClick && handleOnClick();
            }}
            disabled={disabled}
        >
            {/* {disabled && (
                <span className="animate-spin">
                    <CgSpinner size={18} />
                </span>
            )} */}
            {children}
        </button>
    );
};

export default memo(Button);

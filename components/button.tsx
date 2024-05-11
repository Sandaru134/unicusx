import React from 'react';

const CustomButton = ({ title, width, color, textColor, bgColor }: { title: string; width: string; color: string; textColor: string, bgColor: string  }) => {
    return (
        <div>
            <button disabled className={`w-${width} pb-0.5 pl-2 pr-2 pt-0.5 ${color} ${bgColor} ${textColor} rounded-sm text-sm`}>
                {title}
            </button>
        </div>
    );
};

export default CustomButton;

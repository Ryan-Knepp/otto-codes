import React from "react";

const Icon = ({
    style = {},
    width = "100%",
    className = ""
}) => (
        <svg
            clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.4142"
            version="1.1"
            viewBox="0 0 24 24"
            style={style}
            className={className}
            width={width}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="m10 4h-6c-1.11 0-2 0.89-2 2v12c0 1.097 0.903 2 2 2h16c1.097 0 2-0.903 2-2v-10c0-1.11-0.9-2-2-2h-8l-2-2z" fill="#42a5f5" fillRule="nonzero" /><path d="m20.811 8.5204-5.9881 5.5056-3.3464-2.5223-1.383 0.80494 3.2986 3.0311-3.2986 3.0311 1.383 0.80733 3.3464-2.5223 5.9881 5.5032 2.9212-1.4188v-10.801zm0 3.6211v6.3966l-4.2445-3.1983z" fill="#bbdefb" strokeWidth=".97421" />
        </svg>
    );

export default Icon;

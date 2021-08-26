import React from "react";
import PropTypes from "prop-types";

import CoverFallback from "./fallback";

function VideoCover({
  id,
  className,
  style,
  source,
  forceFallback,
  videoOptions,
  ...rest
}) {
  const styleProps = {
    width: "100%",
    height: "100%",
    ...style,
    objectFit: "cover",
  };

  if (typeof window != "undefined") {
    if (
      forceFallback ||
      (typeof window !== "undefined" &&
        /MSIE|Trident|Edge/.test(window.navigator.userAgent))
    ) {
      return <CoverFallback {...rest} />;
    }
  }

  return (
    <video
      id={id ? id : "video"}
      className={className}
      style={styleProps}
      {...videoOptions}
      muted
    >
      {source?.map((item, i) => (
        <source key={i} src={item.src} type={item.type} />
      ))}
    </video>
  );
}

VideoCover.propTypes = {
  forceFallback: PropTypes.bool,
  remeasureOnWindowResize: PropTypes.bool,
  onFallbackDidMount: PropTypes.func,
  onFallbackWillUnmount: PropTypes.func,
  videoOptions: PropTypes.object,
  style: PropTypes.object,
  className: PropTypes.string,
  source: PropTypes.array,
};

VideoCover.defaultProps = {
  forceFallback: false,
  remeasureOnWindowResize: false,
};

export default VideoCover;

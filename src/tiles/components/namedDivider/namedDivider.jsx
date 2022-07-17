import React from "react";
import "./styles.scss";

export default function NamedDivider(props) {
  return (
    <div className="named-divider">
      <div className="named-divider__line" />
      {props.name && <div className="named-divider__header">{props.name}</div>}
      <div className="named-divider__line" />
    </div>
  );
}

import React from "react"
import PropTypes from "prop-types"

// import styles from "./BaseLayout.module.scss"

const BaseLayout = props => {
  return (
    <div className={props.wrapperStyle}>
      { props.children }
    </div>
  );
};

BaseLayout.defaultProps = {
  wrapperStyle: "wrapper"
}

BaseLayout.propTypes = {
  wrapperStyle: PropTypes.string,
  children: PropTypes.node.isRequired
}

export default BaseLayout

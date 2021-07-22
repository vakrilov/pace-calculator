import React from "react";
import $ from "jquery";
import "round-slider";
import "round-slider/dist/roundslider.min.css";

class RoundSlider extends React.Component<any, any> {
  private $rsEle: any;
  componentDidMount() {
    this.$rsEle = $(this.refs.roundSlider);
    const options = Object.assign({ svgMode: true }, this.props);
    this.$rsEle.roundSlider(options);
  }

  // This way, ReactJS will never re-render our component,
  // and jQuery will be responsible for all updates.
  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps: any) {
    // here we have considered the value property alone
    // if you are going to dynamically update any other properties
    // then consider those properties also here

    if (nextProps.value !== this.props.value) {
      this.$rsEle.roundSlider("option", "value", nextProps.value);
    }
  }

  render() {
    return <div ref="roundSlider" />;
  }

  componentWillUnmount() {
    this.$rsEle.roundSlider("destroy");
  }
}

export default RoundSlider;

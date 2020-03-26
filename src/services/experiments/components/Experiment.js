import React, { Component } from 'react';
import { string, node, bool, object } from 'prop-types';
import styled from 'styled-components';
import { prop } from 'styled-tools';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import { enableExperimentsDebugger, isProd } from 'sly/config';
import SlyEvent from 'sly/services/helpers/events';
import { size } from 'sly/components/themes';
import { getExperiment } from 'sly/store/selectors';
import { selectedExperimentVariants } from 'sly/services/experiments/helpers';
import { ExperimentContext } from 'sly/services/experiments/components/Context';
import withUser from 'sly/services/api/withUser';
import { uuidAux as uuidAuxPropType } from 'sly/propTypes/user';

const DebugWrapper = styled.div`
  position: relative;
  outline: ${size('border.regular')} solid ${prop('color')};

  :hover > span {
    display: block;
  }
`;

const mapStateToProps = (state, ownProps) => {
  const { name } = ownProps;
  const variantKey = getExperiment(state, name);

  return {
    variantKey,
  };
};

@withUser
@withRouter
@connect(mapStateToProps)

export default class Experiment extends Component {
  static propTypes = {
    name: string.isRequired,
    uuidAux: uuidAuxPropType,
    disabled: bool,
    defaultVariant: string,
    variantKey: string,
    children: node,
    location: object,
  };

  static defaultProp = {
    disabled: false,
  };

  state = {
    selected: null,
  };

  variants = [];

  constructor(props) {
    super(props);
    // read query string: ?experiments=Organisms_Concierge_Calendly:original_flow,Organisms_Footer_Calendly:original_flow
    this.queryString = {};
    if (!isProd) {
      const { location } = props;
      const { search } = location;
      const { experiments = '' } = queryString.parse(search);
      this.queryString = experiments
        .split(',')
        .reduce((obj, e) => {
          const [key, value] = e.split(':');
          obj[key] = value;
          return obj;
        }, {});
    }

  }

  addVariant = (variant) => {
    if (this.variants.indexOf(variant) === -1) {
      this.variants.push(variant);
    }
  };

  componentDidMount() {
    this.sendExperimentEvent('view_experiment');
  }

  componentDidUpdate({ disabled }) {
    const { disabled: newDisabled, uuidAux } = this.props;
    console.log('uuidAux', uuidAux);
    // if an experiment is disabled or enabled by updating prop then
    // also send view_experiment event
    if (newDisabled !== disabled) {
      this.sendExperimentEvent('view_experiment');
    }
  }

  componentWillUnmount() {
    this.sendExperimentEvent('complete_experiment');
  }

  sendExperimentEvent(action) {
    const { disabled, name } = this.props;
    if (!disabled) {
      const event = {
        action, category: name, label: this.selectedVariant, value: 1, nonInteraction: true,
      };
      SlyEvent.getInstance().sendEvent(event);
    }
  }

  render() {
    const {
      children, name, variantKey, defaultVariant, disabled,
    } = this.props;
    // this.selectedVariant = variantKey || defaultVariant;
    // if (disabled) {
    //   this.selectedVariant = defaultVariant;
    // }
    // if (this.experimentsOverrides[name]) {
    //   this.selectedVariant = this.experimentsOverrides[name];
    //   if (enableExperimentsDebugger) {
    //     console.info(`[Experiments] overriding experiment ${name} using query parameter. specified variant will be selected.`);
    //   }
    // }
    // if (!variantKey && enableExperimentsDebugger) {
    //   console.info(`[Experiments] failed evaluating experiment ${name}. defaultVariant will be selected.`);
    // }
    // let childrenArray = Array.isArray(children) ? children : [children];
    // childrenArray = childrenArray.filter(a => a); // To remove all false values
    // let [variant] = childrenArray;
    // if (this.selectedVariant) {
    //   const variantChildren = childrenArray.filter(c => c.props.name === this.selectedVariant);
    //   if (variantChildren.length === 0 && enableExperimentsDebugger) {
    //     console.info(`[Experiments] experiment ${name} has no valid Variant ${this.selectedVariant}.`);
    //     return null;
    //   }
    //   variant = variantChildren[0] || null;
    // } else {
    //   this.selectedVariant = variant.props.name;
    //   if (enableExperimentsDebugger) {
    //     console.info(`[Experiments] experiment ${name} has no default variant. first variant will be selected.`);
    //   }
    // }
    // if (enableExperimentsDebugger) {
    //   console.info(`[Experiments] experiment ${name} has variant ${this.selectedVariant}.`);
    // }
    // this.selectedVariantRendered = true;
    // if (!disabled) {
    //   selectedExperimentVariants[name] = this.selectedVariant;
    // }
    // if (variant && enableExperimentsDebugger) {
    //   const color = `#${Math.random().toString(16).slice(2, 8)}`;
    //   return (
    //     <DebugWrapper color={color} title={`Experiment ${name}: variant is ${this.selectedVariant}`}>
    //       {variant}
    //     </DebugWrapper>
    //   );
    // }
    //
    // return variant;
    const context = {
      addVariant: this.addVariant,
      selected: this.queryString[name] || this.state.selected,
      variants: this.variants,
    };

    return (
      <ExperimentContext.Provider value={context}>
        {children}
      </ExperimentContext.Provider>
    );
  }
}


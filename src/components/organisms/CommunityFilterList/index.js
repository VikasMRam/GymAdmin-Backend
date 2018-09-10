import React, { Fragment } from 'react';
import styled from 'styled-components';
import { object, func, bool, number } from 'prop-types';
import { palette } from 'styled-theme';
import { ifProp } from 'styled-tools';

import { size } from 'sly/components/themes';
import CollapsibleSection from 'sly/components/molecules/CollapsibleSection';
import Field from 'sly/components/molecules/Field';
import Radio from 'sly/components/molecules/Radio';
import IconButton from 'sly/components/molecules/IconButton';
import { Link, Box, Hr, Button, Map } from 'sly/components/atoms';

import {
  tocs,
  budgets,
  sizes,
  filterLinkPath,
  getFiltersApplied,
  getEvtHandler,
} from 'sly/services/helpers/search';

const MapWrapper = styled.div`
  width: ${size('map.search.tiny.width')};
  height: ${size('map.search.tiny.height')};
  background: ${palette('grayscale', 2)};
`;
const MapContainerElement = styled.div`
  width: 100%;
  height: 100%;

  * {
    cursor: default!important;
  }
`;
const StyledWrapper = styled.div`
  padding-top: ${size('spacing.large')};

  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    width: ${size('layout.col4')};
  }
`;

const StyledBox = styled(Box)`
  padding: ${size('spacing.large')};
  width: ${size('layout.col3')};
`;

const StyledLink = styled(Link)`
  display: flex;
  margin-bottom: ${size('spacing.regular')};
  color: ${palette('slate', 0)};

  span {
    margin-right: ${size('spacing.small')};
  }
`;

const MapButtonWrapper = styled.div`
  position: relative;
  text-align: center;
  margin-bottom: ${size('spacing.large')};

  img {
    width: 100%;
  }

  button {
    border: ${size('border.regular')} solid ${palette('grayscale', 2)};
  }

  ${ifProp('isMapView', '', `
    button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `)};
`;
const StyledHr = styled(Hr)`
  margin-bottom: ${size('spacing.regular')};
`;

const getSortHandler = (origFn) => {
  return (uiEvt) => {
    const changedParams = { sort: uiEvt.target.value };
    origFn({ origUiEvt: uiEvt, changedParams });
  };
};

const generateRadioLink = (elem, type, path, selected) => (
  <StyledLink
    to={path}
    id={`${type}-${elem.value}`}
    key={`${type}-${elem.value}`}
    selected={selected}
  >
    <Radio checked={selected} />{elem.label}
  </StyledLink>
);

export const ClearAllButton = styled(Button)`
  color: ${palette('primary', 0)};

  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    display: none;
  }
`;

const CommunityFilterList = ({
  toggleMap,
  isMapView,
  isModalView,
  searchParams,
  onFieldChange,
  onParamsRemove,
  latitude,
  longitude,
}) => {
  const tocFields = tocs.map((elem) => {
    const { path, selected } = filterLinkPath(searchParams, { toc: elem.value });
    return generateRadioLink(elem, 'toc', path, selected);
  });
  const budgetFields = budgets.map((elem) => {
    const { path, selected } = filterLinkPath(searchParams, { budget: elem.value });
    return generateRadioLink(elem, 'budget', path, selected);
  });
  const sizeFields = sizes.map((elem) => {
    const { path, selected } = filterLinkPath(searchParams, { size: elem.value });
    return generateRadioLink(elem, 'size', path, selected);
  });
  const { sort } = searchParams;
  const WrapperElement = (isModalView) ? StyledWrapper : StyledBox;
  const center = {
    latitude,
    longitude,
  };
  const defaultZoom = 13;

  const filtersApplied = getFiltersApplied(searchParams);

  return (
    <WrapperElement>
      {!isModalView &&
        <Fragment>
          {/* TODO: replace with <> </> after upgrading to babel 7 & when eslint adds support for jsx fragments */}
          <MapButtonWrapper isMapView={isMapView}>
            {isMapView && toggleMap &&
              <IconButton icon="list" onClick={toggleMap} palette="secondary" ghost>
                View List
              </IconButton>
            }
            {!isMapView &&
              <Fragment>
                {/* TODO: replace with <> </> after upgrading to babel 7 & when eslint adds support for jsx fragments */}
                <MapWrapper>
                  <Map
                    center={center}
                    defaultZoom={defaultZoom}
                    zoomControl={false}
                    fullscreenControl={false}
                    draggable={false}
                    containerElement={<MapContainerElement />}
                  />
                </MapWrapper>
                <IconButton icon="map" onClick={toggleMap} palette="secondary" ghost>
                  View Map
                </IconButton>
              </Fragment>
            }
          </MapButtonWrapper>
          <StyledHr />
        </Fragment>
      }
      <CollapsibleSection size="small" title="Type of care" noHr>
        {tocFields}
      </CollapsibleSection>
      <CollapsibleSection size="small" title="Budget" noHr>
        {budgetFields}
      </CollapsibleSection>
      <CollapsibleSection size="small" title="Size" noHr>
        {sizeFields}
      </CollapsibleSection>
      <CollapsibleSection size="small" title="Sort" noHr>
        <Field
          name="Sort"
          type="select"
          value={sort}
          onChange={getSortHandler(onFieldChange)}
        >
          <option value="distance">
            Distance
          </option>
          <option value="price-l-h">
            Price: Low to High
          </option>
          <option value="price-h-l">
            Price: High to Low
          </option>
          <option value="relevance">
            Relevance
          </option>
        </Field>
      </CollapsibleSection>
      {filtersApplied.length > 0 && (
        <ClearAllButton
          onClick={getEvtHandler(filtersApplied, onParamsRemove)}
          transparent
        >
          Clear all filters
        </ClearAllButton>
      )}
    </WrapperElement>
  );
};

CommunityFilterList.propTypes = {
  toggleMap: func.isRequired,
  isMapView: bool.isRequired,
  isModalView: bool,
  searchParams: object.isRequired,
  onFieldChange: func.isRequired,
  onParamsRemove: func.isRequired,
  latitude: number,
  longitude: number,
};

CommunityFilterList.defaultProps = {
  isModalView: false,
  latitude: 0,
  longitude: 0,
};

export default CommunityFilterList;

import React from 'react';
import { oneOf, string, func, bool } from 'prop-types';
import styled, { css } from 'styled-components';
import { switchProp, ifProp } from 'styled-tools';
import PlacesAutocomplete from 'react-places-autocomplete';

import shadow from 'sly/web/components/helpers/shadow';
import { size, assetPath, palette, key } from 'sly/web/components/themes';
import { Input, Image, Icon } from 'sly/web/components/atoms';
import LoadGoogleMaps from 'sly/web/services/search/LoadGoogleMaps';

const Wrapper = styled.div`
  position: relative;
`;
const searchTextBoxStyles = css`
  background-color: ${palette('white', 'base')}!important;
  border: ${size('border.regular')} solid ${palette('slate', 'stroke')};
  border-radius: ${size('border.xxLarge')};
  ${switchProp('layout', {
    header: css`
      height: auto;`,
    homeHero: css`
      height: ${size('element.large')};`,
  })};
`;
const ShadowedSearchTextBox = shadow(
  styled(Input)`
    ${searchTextBoxStyles};
  `,
  'small',
);

const SearchTextBox = styled(Input)`
  ${searchTextBoxStyles};
`;
const SearchSuggestionsWrapper = styled.div`
  z-index: ${key('zIndexes.searchSuggestions')};
  position: absolute;
  // position the autocomplete items to be the same width as the container
  top: calc(100% + ${size('spacing.regular')});
  left: 0;
  right: 0;
  background: ${palette('white', 'base')};
  border: ${size('border.regular')} solid ${palette('slate', 'stroke')};
  box-shadow: 0 ${size('spacing.small')} ${size('spacing.xLarge')} ${palette('slate', 'stroke')};
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    right: ${ifProp({ layout: 'header' }, size('spacing.xxxLarge'), 0)};
  }
  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    right: 0;
  }
`;
const searchSuggestionBGColor = p => (p.active ? palette('grey', 'stroke') : palette('white', 'base'));
const SearchSuggestion = styled.div`
  width: 100%;
  padding: ${size('spacing.large')};
  background-color: ${searchSuggestionBGColor};

  :hover {
    background-color: ${palette('grey', 'stroke')};
    cursor: pointer;
  }
`;

const GoogleLogo = styled(Image)`
  margin: ${size('spacing.regular')} ${size('spacing.large')};
  width: ${size('picture.tiny.width')};
  float: right;
`;

const StyledIcon = styled(Icon)`
  margin-right: ${size('spacing.regular')};
`;

const baseSearchOptions = { types: ['(regions)'] };

const SearchBox = ({
  layout,
  value,
  onChange,
  onSelect,
  onSearchButtonClick,
  onTextboxFocus,
  onTextboxBlur,
  isTextboxInFocus,
  onLocationSearch,
  onCurrentLocationClick,
  onBlur,
  placeholder,
  readOnly,
  hasShadow,
  ...props
}) => {
  const SearchBox = hasShadow ? ShadowedSearchTextBox : SearchTextBox;

  return (
    <Wrapper layout={layout} {...props}>
      <LoadGoogleMaps>
        {(googleCallbackName, loadMaps) => (
          <PlacesAutocomplete
            value={value}
            onChange={(e) => { loadMaps(); onChange(e); }}
            onSelect={onSelect}
            searchOptions={baseSearchOptions}
            highlightFirstSuggestion
            googleCallbackName={googleCallbackName}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps }) => (
              <>
                <SearchBox
                  {...getInputProps({ onBlur, placeholder })}
                  disabled={false}
                  layout={layout}
                  onFocus={(e) => { loadMaps(); onTextboxFocus && onTextboxFocus(e); }}
                  onBlur={onTextboxBlur}
                  readOnly={readOnly}
                  type="search"
                  size="large"
                />
                {(isTextboxInFocus && (onCurrentLocationClick || suggestions.length > 0)) && (
                  <SearchSuggestionsWrapper layout={layout}>
                    {/* user mouseDown instead of onClick as the onClick which is triggered after mouse button is release will trigger blur of textbox
                        that will by the time hide the suggestions dropdown
                    */}
                    {onCurrentLocationClick &&
                      <SearchSuggestion onMouseDown={onCurrentLocationClick}><StyledIcon icon="map" /> Current Location</SearchSuggestion>}
                    {suggestions.map(suggestion => (
                      <SearchSuggestion {...getSuggestionItemProps(suggestion)} active={suggestion.active}>
                        {suggestion.description}
                      </SearchSuggestion>
                    ))}
                    <GoogleLogo src={assetPath('images/powered_by_google.png')} />
                  </SearchSuggestionsWrapper>
                )}
              </>
            )}
          </PlacesAutocomplete>
        )}
      </LoadGoogleMaps>
    </Wrapper>
  );
};

SearchBox.propTypes = {
  layout: oneOf(['header', 'homeHero']),
  value: string.isRequired,
  onChange: func.isRequired,
  onSelect: func.isRequired,
  onSearchButtonClick: func.isRequired,
  onLocationSearch: func,
  onTextboxFocus: func,
  onTextboxBlur: func,
  isTextboxInFocus: bool,
  onCurrentLocationClick: func,
  onBlur: func,
  placeholder: string,
  readOnly: bool,
  hasShadow: bool,
};

SearchBox.defaultProps = {
  layout: 'header',
  placeholder: 'Search by city or ZIP code',
  value: '',
};

export default SearchBox;
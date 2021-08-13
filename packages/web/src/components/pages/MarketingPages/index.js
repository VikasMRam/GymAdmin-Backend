import React, { useMemo } from 'react';
import Helmet from 'react-helmet';
import { Switch, Route, Redirect } from 'react-router-dom';
import { object } from 'prop-types';
import _ from 'lodash';
import styled, { css } from 'styled-components';


import { usePrefetch } from 'sly/web/services/api/prefetch';
import Footer from 'sly/web/components/organisms/Footer';
import TabNavigation from 'sly/web/components/pages/MarketingPages/TabNavigation';
import ContactUs from 'sly/web/components/pages/MarketingPages/ContactUs';
import HowItWorks from 'sly/web/components/pages/MarketingPages/HowItWorks';
import About from 'sly/web/components/pages/MarketingPages/About';
import Press from 'sly/web/components/pages/MarketingPages/Press';
import Flex from 'sly/common/system/Flex';
import Image from 'sly/common/system/Image';
import Heading from 'sly/common/system/Heading';
import HeaderContainer from 'sly/web/containers/HeaderContainer';
import {
  makeHeader,
} from 'sly/web/components/templates/FullScreenWizard';
import { assetPath } from 'sly/web/components/themes';
import { faqPage } from 'sly/web/services/helpers/html_headers';

const Header = makeHeader(HeaderContainer);

const generateDataList = (data, value) => data && _.map(_.flatMap(_.flatMap(data, 'MarketingPageDz'), value)).filter(Boolean);
const getComponentData = (data, value) => data?.filter(({__component}) => __component?.includes(value));

const ImageWrapper = styled(Image)`
  width: 100%;
  padding-bottom: 1.5rem;
`

const MarketingPages = ({ match, history }) => {
  const {requestInfo: { result, hasFinished }} = usePrefetch('getMarketingPage', { slug: match.params.marketingPage });

  const linksList = useMemo(() => generateDataList(result, 'link'), [result]);
  const normalizeTitle = useMemo(() => generateDataList(result, 'title'), [result]);
  const normalizeDescription = useMemo(() => generateDataList(result, 'description')?.pop(), [result]);
  const getImageUrl = useMemo(() => result && _.map(_.flatMap(result, 'mainImage'), 'url')?.pop(), [result]);
  const getListWithImg = useMemo(() => getComponentData(result?.[0]?.MarketingPageDz, 'list-with-img'), [result]);
  const getResentBlockContent = useMemo(() => getComponentData(result?.[0]?.MarketingPageDz, 'resent-block-post'), result);
  const getArticlesArr = useMemo(() => getResentBlockContent && _.map(_.flatMap(getResentBlockContent, 'articles')), [getResentBlockContent]);
  const getListWithIcons = useMemo(() => _.map(_.flatMap(getComponentData(result?.[0]?.MarketingPageDz, 'list-with-icons'), 'value')), [result]);
  const getFaqList = useMemo(() => getComponentData(result?.[0]?.MarketingPageDz, 'faq-block'), [result]);
  const infoBlockList = useMemo(() => getComponentData(result?.[0]?.MarketingPageDz, 'info-block'), [result]);
  console.log(infoBlockList);
  if (!hasFinished) {
    return (
      <Flex
        height="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <Image src={assetPath('images/homebase/loader.svg')} />
      </Flex>
    );
  }

  if (hasFinished && !result?.length) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
      {getFaqList?.length && faqPage(getFaqList)}
      <title>{normalizeTitle}</title>
      <meta name="description" content={result?.[0]?.MarketingPageDz?.[0]?.description} />
      </Helmet>
      <Header />
      {linksList && (
        <TabNavigation
          linksList={linksList}
          currentLink={match.params.marketingPage}
          history={history}
        />
      )}
       <Flex
          background="viridian.lighter-90"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          textAlign="center"
          padding="xxl m"
          sx$tablet={{ padding: 'xxxl l' }}
          sx$laptop={{ padding: 'xxxl 0' }}
        >
          {getImageUrl && (
            <ImageWrapper
              // sx={{width: '100%'}}
              src={getImageUrl}
            />)}
          <Heading
            font="title-xxl"
          >
            {getImageUrl ? normalizeDescription : normalizeTitle}
          </Heading>
        </Flex>
      <Switch>
        <Route path="/contact-us-temp">
          <ContactUs
            infoBlockList={infoBlockList}
          />
        </Route>
        <Route path="/how-it-works-temp">
          <HowItWorks
            imgWithItem={getListWithImg}
            getListWithIcons={getListWithIcons}
            getFaqList={getFaqList}
          />
        </Route>
        <Route path="/about-temp">
          <About
            infoBlockList={infoBlockList}
            getTeamContent={getListWithImg}
          />
        </Route>
        <Route path="/press-temp">
          <Press
            infoBlockList={infoBlockList}
            getListWithImg={getListWithImg}
            contentResentBlockPost={getResentBlockContent}
            getArticlesArr={getArticlesArr}
          />
        </Route>
      </Switch>
      <Footer />
    </>
  )
};

MarketingPages.propTypes = {
  match: object,
  history: object,
};

export default MarketingPages;
import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { array, bool, func, object } from 'prop-types';
import ListItem from 'sly/components/molecules/ListItem';
import HubHeader from 'sly/components/molecules/HubHeader';
import WhatIsPartnerAgent from 'sly/components/molecules/WhatIsPartnerAgent';
import PhoneCTAFooter from 'sly/components/molecules/PhoneCTAFooter';
import NextSteps from 'sly/components/molecules/NextSteps';
import ADLChart from 'sly/components/molecules/ADLChart';

import { getStateAbbr } from 'sly/services/helpers/url';
import { size, palette, assetPath } from 'sly/components/themes';
import {
  HubPageTemplate,
  makeBody,
  makeColumn,
  makeFooter,
  makeHeader,
  makeTwoColumn,
  makeWrapper,
} from 'sly/components/templates/HubPageTemplate';
import { TemplateHeader, TemplateContent } from 'sly/components/templates/BasePageTemplate';
import { ResponsiveImage, Label, Heading, Paragraph, Link, Icon, Hr, Image } from 'sly/components/atoms';
import Footer from 'sly/components/organisms/Footer';
import SeoLinks from 'sly/components/organisms/SeoLinks';
import { ALSeoCities, ALSeoStates } from 'sly/services/helpers/homepage';
import { getTocSeoLabel } from 'sly/services/helpers/search';
import CommunitySearchList from 'sly/components/organisms/CommunitySearchList';

const StyledHeading = styled(Heading)`
  margin-bottom: ${size('spacing.large')};
`;

const StyledArticle = styled.article`
  margin-bottom: ${size('spacing.xLarge')};
  &:last-of-type {
    margin-bottom: 0;
    p {
      margin-bottom: ${size('spacing.regular')};
    }
  }
`;

const StickToTop = styled.div`
  background-color: ${palette('white', 'base')};
  padding: ${size('spacing.xLarge')} ${size('spacing.large')} ${size('spacing.regular')} ${size('spacing.large')};
  line-height: ${size('lineHeight.body')};
  border: ${size('border.regular')} solid ${palette('slate', 'stroke')};
  border-radius: ${size('spacing.small')};
  margin-bottom: ${size('spacing.large')};
  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    position: sticky;
    top: 24px;
    margin-top: calc(2 * -${size('spacing.huge')});
  }
`;

const StyledLink = styled(Link)`
  margin-bottom: ${size('spacing.large')};
  display: block;
`;

const ListWrapper = styled.div`
  padding: ${size('spacing.xLarge')} ${size('spacing.large')};
  line-height: ${size('lineHeight.body')};
  border: ${size('border.regular')} solid ${palette('slate', 'stroke')};
  border-radius: ${size('spacing.small')};
  margin-bottom: ${size('spacing.large')};
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: ${size('spacing.large')};

  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    grid-template-columns: 50% 50%;
    grid-column-gap: ${size('layout.gutter')};
  }
`;

const TypesWrapper = styled.div`
  padding: ${size('spacing.xLarge')} ${size('spacing.large')};
  line-height: ${size('lineHeight.body')};
  border: ${size('border.regular')} solid ${palette('slate', 'stroke')};
  border-radius: ${size('spacing.small')};
  margin-bottom: ${size('spacing.large')};
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  border: ${size('border.regular')} solid ${palette('grey', 'stroke')};
  margin-bottom: ${size('spacing.large')};
  thead {
    background-color: ${palette('slate', 'stroke')};
    padding: ${size('spacing.regular')} ${size('spacing.large')};
    color: ${palette('grey', 'base')};
  };
  tr {
    border: ${size('border.regular')} solid ${palette('slate', 'stroke')};
  };
  td, th {
    padding: ${size('spacing.regular')} ${size('spacing.large')};
    border: ${size('border.regular')} solid ${palette('slate', 'stroke')};
    font-weight: normal;  
  };
  
  table-layout: fixed;
  font-size: ${size('text.tiny')};
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    font-size: ${size('text.body')};
  }
`;

const MapLinkWrapper = styled.div`
  display: none;
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    display:block;
  }
`;

const TableWrapper = styled.div`
  display: block;
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    display: none;
  }
`;

const StyledImage = styled(ResponsiveImage)`
  object-fit: cover;
  vertical-align:top;
  width: 100%;
  height: 100%;
`;


const TwoColumn = makeTwoColumn('div');
const Body = makeBody('div');
const Column = makeColumn('aside');
const Wrapper = makeWrapper('div');

const NearMePage = ({
  onLocationSearch,
  searchParams,
  requestMeta,
  communityList,
  isFetchingResults,
  handleAnchor,
  location,
  onCurrentLocation,
}) => {
  const listSize = requestMeta['filtered-count'];
  const { geo } = requestMeta;
  const city = geo && geo.city;
  const state = geo && geo.state;
  const tocLabel = getTocSeoLabel('assisted-living');

  const alRef = React.createRef();
  const staffRef = React.createRef();
  const licenseRef = React.createRef();
  const socialRef = React.createRef();
  const costRef = React.createRef();
  const alvsnhRef = React.createRef();
  const alvsilRef = React.createRef();
  const nextRef = React.createRef();

  const sectionIdMap = {
    al: 'what-is-assisted-living',
    staff: 'medical-staff',
    license: 'license',
    social: 'social',
    cost: 'cost',
    alvsnh: 'al-vs-nh',
    alvsil: 'al-vs-il',
    next: 'next',
  };

  const mapHtml = "<iframe src=\"https://createaclickablemap.com/map.php?&id=88362&maplocation=false&online=true\" width=\"680\" height=\"525\" style=\"border: none;\"></iframe>\n" +
    "<script>if (window.addEventListener){ window.addEventListener(\"message\", function(event) { if(event.data.length >= 22) { if( event.data.substr(0, 22) == \"__MM-LOCATION.REDIRECT\") location = event.data.substr(22); } }, false); } else if (window.attachEvent){ window.attachEvent(\"message\", function(event) { if( event.data.length >= 22) { if ( event.data.substr(0, 22) == \"__MM-LOCATION.REDIRECT\") location = event.data.substr(22); } }, false); } </script>\n"
  const alTable = [
    {title: "Alabama", to: "https://aspe.hhs.gov/system/files/pdf/110396/15alcom-AL.pdf"},
    {title: "Alaska", to: "https://aspe.hhs.gov/system/files/pdf/110401/15alcom-AK.pdf"},
    {title: "Arizona", to: "https://aspe.hhs.gov/system/files/pdf/110406/15alcom-AZ.pdf"},
    {title: "Arkansas", to: "https://aspe.hhs.gov/system/files/pdf/110531/15alcom-AR.pdf"},
    {title: "California", to: "https://aspe.hhs.gov/system/files/pdf/110416/15alcom-CA.pdf"},
    {title: "Colorado", to: "https://aspe.hhs.gov/system/files/pdf/110421/15alcom-CO.pdf"},
    {title: "Connecticut", to: "https://aspe.hhs.gov/system/files/pdf/110426/15alcom-CT.pdf"},
    {title: "Delaware", to: "https://aspe.hhs.gov/system/files/pdf/110431/15alcom-DE.pdf"},
    {title: "District of Columbia", to: "https://aspe.hhs.gov/system/files/pdf/110436/15alcom-DC.pdf"},
    {title: "Florida", to: "https://aspe.hhs.gov/system/files/pdf/110441/15alcom-FL.pdf"},
    {title: "Georgia", to: "https://aspe.hhs.gov/system/files/pdf/110446/15alcom-GA.pdf"},
    {title: "Hawaii", to: "https://aspe.hhs.gov/system/files/pdf/110451/15alcom-HI.pdf"},
    {title: "Idaho", to: "https://aspe.hhs.gov/system/files/pdf/110456/15alcom-ID.pdf"},
    {title: "Illinois", to: "https://aspe.hhs.gov/system/files/pdf/110461/15alcom-IL.pdf"},
    {title: "Indiana", to: "https://aspe.hhs.gov/system/files/pdf/110466/15alcom-IN.pdf"},
    {title: "Iowa", to: "https://aspe.hhs.gov/system/files/pdf/110471/15alcom-IA.pdf"},
    {title: "Kansas", to: "https://aspe.hhs.gov/system/files/pdf/110476/15alcom-KS.pdf"},
    {title: "Kentucky", to: "https://aspe.hhs.gov/system/files/pdf/110481/15alcom-KY.pdf"},
    {title: "Louisiana", to: "https://aspe.hhs.gov/system/files/pdf/110486/15alcom-LA.pdf"},
    {title: "Maine", to: "https://aspe.hhs.gov/system/files/pdf/110491/15alcom-ME.pdf"},
    {title: "Massachusetts", to: "https://aspe.hhs.gov/system/files/pdf/110501/15alcom-MA.pdf"},
    {title: "Michigan", to: "https://aspe.hhs.gov/system/files/pdf/110506/15alcom-MI.pdf"},
    {title: "Minnesota", to: "https://aspe.hhs.gov/system/files/pdf/110511/15alcom-MN.pdf"},
    {title: "Mississippi", to: "https://aspe.hhs.gov/system/files/pdf/110516/15alcom-MS.pdf"},
    {title: "Missouri", to: "https://aspe.hhs.gov/system/files/pdf/110521/15alcom-MO.pdf"},
    {title: "Montana", to: "https://aspe.hhs.gov/system/files/pdf/110526/15alcom-MT.pdf"},
    {title: "Nebraska", to: "https://aspe.hhs.gov/system/files/pdf/110536/15alcom-NE.pdf"},
    {title: "Nevada", to: "https://aspe.hhs.gov/system/files/pdf/110541/15alcom-NV.pdf"},
    {title: "New Hampshire", to: "https://aspe.hhs.gov/system/files/pdf/110546/15alcom-NH.pdf"},
    {title: "New Jersey", to: "https://aspe.hhs.gov/system/files/pdf/110551/15alcom-NJ.pdf"},
    {title: "New Mexico", to: "https://aspe.hhs.gov/system/files/pdf/110556/15alcom-NM.pdf"},
    {title: "New York", to: "https://aspe.hhs.gov/system/files/pdf/110561/15alcom-NY.pdf"},
    {title: "North Carolina", to: "https://aspe.hhs.gov/system/files/pdf/110566/15alcom-NC.pdf"},
    {title: "North Dakota", to: "https://aspe.hhs.gov/system/files/pdf/110571/15alcom-ND.pdf"},
    {title: "Ohio", to: "https://aspe.hhs.gov/system/files/pdf/110576/15alcom-OH.pdf"},
    {title: "Oklahoma", to: "https://aspe.hhs.gov/system/files/pdf/110581/15alcom-OK.pdf"},
    {title: "Oregon", to: "https://aspe.hhs.gov/system/files/pdf/110586/15alcom-OR.pdf"},
    {title: "Oregon", to: "https://aspe.hhs.gov/system/files/pdf/110586/15alcom-OR.pdf"},
    {title: "Pennsylvania", to: "https://aspe.hhs.gov/system/files/pdf/110591/15alcom-PA.pdf"},
    {title: "Rhode Island", to: "https://aspe.hhs.gov/system/files/pdf/110596/15alcom-RI.pdf"},
    {title: "South Carolina", to: "https://aspe.hhs.gov/system/files/pdf/110601/15alcom-SC.pdf"},
    {title: "South Dakota", to: "https://aspe.hhs.gov/system/files/pdf/110606/15alcom-SD.pdf"},
    {title: "Tennessee", to: "https://aspe.hhs.gov/system/files/pdf/110611/15alcom-TN.pdf"},
    {title: "Texas", to: "https://aspe.hhs.gov/system/files/pdf/110616/15alcom-TX.pdf"},
    {title: "Utah", to: "https://aspe.hhs.gov/system/files/pdf/110621/15alcom-UT.pdf"},
    {title: "Vermont", to: "https://aspe.hhs.gov/system/files/pdf/110626/15alcom-VT.pdf"},
    {title: "Virginia", to: "https://aspe.hhs.gov/system/files/pdf/110631/15alcom-VA.pdf"},
    {title: "Washington", to: "https://aspe.hhs.gov/system/files/pdf/110636/15alcom-WA.pdf"},
    {title: "West Virginia", to: "https://aspe.hhs.gov/system/files/pdf/110641/15alcom-WV.pdf"},
    {title: "Wisconsin", to: "https://aspe.hhs.gov/system/files/pdf/110646/15alcom-WI.pdf"},
    {title: "Wyoming", to: "https://aspe.hhs.gov/system/files/pdf/110651/15alcom-WY.pdf"}
  ];

  const ALNextSteps = [
    {title: "Evaluating Assisted Living Communities", to:"https://www.seniorly.com/assisted-living/articles/evaluating-assisted-living-communities"},
    {title: "Understanding the Cost of Assisted Living", to:"https://www.seniorly.com/assisted-living/articles/understanding-the-cost-of-assisted-living"},
    {title: "Frequently Asked Questions About Assisted Living", to:"https://www.seniorly.com/assisted-living/articles/seniorly-assisted-living-faqs"},
  ];

  const agents = [
    {
      title: "Sarah Odover - Los Angeles, CA",
      to: "https://www.seniorly.com/agents/pacific-west/beverley-hills/assisted-living-locators-los-angeles-ca-sarah-ordover-",
      asset: "images/hub/agents/Sarah.png",
      caption: "Sarah Ordover has over 4 years of experience helping families find independent living, \n" +
        "assisted living, and memory care options. She has helped over 100 families so far in the Los Angeles area.",
      first: "Sarah"
    },
    {
      title: "Heather Cartright - Sarasota, FL",
      to: "https://www.seniorly.com/agents/south/ellenton-fl/my-care-finders-fl-heather-cartright-",
      asset: "images/hub/agents/Heather.png",
      caption: "Heather Cartright has over a year of experience helping families find independent living, \n" +
      "assisted living, and memory care options. As a former assisted living facility administrator, \n" +
      "she brings a unique skillset for senior living placement.",
      first: "Heather"
    },
    {
      title: "Carol Katz - New Jersey",
      to: "https://www.seniorly.com/agents/northeast/manalapan/adult-care-advisors-carol-katz-",
      asset: "images/hub/agents/Carol-Katz.png",
      caption: "Carol Katz has over 10 years of experience helping families find independent living, \n" +
      "assisted living, and memory care options. With her unique volunteer experience, she brings \n" +
      "a special skillset for senior living placement.",
      first: "Carol"
    },
  ];


  const TableOfContents = () => {
    return (
      <>
        <StyledHeading level="subtitle" size="subtitle">
          Table of Contents
        </StyledHeading>
        <Paragraph>
          <StyledLink
            href={`#${sectionIdMap.al}`}
            onClick={e => handleAnchor(e, alRef)}
          >
            What is Assisted Living?
          </StyledLink>
          <StyledLink
            href={`#${sectionIdMap.cost}`}
            onClick={e => handleAnchor(e, costRef)}
          >
            What Does Assisted Living Cost Near You?
          </StyledLink>
          <StyledLink
            href={`#${sectionIdMap.staff}`}
            onClick={e => handleAnchor(e, staffRef)}
          >
            What Type of Medical Staff is Present?
          </StyledLink>
          <StyledLink
            href={`#${sectionIdMap.license}`}
            onClick={e => handleAnchor(e, licenseRef)}
          >
            Licensing and Inspection
          </StyledLink>
          <StyledLink
            href={`#${sectionIdMap.social}`}
            onClick={e => handleAnchor(e, socialRef)}
          >
            The Social and Community Aspects
          </StyledLink>

          <StyledLink
            href={`#${sectionIdMap.alvsnh}`}
            onClick={e => handleAnchor(e, alvsnhRef)}
          >
            Assisted Living vs. Skilled Nursing
          </StyledLink>
          <StyledLink
            href={`#${sectionIdMap.alvsil}`}
            onClick={e => handleAnchor(e, alvsilRef)}
          >
            Assisted Living vs. Independent Living
          </StyledLink>
          <StyledLink
            href={`#${sectionIdMap.next}`}
            onClick={e => handleAnchor(e, nextRef)}
          >
            Next Steps
          </StyledLink>
        </Paragraph>
      </>
    )
  };

  const SEOContentAL = () => {
    return (
      <>
        <StyledArticle>
          <StyledHeading level="title" size="title" _ref={alRef} >
            What is Assisted Living?
          </StyledHeading>
          <Paragraph>
            Assisted living near you can be defined as 24-hour non-medical care delivered in a residential setting.
            Previously  known as{' '}
            <Link href="https://www.seniorly.com/nursing-homes">
              nursing homes
            </Link>
            , the properties and amenities have improved immensely over the years
            and so they are now called  senior living or assisted living communities.
          </Paragraph>
          <Paragraph>
            Assisted living facilities offer seniors
            room and board, 24-hour non-medical care, housekeeping, laundry services, social engagement,
            wellness programs, and much more. Assisted living communities near you can be large hotel-like properties
            or single family homes (often called{' '}
            <Link href="https://www.seniorly.com/assisted-living/articles/understanding-board-and-care-homes">
              Board and Care
            </Link>
            {' '}or Residential Care Homes). The majority of assisted living communities are private pay and offer month-to-month rental agreements.
          </Paragraph>
          <Paragraph>
            Often, the decision to move into assisted living communities is made by the family or loved ones of
            the seniors that move into the communities. For more independent seniors, or active adults,
            searching for themselves there are{' '}
            <Link href="https://www.seniorly.com/independent-living">
              Independent Living
            </Link>
            {' '}or{' '}
            <Link href="https://www.seniorly.com/continuing-care-retirement-community">
              Continuing Care Retirement Communities (CCRC).
            </Link>
          </Paragraph>
          <Paragraph>
            The aging process is different for everyone. As people experience increased daily care needs, cognitive
            decline, social isolation, and/or the desire for a maintenance free lifestyle, assisted living communities
            can be the most desirable option.
          </Paragraph>
          <Paragraph>
            Assisted Living near you can be the right balance for seniors who want to be independent, but also need
            some day-to-day assistance and care with their{' '}
            <Link href="https://www.seniorly.com/resources/articles/what-are-the-activities-of-daily-living-adls">
              activities of daily living (ADLs).
            </Link>
          </Paragraph>
          <ADLChart />
          <Paragraph>
            Your loved one will still maintain the all-important feelings of freedom, minus the challenges that can
            exist with mobility, transportation, cooking, social activities, cleaning, medical care, and more.
          </Paragraph>
          <Paragraph>
            Activities such as exercise classes, group dinners, day trips, art classes, and more, allow for regular
            socialization and new friendships in any community.
          </Paragraph>

          <Paragraph>Common activities in most communities include:</Paragraph>
          <ListWrapper>
            <ListItem icon="checkmark-circle" iconPalette="secondary" iconVariation="dark35">Art classes</ListItem>
            <ListItem icon="checkmark-circle" iconPalette="secondary" iconVariation="dark35">Day trips</ListItem>
            <ListItem icon="checkmark-circle" iconPalette="secondary" iconVariation="dark35">Shopping excursions</ListItem>
            <ListItem icon="checkmark-circle" iconPalette="secondary" iconVariation="dark35">Dances</ListItem>
            <ListItem icon="checkmark-circle" iconPalette="secondary" iconVariation="dark35">Aerobics</ListItem>
            <ListItem icon="checkmark-circle" iconPalette="secondary" iconVariation="dark35">Religious services</ListItem>
            <ListItem icon="checkmark-circle" iconPalette="secondary" iconVariation="dark35">Movie nights</ListItem>
            <ListItem icon="checkmark-circle" iconPalette="secondary" iconVariation="dark35">Bingo</ListItem>
            <ListItem icon="checkmark-circle" iconPalette="secondary" iconVariation="dark35">Tai Chi</ListItem>
            <ListItem icon="checkmark-circle" iconPalette="secondary" iconVariation="dark35">Musical performances</ListItem>
          </ListWrapper>

          <Paragraph>
            There’s no need for extra transportation, class registrations or additional coordination to enjoy
            extracurriculars. Depending on the type of community selected, dozens of daily activities and events
            will be on site, or just a short stroll (or wheelchair ride) away.
          </Paragraph>
          <Link
            href={`#${sectionIdMap.al}`}
            onClick={e => handleAnchor(e, alRef)}
          >
            Back to top
          </Link>
        </StyledArticle>
        <StyledArticle>
          <StyledHeading level="title" size="title" >
            What is Assisted Living Near You Called?
          </StyledHeading>
          <Paragraph>
            Assisted living communities are not regulated at the federal level. Therefore, each state has their own
            licensing requirements.  Below, Seniorly has compiled the names each state gives to the term “assisted living.”
            Remember, these might be what you are thinking of when you search for “nursing home.”  Again, states licensing
            no longer uses “nursing home” to describe this kind of senior living community.
          </Paragraph>
          <MapLinkWrapper dangerouslySetInnerHTML={{ __html: mapHtml }} key="map" />
          <TableWrapper>
            <StyledArticle><SeoLinks title="Please Click on Your State Below" links={alTable} /></StyledArticle>
          </TableWrapper>
          <Link
            href={`#${sectionIdMap.al}`}
            onClick={e => handleAnchor(e, alRef)}
          >
            Back to top
          </Link>
        </StyledArticle>

        <StyledArticle>
          <StyledHeading level="title" size="title" _ref={costRef} >
            What Does Assisted Living Cost Near You?
          </StyledHeading>
          <Paragraph>
            As of 2019, according to{' '}
            <Link href="https://www.genworth.com/aging-and-you/finances/cost-of-care.html">
              Genworth
            </Link>
            {' '}, the national median rate of assisted living facility per month for a 1-bedroom apartment is $4,051 per month. However, there are a few factors that go into this cost. For example, your location, as well as the personal care services needed.
          </Paragraph>
          <Paragraph>
            That comes to about $48,612 a year. That may sound like a big number, but once you add up all current
            living costs, you may be surprised that there are often notable savings.
          </Paragraph>
          <Paragraph>
            There are also many ways to find that perfect balance of price, services, and comfort.
            There are a wide range of communities, from the basic to the luxurious.
            It is possible to choose an assisted living facility near you that fits your budget without skimping on care and amenities.
          </Paragraph>
          <Paragraph>
            In general, assisted living communities fall under 3 pricing levels:
          </Paragraph>
          <TypesWrapper>
            <ListItem icon="favourite-dark" iconPalette="secondary" iconVariation="dark35">
              <Paragraph>
                <strong>
                  Basic:{' '}
                </strong>
                This is a great option for seniors on a budget desiring a simple, no-frills lifestyle. Activities and
                amenities are often minimal, but still expect complete comfort, professionalism, and cleanliness.
              </Paragraph>
            </ListItem>
            <ListItem icon="house" iconPalette="secondary" iconVariation="dark35">
              <Paragraph>
                <strong>
                  Boutique:{' '}
                </strong>
                The sweet spot of price and comfort. These communities offer private living,
                expanded medical care, high-quality meals, and a wider variety of amenities and activities.
              </Paragraph>
            </ListItem>
            <ListItem icon="loyalty" iconPalette="secondary" iconVariation="dark35">
              <Paragraph>
                <strong>
                  Luxury:{' '}
                </strong>
                If money is no object, this level of resort-style living allows seniors to enjoy life like they’re on
                vacation. Expect top-notch 24/7 medical care, fine dining, large apartments, concierge services,
                endless activities, etc.
              </Paragraph>
            </ListItem>
          </TypesWrapper>
          <Paragraph>
            <StyledImage path="2ce70da72868d9bab90770f0ade9a383/CityView_photos_01_Seniorly.jpg" alt="CityView Senior Living, Los Angeles, CA" height={640} />
            Photo:{' '}
            <Link href="https://www.seniorly.com/assisted-living/california/los-angeles/cityview">
              CityView Senior Living, Los Angeles, CA
            </Link>
          </Paragraph>
          <Paragraph>
            Do keep in mind that all levels of care should be safe, secure, friendly, and 100% certified.
            No bargain is worth risking the wellbeing of your loved one.
          </Paragraph>
          <StyledHeading level="title" size="title">
            Financial Assistance for Assisted Living
          </StyledHeading>
          <Paragraph>
            If you’re still unsure if Assisted Living can realistically fit into your budget,
            look into the many financial aid options available.
          </Paragraph>
          <ul>
            <li>
              <Paragraph>
                <Link href="https://www.seniorly.com/resources/articles/long-term-care-insurance-for-respite-care">
                  Long Term Care Insurance
                </Link>
                {' '}- is an insurance product that helps pay for the costs associated with long-term care. Long-term care
                insurance covers care generally not covered by health insurance, Medicare, or Medicaid.
              </Paragraph>
            </li>
            <li>
              <Paragraph>
                Government services like Medicare, Medicaid, or{' '}
                <Link href="https://www.seniorly.com/resources/articles/veterans-benefits-for-assisted-living">
                  Veterans Assistance
                </Link>
                {' '}can be valuable tools in making
                Assisted Living affordable. Many communities also offer special payment plans, programs, and other
                strategies to help your loved one live in their ideal community.
              </Paragraph>
            </li>

            <li>
              <Paragraph>
                Many communities also offer special payment plans, programs, and other strategies to help your loved one live in their ideal community.
              </Paragraph>
            </li>
          </ul>

          <Paragraph>
            You can learn more about the different costs that go into assisted living. Read our resource on{' '}
            <Link href="https://www.seniorly.com/assisted-living/articles/understanding-the-cost-of-assisted-living">
              the costs of assisted living near you.
            </Link>
          </Paragraph>
          <Link
            href={`#${sectionIdMap.al}`}
            onClick={e => handleAnchor(e, alRef)}
          >
            Back to top
          </Link>
        </StyledArticle>
        <StyledArticle>
          <StyledHeading level="title" size="title" >
            What Is A Local Senior Living Expert?
          </StyledHeading>
          <WhatIsPartnerAgent toc="assisted living" agents={agents}/>
        </StyledArticle>

        <StyledArticle>
          <StyledHeading level="title" size="title" _ref={staffRef} >
            What Type Of Medical Staff Is Present?
          </StyledHeading>
          <Paragraph>
            Every assisted living facility near you is different. They are each dedicated to different levels of care and
            services. Assisted living communities will offer regular activities, on-site non-medical health care,
            comfortable living spaces, and prepared meals. Some communities that focus on higher acuity care may
            have licensed nurses on staff. Others focus on dementia or{' '}
            <Link href="https://www.seniorly.com/memory-care">
              memory care
            </Link>
            {' '}and may have cognitive specialists.

          </Paragraph>
          <Paragraph>
            Seniors should expect their own private residences with most communities offering studios or one-bedroom
            apartments. Couples also can live together, and some communities, especially the smaller ones, do offer
            shared rooms for more economic value. And no need to leave a pet behind as many communities allow dogs, cats
            and fish to come along with their faithful owners.
          </Paragraph>
          <Link
            href={`#${sectionIdMap.al}`}
            onClick={e => handleAnchor(e, alRef)}
          >
            Back to top
          </Link>
        </StyledArticle>
        <StyledArticle>
          <StyledHeading level="title" size="title" _ref={licenseRef} >
            Licensing and Inspection Requirements
          </StyledHeading>
          <Paragraph>
            Each state has its own licensing agency responsible for inspecting and certifying each Assisted Living
            community. Here is a full list of regulating agencies by state, as well as a{' '}
            <Link href="https://www.seniorly.com/resources/articles/assisted-living-regulations">
              full list of certifications
            </Link>
            {' '}you should always ask to see.
          </Paragraph>
          <Paragraph>
            Always ensure the senior living community you choose is completely certified with a reliable, upbeat
            staff of managers, nurses, caregivers, and other personnel. When asking questions, there should be no hesitation
            to prove total compliance of regulations.{' '}
            <Link href="https://www.seniorly.com/resources/articles/questions-to-ask-on-your-community-tour">
              Click on this link for a list of over 70 questions you might want to ask the community.
            </Link>
          </Paragraph>
          <Link
            href={`#${sectionIdMap.al}`}
            onClick={e => handleAnchor(e, alRef)}
          >
            Back to top
          </Link>
        </StyledArticle>
        <StyledArticle>
          <StyledHeading level="title" size="title" _ref={socialRef} >
            Exploring The Social and Community Aspects
          </StyledHeading>
          <Paragraph>
            Many assume that making the step away from their “old life” and into Assisted Living means the end of a
            social life and autonomy. This is far from the truth. Any Assisted Living community near you worth considering
            should amplify the amount of activities residents can enjoy, and can deepen peer and familial relationships.
          </Paragraph>
          <Paragraph>
            It’s been proven that{' '}
            <Link href="https://greatergood.berkeley.edu/article/item/how_social_connections_keep_seniors_healthy" target="_blank" rel="noopener">
              maintaining social connections
            </Link>
            {' '}is essential to keeping senior minds sharp and healthy.
            It also helps to stave off depression and other mental problems, which can be a serious issue for older adults.
          </Paragraph>
          <Paragraph>
            Though your loved one may currently seem more than content with the familiarity of their own home,
            <strong>
              {' '}the ability to easily enjoy meals with friends, learn new skills, and interact with their peers daily
              often becomes a priceless, life-extending amenity.
            </strong>
          </Paragraph>
          <Paragraph>
            In addition, families can now relax and enjoy each precious minute together. Rather than stressing
            about whether all their needs are being properly met, or trying to care for your loved one on your own,
            spend time together assured of their safety and happiness.
          </Paragraph>
          <Link
            href={`#${sectionIdMap.al}`}
            onClick={e => handleAnchor(e, alRef)}
          >
            Back to top
          </Link>
        </StyledArticle>

        <StyledArticle>
          <StyledHeading level="title" size="title">
            How Assisted Living Varies from Other Care Options
          </StyledHeading>
          <StyledHeading level="subtitle" size="subtitle" _ref={alvsnhRef} >
            Assisted Living vs Skilled Nursing Facility (SNF)
          </StyledHeading>
          <Paragraph>
            Often, families search for “nursing home.” This term doesn’t really exist, but it is commonly defined as
            a Skilled Nursing Facility. There is a significant difference between Assisted Living communities and
            Skilled Nursing Facilities.
          </Paragraph>
          <Paragraph>
            According to the CDC, over{' '}
            <Link href="https://www.cdc.gov/nchs/fastats/alzheimers.htm" target="_blank" rel="noopener">
              50% of Skilled Nursing Facility residents
            </Link>
            {' '}have either Alzheimer’s disease or other forms of dementia. Most residents also spend the majority of their time sedentary.
          </Paragraph>
          <Paragraph>
            In contrast, most Assisted Living residents maintain active lifestyles needing only basic daily services
            such as bathing, mobility assistance, on-site medical care, etc. Allowing seniors to lead active,
            independent lives while also aiming to make daily life simpler and safer is the primary goal
            of Assisted Living communities.
          </Paragraph>
          <StyledArticle>
            <StyledTable>
              <thead>
                <tr>
                  <th />
                  <th>
                    Skilled Nursing Facility
                  </th>
                  <th>
                    Assisted Living
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Private Living
                  </td>
                  <td />
                  <td>
                    <Icon icon="checkmark-circle" palette="secondary" variation="dark35" />
                  </td>
                </tr>
                <tr>
                  <td>
                    24-Hour Medical Assistance
                  </td>
                  <td>
                    <Icon icon="checkmark-circle" palette="secondary" variation="dark35" />
                  </td>
                  <td />
                </tr>
                <tr>
                  <td>
                    Medication Monitoring
                  </td>
                  <td>
                    <Icon icon="checkmark-circle" palette="secondary" variation="dark35" />
                  </td>
                  <td>
                    <Icon icon="checkmark-circle" palette="secondary" variation="dark35" />
                  </td>
                </tr>
                <tr>
                  <td>
                    Regular Activities
                  </td>
                  <td>
                    <Icon icon="checkmark-circle" palette="secondary" variation="dark35" />
                  </td>
                  <td>
                    <Icon icon="checkmark-circle" palette="secondary" variation="dark35" />
                  </td>
                </tr>
              </tbody>
            </StyledTable>
          </StyledArticle>
          <Paragraph>
            If your loved one needs significant daily care, or suffers from noticeable effects of Alzheimer’s disease
            or dementia, a skilled nursing facility may be the better choice. However, if they desire a
            more independent lifestyle and require relatively minimal assistance, Assisted Living may be
            just the right balance.
          </Paragraph>
          <Link
            href={`#${sectionIdMap.al}`}
            onClick={e => handleAnchor(e, alRef)}
          >
            Back to top
          </Link>
        </StyledArticle>
        <StyledArticle>
          <StyledHeading level="subtitle" size="subtitle" _ref={alvsilRef} >
            Assisted Living vs. Independent Living
          </StyledHeading>
          <Paragraph>
            Seniors choosing to live in Independent Living vs. Assisted Living typically require very
            little, if any, daily assistance. Unlike Assisted Living, residents of these communities
            can get around, cook, bathe, clean, and manage the majority of their life without extra care.
            This provides the largest amount of independence. Hence, the name.
          </Paragraph>
          <StyledArticle>
            <StyledTable>
              <thead>
                <tr>
                  <th />
                  <th>
                    Independent Living
                  </th>
                  <th>
                    Assisted Living
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Private Living
                  </td>
                  <td>
                    <Icon icon="checkmark-circle" palette="secondary" variation="dark35" />
                  </td>
                  <td>
                    <Icon icon="checkmark-circle" palette="secondary" variation="dark35" />
                  </td>
                </tr>
                <tr>
                  <td>
                    Daily Living Assistance
                  </td>
                  <td />
                  <td>
                    <Icon icon="checkmark-circle" palette="secondary" variation="dark35" />
                  </td>
                </tr>
                <tr>
                  <td>
                    Medication Monitoring
                  </td>
                  <td />
                  <td>
                    <Icon icon="checkmark-circle" palette="secondary" variation="dark35" />
                  </td>
                </tr>
                <tr>
                  <td>
                    Regular Activities
                  </td>
                  <td>
                    <Icon icon="checkmark-circle" palette="secondary" variation="dark35" />
                  </td>
                  <td>
                    <Icon icon="checkmark-circle" palette="secondary" variation="dark35" />
                  </td>
                </tr>
              </tbody>
            </StyledTable>
          </StyledArticle>
          <Paragraph>
            Independent Living also provides the largest amount of day-to-day social activities, offers on-site
            medical services, and provides a safe, secure community. Living spaces are usually larger,
            apartment-style quarters with full kitchens, outdoor areas, private rooms, etc.
          </Paragraph>
          <Paragraph>
            Unlike Assisted Living, services Independent Living often won’t provide include bathing, memory care,
            mobility services, on-going medical treatments, and more. Though Assisted Living communities will
            organize many social and enrichment activities, they are often more structured than activities in
            Independent Living.
          </Paragraph>
          <Paragraph>
            If your loved one currently lives a very self-reliant lifestyle with few medical needs, and is
            simply searching for a safe, active community of senior peers, Independent Living may be the perfect fit.
            For those striving for a large degree of independence, but with some daily assistance, Assisted Living
            might be the ticket.
          </Paragraph>
          <Link
            href={`#${sectionIdMap.al}`}
            onClick={e => handleAnchor(e, alRef)}
          >
            Back to top
          </Link>
        </StyledArticle>

        <StyledArticle>
          <NextSteps nextRef={nextRef}
                     toc="assisted living"
                     label="Think Assisted Living might be right for your loved one? Explore one of the three topics below to help narrow down your search:"
                     links={ALNextSteps} />

          <Link
            href={`#${sectionIdMap.al}`}
            onClick={e => handleAnchor(e, alRef)}
          >
            Back to top
          </Link>
        </StyledArticle>
      </>
    );
  };

  const title = 'Find the Best Assisted Living Near You ';
  const description = 'Find the best assisted living near you with local senior living communities & providers. Browse assisted living nearby with prices, reviews & photos.';
  const heading = state ? `${listSize} ${tocLabel} near ${city}, ${getStateAbbr(state)}` : `${listSize} ${tocLabel} near ${city}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <HubHeader imagePath="react-assets/hub/assisted-living-cover.jpg"
         toc="assisted living"
         heading="What is Assisted Living Near You?"
         label="Use our free search to find assisted living nearby"
         onCurrentLocation={onCurrentLocation}
         onLocationSearch={onLocationSearch} />
      <HubPageTemplate>
        <Wrapper>
          <TwoColumn>
            <Column>
              <StickToTop>
                {TableOfContents()}
              </StickToTop>
            </Column>
            <Body>
            {SEOContentAL()}
            <StyledHeading level="title" size="title">
              {heading}
            </StyledHeading>
            <StyledArticle>
              <Paragraph>
                Seniorly promises to make your search for assisted living near you easy and stress-free. In 2019, the
                national average monthly cost has been $4,051 for an assisted living facility. Below, compare assisted
                living communities near you and then let us connect you to your local senior living advisor.
                They can answer all your questions, share costs, arrange tours, and even negotiate rent. Our services are free.
              </Paragraph>
            </StyledArticle>
            {isFetchingResults && <StyledHeading level="hero" size="title">loading...</StyledHeading>}
            {!isFetchingResults && (
              <CommunitySearchList
                communityList={communityList}
                searchParams={searchParams}
                requestMeta={requestMeta}
                location={location}
              />
            )}
            </Body>
          </TwoColumn>
        </Wrapper>
      </HubPageTemplate>
      <PhoneCTAFooter/>
      <TemplateContent>
        <StyledArticle><SeoLinks title="Find Assisted Living Near You by City" links={ALSeoCities} /></StyledArticle>
        <StyledArticle><SeoLinks title="Find Assisted Living Near You by State" links={ALSeoStates} /></StyledArticle>
      </TemplateContent>
      <Footer />
    </>

  );
};

NearMePage.propTypes = {
  onLocationSearch: func,
  communityList: array.isRequired,
  requestMeta: object.isRequired,
  searchParams: object,
  isFetchingResults: bool,
  handleAnchor: func,
  location: object.isRequired,
  onCurrentLocation: func,
};

export default NearMePage;

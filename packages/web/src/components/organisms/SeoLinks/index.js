import React from 'react';
import { arrayOf, string, object } from 'prop-types';


import { Heading, Link, Grid, Block } from 'sly/common/system';

const SeoLinks = ({ title, links, ...props }) => (
  <Block as="section" {...props}>
    <Heading font="title-m" pad="l">{title}</Heading>
    <Grid
      gridGap="m"
      sx$tablet={{
        gridTemplateColumns: '50% 50%',
      }}
    >
      {links.map(link => (
        <Link
          key={link.to}
          onClick={() => window.scrollTo(0, 0)}
          {...link}
        >
          {link.title}
        </Link>
      ))}
    </Grid>
  </Block>
);

SeoLinks.propTypes = {
  title: string.isRequired,
  links: arrayOf(object).isRequired,
};

export default SeoLinks;

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { Section, Heading } from '@styles';

const StyledButton = styled(Link)`
  display: inline-block;
  margin-top: 30px;
  padding: 10px 20px;
  background-color: brown;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    background-color: #a0522d;
  }
`;

const CurriculumVitae = ({ data }) => {
  const { frontmatter, html } = data[7].node; // WILL HAVE TO CHANGE IT DEPENDING ON THE ORDER
  const { title } = frontmatter;

  return (
    <Section id="cv">
      <Heading>{title}</Heading>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <StyledButton to="/expanded-cv">View Full CV</StyledButton>
    </Section>
  );
};

CurriculumVitae.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        frontmatter: PropTypes.shape({
          title: PropTypes.string.isRequired,
        }).isRequired,
        html: PropTypes.string.isRequired,
      }).isRequired,
    }),
  ).isRequired,
};

export default CurriculumVitae;

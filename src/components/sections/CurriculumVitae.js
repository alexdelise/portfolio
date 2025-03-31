import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { Section, Heading, Button } from '@styles';

const StyledButtonWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 50px;
`;

const StyledCVButton = styled(Button)`
  display: inline-block;
  padding: 1rem 2rem;
  font-size: 1.2rem;
`;

const CurriculumVitae = ({ data }) => {
  const { frontmatter, html } = data[0].node; // will need to change index
  const { title } = frontmatter;

  return (
    <Section id="cv">
      <Heading>{title}</Heading>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <StyledButtonWrapper>
        <StyledCVButton as={Link} to="/expanded-cv">
          View Full CV
        </StyledCVButton>
      </StyledButtonWrapper>
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

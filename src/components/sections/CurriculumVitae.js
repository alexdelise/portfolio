import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Section, Heading } from '@styles';
import styled from 'styled-components';

const StyledContent = styled.div`
  max-width: 600px;
`;

const CurriculumVitae = ({ data }) => {
  const { frontmatter, html } = data[0].node;
  const { title } = frontmatter;

  const revealContainer = useRef(null);
  useEffect(() => sr.reveal(revealContainer.current, srConfig()), []);

  return (
    <Section id="cv" ref={revealContainer}>
      <Heading>{title}</Heading>
      <StyledContent dangerouslySetInnerHTML={{ __html: html }} />
    </Section>
  );
};

CurriculumVitae.propTypes = {
  data: PropTypes.array.isRequired,
};

export default CurriculumVitae;

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { FormattedIcon } from '@components/icons';
import styled from 'styled-components';
import { theme, mixins, media, Section, Heading } from '@styles';

const { colors, fontSizes, fonts } = theme;

const StyledContainer = styled(Section)`
  ${mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
`;

/* Increase grid-gap for more space between text & image */
const StyledProjectGrid = styled.div`
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(12, 1fr);
  align-items: center;
  margin-bottom: 100px;

  ${media.thone`
    margin-bottom: 70px;
    grid-gap: 20px;
  `};

  &:last-of-type {
    margin-bottom: 0;
  }

  /* Odd: image left (7 cols), text right (5 cols) */
  &:nth-of-type(odd) {
    .project-image {
      grid-column: 1 / 8; /* columns 1..7 => 7 columns */
      ${media.thone`
        grid-column: 1 / -1;
        opacity: 0.25;
      `};
    }
    .project-content {
      grid-column: 8 / -1; /* columns 8..12 => 5 columns */
      text-align: right;
      ${media.thone`
        grid-column: 1 / -1;
        padding: 40px 40px 30px;
      `};
      ${media.phablet`
        padding: 30px 25px 20px;
      `};
    }
  }

  /* Even: text left (5 cols), image right (7 cols) */
  &:nth-of-type(even) {
    .project-content {
      grid-column: 1 / 6; /* columns 1..5 => 5 columns */
      text-align: left;
    }
    .project-image {
      grid-column: 6 / -1; /* columns 6..12 => 7 columns */
      ${media.thone`
        grid-column: 1 / -1;
        opacity: 0.25;
      `};
    }
  }
`;

const StyledContent = styled.div`
  position: relative;
  grid-row: 1 / -1;
  ${media.thone`
    grid-column: 1 / -1;
    z-index: 5;
  `};
`;

const StyledLabel = styled.h4`
  font-size: ${fontSizes.smish};
  font-weight: normal;
  color: ${colors.green};
  font-family: ${fonts.SFMono};
  margin-top: 10px;
`;

const StyledProjectName = styled.h5`
  font-size: 28px;
  margin: 0;
  color: ${colors.lightestSlate};
  ${media.tablet`font-size: 24px;`};
  ${media.thone`color: ${colors.white};`};

  a {
    ${media.tablet`display: block;`};
  }
`;

const StyledDescription = styled.div`
  ${mixins.boxShadow};
  position: relative;
  z-index: 2;
  padding: 25px;
  background-color: ${colors.lightNavy};
  color: ${colors.lightSlate};
  font-size: ${fontSizes.lg};
  border-radius: ${theme.borderRadius};

  ${media.thone`
    background-color: transparent;
    padding: 20px 0;
    box-shadow: none;
    &:hover {
      box-shadow: none;
    }
  `};

  p {
    margin: 0;
  }
  a {
    ${mixins.inlineLink};
  }
`;

const StyledTechList = styled.ul`
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 25px 0 10px;
  list-style: none;

  li {
    font-family: ${fonts.SFMono};
    font-size: ${fontSizes.smish};
    color: ${colors.green};
    margin-right: ${theme.margin};
    margin-bottom: 7px;
    white-space: nowrap;

    &:last-of-type {
      margin-right: 0;
    }

    ${media.thone`
      color: ${colors.green};
      margin-right: 10px;
    `};
  }
`;

const StyledLinkWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 10px;
  margin-left: -10px;
  color: ${colors.lightestSlate};

  a {
    padding: 10px;
    svg {
      width: 22px;
      height: 22px;
    }
  }
`;

const StyledFeaturedImg = styled(Img)`
  width: 100%;
  max-width: 100%;
  vertical-align: middle;
  border-radius: ${theme.borderRadius};
  position: relative;
  mix-blend-mode: multiply;
  filter: grayscale(100%) contrast(1) brightness(90%);
  ${media.tablet`
    object-fit: cover;
    width: auto;
    height: 100%;
    filter: grayscale(100%) contrast(1) brightness(80%);
  `};
`;

const StyledImgContainer = styled.a`
  ${mixins.boxShadow};
  grid-row: 1 / -1;
  position: relative;
  z-index: 1;
  background-color: ${colors.green};
  border-radius: ${theme.radius + 1}px;
  transition: ${theme.transition};

  ${media.tablet`height: 100%;`};
  ${media.thone`
    grid-column: 1 / -1;
    opacity: 0.25;
  `};

  &:hover,
  &:focus {
    background: transparent;
    &:before,
    ${StyledFeaturedImg} {
      background: transparent;
      filter: none;
    }
  }

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    transition: ${theme.transition};
    background-color: ${colors.navy};
    mix-blend-mode: screen;
  }
`;

const Featured = ({ data }) => {
  const featuredProjects = data.filter(({ node }) => node);

  const revealTitle = useRef(null);
  const revealProjects = useRef([]);

  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <StyledContainer id="projects">
      <Heading ref={revealTitle}>Research Highlights</Heading>

      <div>
        {featuredProjects &&
          featuredProjects.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { external, title, tech, github, cover } = frontmatter;

            return (
              <StyledProjectGrid key={i} ref={el => (revealProjects.current[i] = el)}>
                {/* Text / Content */}
                <StyledContent className="project-content">
                  <StyledLabel>Featured Project</StyledLabel>
                  <StyledProjectName>
                    {external ? (
                      <a
                        href={external}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        aria-label="External Link">
                        {title}
                      </a>
                    ) : (
                      title
                    )}
                  </StyledProjectName>
                  <StyledDescription dangerouslySetInnerHTML={{ __html: html }} />
                  {tech && (
                    <StyledTechList>
                      {tech.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </StyledTechList>
                  )}
                  <StyledLinkWrapper>
                    {github && (
                      <a
                        href={github}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        aria-label="GitHub Link">
                        <FormattedIcon name="GitHub" />
                      </a>
                    )}
                    {external && (
                      <a
                        href={external}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        aria-label="External Link">
                        <FormattedIcon name="External" />
                      </a>
                    )}
                  </StyledLinkWrapper>
                </StyledContent>

                {/* Image */}
                <StyledImgContainer
                  className="project-image"
                  href={external ? external : github ? github : '#'}
                  target="_blank"
                  rel="nofollow noopener noreferrer">
                  <StyledFeaturedImg fluid={cover.childImageSharp.fluid} alt={title} />
                </StyledImgContainer>
              </StyledProjectGrid>
            );
          })}
      </div>
    </StyledContainer>
  );
};

Featured.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Featured;

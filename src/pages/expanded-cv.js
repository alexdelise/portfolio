import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Layout } from '@components';
import { FormattedIcon } from '@components/icons';
import { theme, media, Main } from '@styles';

const HEADING_COLOR = '#6D5C50';
const MAIN_HEADING_SIZE = '60px';
const SUBHEADING_SIZE = '48px';
const TEXT_COLOR = '#a0522d';

const StyledMainContainer = styled(Main)``;
const StyledLinkIcon = styled.a`
  svg {
    width: 20px;
    height: 20px;
  }
`;
const StyledTableContainer = styled.div`
  margin: 100px -20px;
  ${media.tablet`
    margin: 100px -10px;
  `};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  tbody tr {
    transition: ${theme.transition};
    &:hover,
    &:focus {
      background-color: ${theme.colors.lightNavy};
    }
  }
  th,
  td {
    line-height: 1.5;
    padding: 10px 20px;
    ${media.tablet`
      padding: 10px;
    `};
  }
  th {
    text-align: left;
  }
`;

const CvSectionHeading = styled.h2`
  color: ${HEADING_COLOR};
  margin: 60px 0 20px;
  font-size: ${SUBHEADING_SIZE};
  font-weight: 700;
  line-height: 1.2;
`;

// Configuration for table headers and field mappings per section
// where it says 'Service to the Profession' this must match exactly the title in the corresponding markdown files.
const sectionConfig = {
  Education: {
    headers: ['Period', 'Degree', 'Institution', 'Link'],
    fieldMapping: {
      year: 'date', // now treated as a custom string
      title: 'degree',
      institution: 'institution',
      link: 'external',
    },
  },
  'Industry Experience': {
    headers: ['Period', 'Position', 'Company', 'Link'],
    fieldMapping: {
      year: 'date',
      title: 'degree', // Assuming "degree" field holds the job title
      institution: 'institution', // For industry, this is the company
      link: 'external',
    },
  },
  'Conference Proceedings': {
    headers: ['Date', 'Title', 'Conference', 'Link'],
    fieldMapping: {
      year: 'date',
      title: 'degree',
      institution: 'institution',
      link: 'external',
    },
  },
  'Poster Presentations': {
    headers: ['Date', 'Title', 'Conference / Event', 'Link'],
    fieldMapping: {
      year: 'date',
      title: 'degree',
      institution: 'institution',
      link: 'external',
    },
  },
  Talks: {
    headers: ['Period', 'Talk Title', 'Event', 'Link'],
    fieldMapping: {
      year: 'date',
      title: 'degree',
      institution: 'institution',
      link: 'external',
    },
  },
  'Honors and Awards': {
    headers: ['Period', 'Award', 'Presenter', 'Link'],
    fieldMapping: {
      year: 'date',
      title: 'degree',
      institution: 'institution',
      link: 'external',
    },
  },
  'Service to the Profession': {
    headers: ['Period', 'Role', 'Organization', 'Link'],
    fieldMapping: {
      year: 'date',
      title: 'degree',
      institution: 'institution',
      link: 'external',
    },
  },
  Courses: {
    headers: ['Semester', 'Code', 'Course', 'Institution'],
    fieldMapping: {
      year: 'date',
      title: 'degree',
      institution: 'institution',
      link: 'external',
    },
  },
};

const ExpandedCVPage = ({ data, location }) => {
  const revealTitle = useRef(null);
  const revealTable = useRef(null);
  const revealRows = useRef([]);

  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealTable.current, srConfig());
    revealRows.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 2.5)));
  }, []);

  const eduNode = data.education.edges[0].node;
  const industryNode = data.industry.edges[0].node;
  const proceedingsNode = data.proceedings.edges[0].node;
  const posterNode = data.posters.edges[0].node;
  const talkNode = data.talks.edges[0].node;
  const honorsNode = data.honors.edges[0].node;
  const serviceNode = data.service.edges[0].node;
  const courseNode = data.courses.edges[0].node;

  // this determines the order in which the sections appear on the website
  const sections = [
    eduNode,
    industryNode,
    proceedingsNode,
    posterNode,
    talkNode,
    honorsNode,
    serviceNode,
    courseNode,
  ];

  return (
    <Layout location={location}>
      <Helmet>
        <title>Full Academic CV</title>
        <link rel="canonical" href="https://yoursite.com/expanded-cv" />
      </Helmet>

      <StyledMainContainer>
        <header ref={revealTitle}>
          <h1
            className="big-title"
            style={{
              fontSize: MAIN_HEADING_SIZE,
              color: HEADING_COLOR,
              margin: '0 0 20px',
              lineHeight: 1.2,
              fontWeight: 700,
            }}>
            Full Academic CV
          </h1>
          <p
            className="subtitle"
            style={{ color: TEXT_COLOR, marginBottom: '30px', fontSize: '20px' }}>
            All of my work in one place.
          </p>
        </header>

        {sections.map((sec, sectionIndex) => {
          const { frontmatter } = sec;
          const itemList = frontmatter.items || [];
          const config = sectionConfig[frontmatter.title] || {
            headers: ['Period', 'Title', 'Institution / Venue', 'Link'],
            fieldMapping: {
              year: 'date',
              title: 'degree',
              institution: 'institution',
              link: 'external',
            },
          };

          return (
            <div key={sectionIndex}>
              <CvSectionHeading>{frontmatter.title}</CvSectionHeading>
              <StyledTableContainer ref={revealTable}>
                <StyledTable>
                  <thead>
                    <tr>
                      {config.headers.map((header, idx) => (
                        <th key={idx}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {itemList.map((item, idx) => {
                      const rowRef = el => (revealRows.current[idx + sectionIndex * 100] = el);
                      return (
                        <tr key={idx} ref={rowRef}>
                          <td>{item[config.fieldMapping.year]}</td>
                          <td>{item[config.fieldMapping.title]}</td>
                          <td>{item[config.fieldMapping.institution] || '—'}</td>
                          <td>
                            {item[config.fieldMapping.link] ? (
                              item[config.fieldMapping.link].startsWith('http') ? (
                                <StyledLinkIcon
                                  href={item[config.fieldMapping.link]}
                                  target="_blank"
                                  rel="nofollow noopener noreferrer"
                                  aria-label="External Link">
                                  <FormattedIcon name="External" />
                                </StyledLinkIcon>
                              ) : (
                                item[config.fieldMapping.link]
                              )
                            ) : (
                              '—'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </StyledTable>
              </StyledTableContainer>
            </div>
          );
        })}
      </StyledMainContainer>
    </Layout>
  );
};

// To avoid repeating the same shape in each field, define a reusable node shape:
const nodeShape = PropTypes.shape({
  node: PropTypes.shape({
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string,
          degree: PropTypes.string,
          institution: PropTypes.string,
          external: PropTypes.string,
        }),
      ),
    }).isRequired,
  }).isRequired,
});

ExpandedCVPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.shape({
    education: PropTypes.shape({
      edges: PropTypes.arrayOf(nodeShape).isRequired,
    }).isRequired,
    industry: PropTypes.shape({
      edges: PropTypes.arrayOf(nodeShape).isRequired,
    }).isRequired,
    proceedings: PropTypes.shape({
      edges: PropTypes.arrayOf(nodeShape).isRequired,
    }).isRequired,
    posters: PropTypes.shape({
      edges: PropTypes.arrayOf(nodeShape).isRequired,
    }).isRequired,
    talks: PropTypes.shape({
      edges: PropTypes.arrayOf(nodeShape).isRequired,
    }).isRequired,
    service: PropTypes.shape({
      edges: PropTypes.arrayOf(nodeShape).isRequired,
    }).isRequired,
    honors: PropTypes.shape({
      edges: PropTypes.arrayOf(nodeShape).isRequired,
    }).isRequired,
    courses: PropTypes.shape({
      edges: PropTypes.arrayOf(nodeShape).isRequired,
    }).isRequired,
  }).isRequired,
};

export default ExpandedCVPage;

export const pageQuery = graphql`
  query {
    education: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/cv/education/education.md$/" } }
    ) {
      edges {
        node {
          frontmatter {
            title
            items {
              date
              degree
              institution
              external
            }
          }
        }
      }
    }
    industry: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/cv/industry/industry.md$/" } }
    ) {
      edges {
        node {
          frontmatter {
            title
            items {
              date
              degree
              institution
              external
            }
          }
        }
      }
    }
    proceedings: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/cv/proceedings/proceedings.md$/" } }
    ) {
      edges {
        node {
          frontmatter {
            title
            items {
              date
              degree
              institution
              external
            }
          }
        }
      }
    }
    posters: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/cv/posters/posters.md$/" } }
    ) {
      edges {
        node {
          frontmatter {
            title
            items {
              date
              degree
              institution
              external
            }
          }
        }
      }
    }
    talks: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/cv/talks/talks.md$/" } }) {
      edges {
        node {
          frontmatter {
            title
            items {
              date
              degree
              institution
              external
            }
          }
        }
      }
    }
    service: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/cv/service/service.md$/" } }
    ) {
      edges {
        node {
          frontmatter {
            title
            items {
              date
              degree
              institution
              external
            }
          }
        }
      }
    }
    honors: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/cv/honors/honors.md$/" } }) {
      edges {
        node {
          frontmatter {
            title
            items {
              date
              degree
              institution
              external
            }
          }
        }
      }
    }
    courses: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/cv/courses/courses.md$/" } }
    ) {
      edges {
        node {
          frontmatter {
            title
            items {
              date
              degree
              institution
              external
            }
          }
        }
      }
    }
  }
`;

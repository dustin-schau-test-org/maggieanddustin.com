/** @jsx jsx */
import { jsx } from 'theme-ui'
import { graphql } from 'gatsby'
import Image from 'gatsby-image'

import Layout from '../components/layout'
import Gallery from '../components/gallery'
import Timeline from '../components/timeline'
import Section from '../components/section'
import SEO from '../components/seo'

import partials from '../components/partials'

function Page({ data }) {
  const page = data.page.contentBlocks.reduce((merged, block) => {
    switch (block.__typename) {
      case 'ContentfulTimeline':
        merged.timeline = (merged.timeline || []).concat(block)
        break
      case 'ContentfulGallery':
        merged.gallery = (merged.gallery || []).concat(block)
        break
      case 'ContentfulSection':
        merged.section = (merged.section || []).concat(block)
        break
      case 'ContentfulHero':
        merged.hero = (merged.hero || []).concat(block)
        break
      default:
        break
    }
    return merged
  }, {})
  const Partial = partials[data.page.slug]
  return (
    <Layout>
      <SEO
        description="The wedding website for Maggie Alcorn and Dustin Schau. Save the date for August 8th, 2020 in Minneapolis, MN."
        title="Wedding | August 8, 2020"
      />
      {page.hero &&
        page.hero.map(img => <Image key={img.hero.id} {...img.hero} />)}
      {Partial && <Partial />}
      {page.timeline &&
        page.timeline.map(timeline => (
          <Timeline key={timeline.id} {...timeline} />
        ))}
      {page.section &&
        page.section.map(section => <Section key={section.id} {...section} />)}
      {page.gallery &&
        page.gallery.map(gallery => <Gallery key={gallery.id} {...gallery} />)}
    </Layout>
  )
}

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    page: contentfulPage(fields: { slug: { eq: $slug } }) {
      id
      slug
      contentBlocks {
        ... on ContentfulGallery {
          __typename
          id
          ...GalleryDetails
        }
        ... on ContentfulHero {
          __typename
          hero: image {
            id
            fluid(maxWidth: 600) {
              ...GatsbyContentfulFluid
            }
          }
        }

        ... on ContentfulSection {
          id
          __typename
          ...SectionDetails
        }

        ... on ContentfulTimeline {
          __typename
          moments {
            id
            ...MomentDetails
          }
        }
      }
    }
  }
`

export default Page

import { useEffect } from 'react'

/**
 * SEO Head Component
 * Dynamically updates meta tags for better SEO and social sharing
 */
function SEOHead({ 
  title = 'TipNPlay - Live Tipping Platform for DJs & Entertainers',
  description = 'The fastest micro-tipping platform for DJs, hosts & entertainers. Accept live tips from your audience instantly.',
  image = '/images/og-image.jpg',
  url = window.location.href,
  type = 'website'
}) {
  useEffect(() => {
    // Update document title
    document.title = title

    // Update or create meta tags
    const updateMetaTag = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`) || 
                    document.querySelector(`meta[name="${property}"]`)
      
      if (!element) {
        element = document.createElement('meta')
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          element.setAttribute('property', property)
        } else {
          element.setAttribute('name', property)
        }
        document.head.appendChild(element)
      }
      
      element.setAttribute('content', content)
    }

    // Basic meta tags
    updateMetaTag('description', description)
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0')

    // Open Graph tags (Facebook, LinkedIn)
    updateMetaTag('og:title', title)
    updateMetaTag('og:description', description)
    updateMetaTag('og:image', image)
    updateMetaTag('og:url', url)
    updateMetaTag('og:type', type)
    updateMetaTag('og:site_name', 'TipNPlay')

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [title, description, image, url, type])

  return null
}

export default SEOHead


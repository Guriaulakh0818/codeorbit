import React, { useEffect } from 'react';

/**
 * SEO Head Component for Dynamic Meta Tags and JSON-LD Structured Data
 * Essential for Google Search indexing, rich snippets, and Google AdSense approval.
 */
export const SeoHead = ({
  title = 'CodeOrbit — Free Computer Science Tutorials & Engineering Guides',
  description = 'Free high-quality tutorials, notes, cheat sheets, and practice quizzes for CSE & IT engineering students. Learn DSA, Operating Systems, DBMS, Computer Networks, and System Design.',
  keywords = 'computer science tutorials, free CS courses, DSA notes, operating systems, DBMS, computer networks, system design, java, python, c++, interview preparation',
  canonicalUrl,
  ogType = 'website',
  article = null, // { publishedTime, modifiedTime, author, section, tags }
  course = null, // { name, description, provider, isAccessibleForFree, educationalLevel }
  faq = null, // [ { question: '...', answer: '...' } ]
  breadcrumbs = [] // [ { name: 'Home', url: '/' }, { name: 'DSA', url: '/courses/dsa' }, ... ]
}) => {
  // Compute clean canonical URL without query parameters or hash
  const getCleanUrl = () => {
    if (canonicalUrl) {
      return canonicalUrl.startsWith('http') ? canonicalUrl : `https://www.codeorbit.online${canonicalUrl}`;
    }
    if (typeof window !== 'undefined') {
      const { protocol, host, pathname } = window.location;
      const cleanPath = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
      return `${protocol}//${host}${cleanPath}`;
    }
    return 'https://www.codeorbit.online';
  };

  const currentUrl = getCleanUrl();
  const siteTitle = title.includes('CodeOrbit') ? title : `${title} | CodeOrbit`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = siteTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard SEO Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'author', 'CodeOrbit Engineering');

    // 3. Canonical Link
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', currentUrl);

    // 4. OpenGraph Tags
    setMetaTag('property', 'og:title', siteTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'CodeOrbit');
    setMetaTag('property', 'og:image', 'https://www.codeorbit.online/codeorbit-logo.png');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', siteTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', 'https://www.codeorbit.online/codeorbit-logo.png');

    // 6. JSON-LD Structured Data for Google Rich Snippets
    let scriptEl = document.getElementById('codeorbit-jsonld');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'codeorbit-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const jsonLdData = [];

    // WebSite / EducationalOrganization Schema
    jsonLdData.push({
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      'name': 'CodeOrbit',
      'url': 'https://www.codeorbit.online',
      'logo': 'https://www.codeorbit.online/codeorbit-logo.png',
      'description': 'Free Computer Science Tutorials & Placement Preparation Portal'
    });

    // BreadcrumbList Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': b.name,
          'item': b.url.startsWith('http') ? b.url : `https://www.codeorbit.online${b.url}`
        }))
      });
    }

    // Course Schema
    if (course) {
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'Course',
        'name': course.name || title,
        'description': course.description || description,
        'provider': {
          '@type': 'Organization',
          'name': 'CodeOrbit',
          'sameAs': 'https://www.codeorbit.online'
        },
        'isAccessibleForFree': course.isAccessibleForFree !== false,
        'educationalLevel': course.educationalLevel || 'Beginner to Advanced',
        'url': currentUrl
      });
    }

    // TechArticle Schema for Lessons / Articles
    if (article) {
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': title,
        'description': description,
        'url': currentUrl,
        'author': {
          '@type': 'Organization',
          'name': 'CodeOrbit Engineering'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'CodeOrbit',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://www.codeorbit.online/codeorbit-logo.png'
          }
        },
        'inLanguage': ['en', 'hi'],
        'proficiencyLevel': 'Beginner to Advanced',
        'articleSection': article.section || 'Computer Science'
      });
    }

    // FAQPage Schema
    if (faq && Array.isArray(faq) && faq.length > 0) {
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faq.map(f => ({
          '@type': 'Question',
          'name': f.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.answer
          }
        }))
      });
    }

    scriptEl.textContent = JSON.stringify(jsonLdData);
  }, [siteTitle, description, keywords, currentUrl, ogType, article, course, faq, breadcrumbs]);

  return null;
};

export default SeoHead;

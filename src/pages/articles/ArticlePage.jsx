import { useParams, Link } from 'react-router-dom';
import SEOHelmet from '@/components/shared/SEOHelmet';
import {
  Badge,
  Section,
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';
import { getArticleBySlug } from '@/data/articles';
import { H2, H3 } from '@/components/ui/heading';

export default function ArticlePage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="container-equus">
        <SEOHelmet
          title="Article Not Found"
          description="The requested article could not be found."
        />
        <div className="equus-section">
          <Section title="ARTICLE" size="lg">
            <Card variant="highlighted" size="full">
              <CardTitle>Article not found</CardTitle>
              <CardDescription>
                We couldn't find the article you're looking for.
              </CardDescription>
              <CardContent className="mt-4">
                <Link to="/products" className="text-equus-primary underline">
                  Back to products
                </Link>
              </CardContent>
            </Card>
          </Section>
        </div>
      </div>
    );
  }

  const { title, excerpt, description, date, author, sections, tags } = article;

  // TfL line colors (official brand hexes)
  const tflLineColors = {
    'Hammersmith & City': '#F3A9BB',
    'Waterloo & City': '#95CDBA',
    'Elizabeth Line': '#6950A1',
    Bakerloo: '#B36305',
    Central: '#E32017',
    Circle: '#FFD300',
    District: '#00782A',
    Jubilee: '#A0A5A9',
    Metropolitan: '#9B0056',
    Northern: '#000000',
    Piccadilly: '#003688',
    Victoria: '#0098D4',
    DLR: '#00A4A7',
  };

  // Build a single regex to match any line name, optional " Line"
  const tflRegex = new RegExp(
    [
      'Hammersmith & City',
      'Waterloo & City',
      'Elizabeth Line',
      'Bakerloo',
      'Central',
      'Circle',
      'District',
      'Jubilee',
      'Metropolitan',
      'Northern',
      'Piccadilly',
      'Victoria',
      'DLR',
    ]
      // Longer names first to avoid partial matches
      .sort((a, b) => b.length - a.length)
      .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|') + '(?:\\s+Line)?',
    'g',
  );

  // Wrap matched line names with a span using the official color
  const renderWithTfLColors = (text) => {
    if (!text) return text;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = tflRegex.exec(text)) !== null) {
      const matchText = match[0];
      const before = text.slice(lastIndex, match.index);
      if (before) parts.push(before);
      // Determine base line name key (strip trailing " Line" if present)
      const base = matchText.replace(/\s+Line$/i, '');
      // Map "Elizabeth" to "Elizabeth Line" key
      const key = base === 'Elizabeth' ? 'Elizabeth Line' : base;
      const color = tflLineColors[key] || '#3498db';
      const isNorthern = key === 'Northern';
      const style = isNorthern
        ? {
            color,
            textShadow:
              '0 0 2px rgba(255, 255, 255, 0.95), 0 0 4px rgba(255, 255, 255, 0.7)',
          }
        : { color };
      parts.push(
        <span key={parts.length} style={style} className="font-semibold">
          {matchText}
        </span>,
      );
      lastIndex = match.index + matchText.length;
    }
    const tail = text.slice(lastIndex);
    if (tail) parts.push(tail);
    return parts;
  };

  // Simple renderer to convert body text into paragraphs, lists, and code blocks
  const renderSectionBody = (body) => {
    const lines = body.split('\n');
    const blocks = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      // Ordered list
      if (/^\s*\d+\./.test(line)) {
        const items = [];
        while (i < lines.length && /^\s*\d+\./.test(lines[i])) {
          items.push(lines[i].replace(/^\s*\d+\.\s*/, ''));
          i++;
        }
        blocks.push({ type: 'ol', items });
        continue;
      }
      // Unordered list (supports \u2022 or -)
      if (/^\s*[\u2022\-]\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\s*[\u2022\-]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*[\u2022\-]\s+/, ''));
          i++;
        }
        blocks.push({ type: 'ul', items });
        continue;
      }
      // Code block (heuristic for JS-like lines or comments)
      if (
        /^\s*(\/\/|const |let |function |async |await |\{|\}|\)|\(|import |export )/.test(
          line,
        )
      ) {
        const codeLines = [];
        while (
          i < lines.length &&
          (/^\s*(\/\/|const |let |function |async |await |\{|\}|\)|\(|import |export )/.test(
            lines[i],
          ) ||
            lines[i].trim() === '')
        ) {
          codeLines.push(lines[i]);
          i++;
        }
        blocks.push({ type: 'code', code: codeLines.join('\n') });
        continue;
      }
      // Paragraph (accumulate until blank line)
      if (line.trim() !== '') {
        const paras = [];
        while (i < lines.length && lines[i].trim() !== '') {
          paras.push(lines[i]);
          i++;
        }
        blocks.push({ type: 'p', text: paras.join(' ') });
        continue;
      }
      i++;
    }

    return (
      <div className="space-y-4">
        {blocks.map((b, idx) => {
          if (b.type === 'p') {
            return (
              <p
                key={idx}
                className="text-equus-muted text-sm sm:text-base leading-relaxed"
              >
                {renderWithTfLColors(b.text)}
              </p>
            );
          }
          if (b.type === 'ul') {
            return (
              <ul
                key={idx}
                className="about-list space-y-1 text-equus-muted text-sm sm:text-base leading-relaxed marker:text-equus-olive"
              >
                {b.items.map((it, i2) => (
                  <li key={i2}>{renderWithTfLColors(it)}</li>
                ))}
              </ul>
            );
          }
          if (b.type === 'ol') {
            return (
              <ol
                key={idx}
                className="list-decimal ml-5 sm:ml-6 space-y-1 text-equus-muted text-sm sm:text-base leading-relaxed marker:text-equus-olive"
              >
                {b.items.map((it, i2) => (
                  <li key={i2}>{renderWithTfLColors(it)}</li>
                ))}
              </ol>
            );
          }
          if (b.type === 'code') {
            return (
              <pre
                key={idx}
                className="bg-equus-secondary/30 border border-equus-border rounded-md p-3 sm:p-4 overflow-x-auto text-sm sm:text-base text-white font-mono whitespace-pre-wrap break-words"
              >
                <code className="text-white">{b.code}</code>
              </pre>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // Optional Article JSON-LD for richer SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    datePublished: date,
    author: { '@type': 'Organization', name: author || 'Equus Systems' },
    keywords: (tags || []).join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://equussystems.co/articles/${slug}`,
    },
  };

  return (
    <div className="container-equus">
      <SEOHelmet
        title={`${title} - Equus Systems`}
        description={excerpt || description}
        keywords={(tags || []).join(', ')}
        url={`https://equussystems.co/articles/${slug}`}
        type="article"
        structuredData={structuredData}
      />
      <div className="equus-section">
        <Section title="BLOG" size="lg">
          {/* Header */}
          <header className="w-full px-4 sm:px-6">
            <H2
              variant="olive"
              align="left"
              className="mb-6 heading-underline-olive"
            >
              {title}
            </H2>
            <div className="mt-2 text-xs sm:text-sm text-equus-muted flex flex-wrap items-center gap-2">
              {author && <span>By: {author}</span>}
              {date && (
                <>
                  <span>&bull;</span>
                  <time dateTime={date}>
                    {new Date(date).toLocaleDateString()}
                  </time>
                </>
              )}
            </div>
            {excerpt && (
              <p className="mt-3 sm:mt-4 text-equus-muted text-sm sm:text-base leading-relaxed max-w-prose">
                {excerpt}
              </p>
            )}
            {/* tags are shown in the footer next to the back-link */}
          </header>

          {/* Article Body */}
          <article className="w-full px-4 sm:px-6 mt-6 sm:mt-8">
            {description ? (
              <section className="mb-6 sm:mb-8">
                <H3 variant="primary">Summary</H3>
                <div className="mt-2">
                  <p className="text-equus-muted text-sm sm:text-base leading-relaxed">
                    {description}
                  </p>
                </div>
              </section>
            ) : null}

            {(sections || []).map((s, i) => (
              <section key={i} className="mb-6 sm:mb-8">
                {s.heading && <H3 variant="primary">{s.heading}</H3>}
                {s.body && (
                  <div className="mt-2">{renderSectionBody(s.body)}</div>
                )}
              </section>
            ))}

            {/* Footer row: tags on the left (if any) and back-link on the right */}
            <div className="mt-6 sm:mt-8 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {tags?.length ? (
                <div className="flex flex-wrap items-center gap-2">
                  {tags.map((t) => (
                    <Badge key={t} variant="info" size="sm">
                      {t}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span />
              )}
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-equus-primary underline"
              >
                <span aria-hidden="true">&larr;</span>
                <span>Back to products</span>
              </Link>
            </div>
          </article>
        </Section>
      </div>
    </div>
  );
}

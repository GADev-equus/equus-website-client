import { useParams, Link } from 'react-router-dom';
import SEOHelmet from '@/components/shared/SEOHelmet';
import {
  Fieldset,
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui';
import { getArticleBySlug } from '@/data/articles';

export default function ArticlePage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="container-equus py-12">
        <SEOHelmet
          title="Article Not Found"
          description="The requested article could not be found."
        />
        <Fieldset legend="ARTICLE" size="lg">
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
        </Fieldset>
      </div>
    );
  }

  const { title, excerpt, description, date, author, sections, tags } = article;

  return (
    <div className="container-equus py-12">
      <SEOHelmet
        title={`${title} - Equus Systems`}
        description={excerpt || description}
        keywords={(tags || []).join(', ')}
        url={`https://equussystems.co/articles/${slug}`}
      />

      <section className="equus-section equus-section-centered pt-6 pb-8">
        <h1 className="text-hero text-equus-primary font-semibold mb-3 text-center">
          {title}
        </h1>
        {excerpt && (
          <p className="text-body-large text-equus-muted container-content text-center">
            {excerpt}
          </p>
        )}
        <div className="text-sm text-gray-400 mt-4 text-center">
          {date && <span>{new Date(date).toLocaleDateString()}</span>}
          {author && <span className="ml-2">• {author}</span>}
        </div>
      </section>

      <section className="equus-section">
        <Fieldset legend="DETAILS" size="lg">
          {description && (
            <Card variant="default" size="full" className="mb-6">
              <CardTitle>Summary</CardTitle>
              <CardDescription>{description}</CardDescription>
            </Card>
          )}

          {(sections || []).map((s, i) => (
            <Card key={i} variant="default" size="full" className="mb-6">
              {s.heading && <CardTitle>{s.heading}</CardTitle>}
              {s.body && (
                <CardContent>
                  {s.body.split('\n').map((line, idx) => (
                    <p key={idx} className="text-equus-muted mb-2">
                      {line}
                    </p>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}

          <div className="mt-4 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {tags?.length ? (
              <div className="text-gray-400">Tags: {tags.join(', ')}</div>
            ) : (
              <span />
            )}
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-equus-primary underline"
            >
              <span aria-hidden="true">←</span>
              <span>Back to products</span>
            </Link>
          </div>
        </Fieldset>
      </section>
    </div>
  );
}

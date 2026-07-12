import { Link } from 'react-router';
import { Button } from '@figma/astraui';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-2xl text-center bg-brand-tertiary">
      <div className="text-[120px] font-semibold text-brand-primary/10 leading-none mb-xl select-none">
        {t('notFound.code')}
      </div>
      <h1 className="text-[40px] font-semibold text-text-primary mb-lg">
        {t('notFound.title')}
      </h1>
      <p className="text-heading text-text-secondary max-w-[400px] mb-2xl">
        {t('notFound.desc')}
      </p>
      <Link to="/">
        <Button variant="primary" className="gap-sm">
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {t('notFound.backHome')}
        </Button>
      </Link>
    </div>
  );
}

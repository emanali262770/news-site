import { usePosts } from '../context/PostsContext';
import { useLanguage } from '../context/LanguageContext';
import { presentPost } from '../lib/api';
import useApiResource from './useApiResource';

export default function usePostList({ page = 1, category, search, homepage } = {}) {
  const { version } = usePosts();
  const { currentLang } = useLanguage();
  const params = new URLSearchParams({ page: String(page), limit: '10' });
  if (currentLang?.code) params.set('lang', currentLang.code);
  if (category) params.set('category', category);
  if (search?.trim()) params.set('search', search.trim());
  if (homepage) params.set('homepage', 'true');
  const resource = useApiResource(`/posts?${params}`, `${version}-${currentLang?.code}`);
  return {
    ...resource,
    posts: resource.data?.data.map(presentPost) || [],
    pagination: resource.data?.pagination,
  };
}

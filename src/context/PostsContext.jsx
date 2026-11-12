import { createContext, useCallback, useContext, useState } from 'react';
import useApiResource from '../hooks/useApiResource';
import { api } from '../lib/api';

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const categoriesRequest = useApiResource('/categories');
  const [version, setVersion] = useState(0);
  const invalidatePosts = useCallback(() => setVersion((value) => value + 1), []);

  async function savePost(fields, id) {
    const result = await api(id ? `/posts/${encodeURIComponent(id)}` : '/posts', {
      method: id ? 'PATCH' : 'POST', body: fields,
    });
    invalidatePosts();
    return result;
  }

  async function deletePost(post) {
    await api(`/posts/${encodeURIComponent(post.id)}`, { method: 'DELETE' });
    invalidatePosts();
  }

  return (
    <PostsContext.Provider value={{
      categories: categoriesRequest.data || [],
      categoriesLoading: categoriesRequest.loading,
      categoriesError: categoriesRequest.error,
      retryCategories: categoriesRequest.retry,
      version, savePost, deletePost,
    }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) throw new Error('usePosts must be used within PostsProvider');
  return context;
}

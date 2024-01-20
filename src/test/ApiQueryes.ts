

import { useQuery, useQuerySync } from "mark-api-react";
    
    
 /* types */
interface PostsOutput {
  id: number;
  slug: string;
  url: string;
  title: string;
  content: string;
  image: string;
  thumbnail: string;
  status: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  userId: number;
}
 /* hooks */
export const usePostsQuery = () => useQuery<undefined,PostsOutput[]>( 
    'http://localhost/api/posts',  
)
export const usePostsQuerySync = () => useQuerySync<undefined,PostsOutput[]>( 
    'http://localhost/api/posts'
)
            

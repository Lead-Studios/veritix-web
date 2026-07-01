import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string;
  coverImage: string;
  tags: string[];
  readingTime: number;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR);
  const posts = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(CONTENT_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { frontmatter, content } = parseFrontmatter(fileContent);
      
      return {
        slug: file.replace('.md', ''),
        ...frontmatter,
        content,
        readingTime: calculateReadingTime(content),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, content } = parseFrontmatter(fileContent);
  
  return {
    slug,
    ...frontmatter,
    content,
    readingTime: calculateReadingTime(content),
  };
}

function parseFrontmatter(content: string): { frontmatter: Omit<BlogPost, 'slug' | 'content' | 'readingTime'>; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return {
      frontmatter: {
        title: '',
        author: '',
        date: '',
        coverImage: '',
        tags: [],
      },
      content,
    };
  }

  const frontmatterStr = match[1];
  const body = match[2];
  
  const frontmatter: any = {};
  frontmatterStr.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim().replace(/^"|"$/g, '');
      
      if (key === 'tags') {
        frontmatter[key] = value
          .replace(/^\[|\]$/g, '')
          .split(',')
          .map((tag: string) => tag.trim().replace(/^"|"$/g, ''));
      } else {
        frontmatter[key] = value;
      }
    }
  });

  return {
    frontmatter: {
      title: frontmatter.title || '',
      author: frontmatter.author || '',
      date: frontmatter.date || '',
      coverImage: frontmatter.coverImage || '',
      tags: frontmatter.tags || [],
    },
    content: body,
  };
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Content Service
 * Handles loading and caching structured content data (projects, posts)
 */

import { readFile } from "fs/promises";
import { join } from "path";

export class ContentService {
  private static projectsPath = join(__dirname, "../../content/projects");
  private static postsPath = join(__dirname, "../../content/posts");

  // Cache objects
  private static cache = {
    projects: {} as Record<string, any[]>,
    posts: {} as Record<string, any[]>,
  };

  /**
   * Get all projects for a language
   * @param lang Language code
   * @param limit Optional limit on number of results
   */
  static async getProjects(lang: string, limit?: number): Promise<any[]> {
    try {
      // Check cache first
      if (this.cache.projects[lang]) {
        var projects = this.cache.projects[lang];
        return limit ? projects.slice(0, limit) : projects;
      }

      // Load from file
      var filePath = join(this.projectsPath, `${lang}.json`);
      var jsonData = await readFile(filePath, "utf8");
      var projects = JSON.parse(jsonData);

      // Cache it
      this.cache.projects[lang] = projects;

      return limit ? projects.slice(0, limit) : projects;
    } catch (error) {
      console.error(`Error loading projects for ${lang}:`, error);
      return [];
    }
  }

  /**
   * Get a single project by ID and language
   */
  static async getProjectById(lang: string, id: number): Promise<any | null> {
    try {
      var projects = await this.getProjects(lang);
      var project = projects.find((p) => p.id === id);
      return project || null;
    } catch (error) {
      console.error(`Error getting project ${id} for ${lang}:`, error);
      return null;
    }
  }

  /**
   * Get all blog posts for a language
   * @param lang Language code
   * @param limit Optional limit on number of results
   */
  static async getBlogPosts(lang: string, limit?: number): Promise<any[]> {
    try {
      // Check cache first
      if (this.cache.posts[lang]) {
        var posts = this.cache.posts[lang];
        return limit ? posts.slice(0, limit) : posts;
      }

      // Load from file
      var filePath = join(this.postsPath, `${lang}.json`);
      var jsonData = await readFile(filePath, "utf8");
      var posts = JSON.parse(jsonData);

      // Cache it
      this.cache.posts[lang] = posts;

      return limit ? posts.slice(0, limit) : posts;
    } catch (error) {
      console.error(`Error loading blog posts for ${lang}:`, error);
      return [];
    }
  }

  /**
   * Get a single blog post by ID and language
   */
  static async getBlogPostById(lang: string, id: number): Promise<any | null> {
    try {
      var posts = await this.getBlogPosts(lang);
      var post = posts.find((p) => p.id === id);
      return post || null;
    } catch (error) {
      console.error(`Error getting blog post ${id} for ${lang}:`, error);
      return null;
    }
  }

  /**
   * Clear cache (useful for development or testing)
   */
  static clearCache() {
    this.cache.projects = {};
    this.cache.posts = {};
  }
}

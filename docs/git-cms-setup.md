# Git CMS (Netlify Visual Editor) Setup

This document outlines the Git CMS setup for the john.design project using Netlify's Visual Editor.

## Overview

Git CMS provides a visual editing interface for your markdown-based blog posts while maintaining the Git workflow. Content editors can make changes through a user-friendly interface, and all changes are committed directly to the repository.

## What's Been Implemented

### 1. Dependencies

- `@stackbit/types` - TypeScript definitions for Visual Editor
- `@stackbit/cms-git` - Git content source for Visual Editor
- `@stackbit/cli` - Command line interface for development

### 2. Configuration (`stackbit.config.ts`)

- Configured Git content source pointing to `data/posts/`
- Defined post model with all necessary fields (title, date, cover, tags, etc.)
- Set up asset management for images in `public/journal-images/images/`
- Configured for Next.js framework

### 3. Content Model

The post model includes these editable fields:

- `title` (string, required)
- `slug` (slug, required)
- `date` (date, required)
- `template` (enum: post/page)
- `cover` (image)
- `videoCover` (string)
- `thumb` (image)
- `ogImage` (image)
- `refer` (text)
- `tags` (list of strings)
- `hidden` (boolean)
- `description` (text)

### 4. Visual Editor Annotations

Added `data-sb-*` attributes to enable inline editing:

- `data-sb-object-id` - Identifies which post is being edited
- `data-sb-field-path` - Specifies which field to edit

Components updated:

- `PostPage.tsx` - Individual blog post page
- `JournalGridItem.tsx` - Blog post cards on listing page
- `JournalArchiveGridItem.tsx` - Archive post cards

### 5. Content Updates

All blog post markdown files now include `type: "post"` in their frontmatter to identify them as posts in the Visual Editor.

## Local Development

To run Visual Editor locally:

1. Start your Next.js development server:

   ```bash
   npm run dev
   ```

2. In a separate terminal, start the Visual Editor:

   ```bash
   stackbit dev
   ```

3. Open the Visual Editor at `http://localhost:8090/_stackbit`

## Cloud Setup

### Prerequisites

- Site deployed to Netlify
- Repository hosted on GitHub or BitBucket
- Appropriate permissions for the Git user

### Steps

1. Go to your Netlify site settings: **Project configuration > Visual Editor**
2. Click **Set up preview environment**
3. Choose your working branch (recommend `preview`)
4. Authorize repository access
5. The Visual Editor will automatically add configuration files

### Publishing Workflow

- **Working Branch**: `preview` (for editing and previews)
- **Target Branch**: `main` (for production)
- Changes made in Visual Editor are committed to the working branch
- Publish changes by merging working branch to target branch

## Features

### For Content Editors

- **Visual Interface**: Edit content without touching code
- **Live Preview**: See changes in real-time
- **Media Management**: Upload and manage images
- **Draft/Publish Workflow**: Work on drafts before publishing

### For Developers

- **Git-based**: All content changes are committed to Git
- **Version Control**: Full history of content changes
- **No Database**: Content stored as markdown files
- **Framework Agnostic**: Works with existing Next.js setup

## Asset Management

- Images uploaded to: `public/journal-images/images/`
- Public URL: `/journal-images/images/`
- Supports drag-and-drop uploads in Visual Editor

## Content Structure

Posts are stored in: `data/posts/*.md`

Required frontmatter:

```yaml
---
type: 'post'
template: 'post'
slug: '/journal/post-slug'
date: '2024-01-01'
title: 'Post Title'
# Optional fields...
---
```

## Limitations

- No scheduling feature (posts are live immediately)
- Limited to GitHub/BitBucket repositories
- Requires Node.js 14+ for local development

## Next Steps

- Enable Visual Editor in Netlify dashboard
- Set up editorial workflow with team members
- Configure custom preview environment if needed
- Add more content types (pages, etc.) if required

## Support

- [Netlify Visual Editor Documentation](https://docs.netlify.com/visual-editor/)
- [Git CMS Configuration Reference](https://docs.netlify.com/visual-editor/content-sources/git/)

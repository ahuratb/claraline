import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'chapterVideo',
  title: 'Chapter Videos',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'chapter', title: 'Chapter Number', type: 'number' }),
    defineField({
      name: 'video', title: 'Video File', type: 'file',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'thumbnail', title: 'Thumbnail', type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
  ],
})

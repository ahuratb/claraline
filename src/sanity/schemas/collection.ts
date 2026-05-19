import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({ name: 'title_en', title: 'Title (English)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'title_ar', title: 'العنوان بالعربية', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'slug', title: 'Slug', type: 'slug',
      options: { source: 'title_en', maxLength: 96 },
      validation: r => r.required()
    }),
    defineField({ name: 'description_en', title: 'Description (English)', type: 'text' }),
    defineField({ name: 'description_ar', title: 'الوصف بالعربية', type: 'text' }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
  ]
})

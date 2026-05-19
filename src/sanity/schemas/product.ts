import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'name_en', title: 'Name (English)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'name_ar', title: 'الاسم بالعربية', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'slug', title: 'Slug', type: 'slug',
      options: { source: 'name_en', maxLength: 96 },
      validation: r => r.required()
    }),
    defineField({ name: 'price', title: 'Price (KD)', type: 'number', validation: r => r.required().positive() }),
    defineField({
      name: 'images', title: 'Product Images', type: 'array',
      of: [{
        type: 'image', options: { hotspot: true },
        fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
      }]
    }),
    defineField({
      name: 'collection', title: 'Collection', type: 'string',
      options: {
        list: [
          { title: 'Lip', value: 'lip' },
          { title: 'Eye', value: 'eye' },
          { title: 'Face', value: 'face' },
          { title: 'Gift Sets', value: 'gift' },
        ]
      },
      validation: r => r.required()
    }),
    defineField({ name: 'description_en', title: 'Description (English)', type: 'text' }),
    defineField({ name: 'description_ar', title: 'الوصف بالعربية', type: 'text' }),
    defineField({ name: 'ingredients_en', title: 'Ingredients (English)', type: 'text' }),
    defineField({ name: 'ingredients_ar', title: 'المكونات بالعربية', type: 'text' }),
    defineField({ name: 'howToUse_en', title: 'How to Use (English)', type: 'text' }),
    defineField({ name: 'howToUse_ar', title: 'طريقة الاستخدام بالعربية', type: 'text' }),
    defineField({ name: 'benefits_en', title: 'Key Benefits (English)', type: 'text' }),
    defineField({ name: 'benefits_ar', title: 'الفوائد الرئيسية بالعربية', type: 'text' }),
    defineField({ name: 'sku', title: 'SKU', type: 'string' }),
    defineField({ name: 'inStock', title: 'In Stock', type: 'boolean', initialValue: true }),
    defineField({ name: 'featured', title: 'Featured on Homepage', type: 'boolean', initialValue: false }),
    defineField({
      name: 'badge', title: 'Badge', type: 'string',
      options: { list: ['new', 'bestseller', 'limited'] }
    }),
    defineField({
      name: 'shades', title: 'Shades', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name_en', type: 'string', title: 'Shade Name (EN)' },
          { name: 'name_ar', type: 'string', title: 'اسم اللون' },
          { name: 'hex', type: 'string', title: 'Hex Color' },
        ]
      }]
    }),
  ],
  preview: {
    select: { title: 'name_en', subtitle: 'price', media: 'images.0' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare({ title, subtitle, media }: any) {
      return { title, subtitle: `KD ${subtitle}`, media }
    }
  }
})

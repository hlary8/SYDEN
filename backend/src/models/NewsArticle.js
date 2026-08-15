const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({ url: String, publicId: String, caption: String }, { _id: false });

const newsArticleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String, required: true, maxlength: 500 },
  content: { type: String, required: true },
  coverImage: {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    caption: { type: String, default: '' }
  },
  gallery: [ImageSchema],
  category: { type: String, enum: ['deleon','syden','deefresh','holdings','sustainability'], default: 'holdings' },
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publishedAt: { type: Date, default: Date.now, index: true },
  isPublished: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 }
}, { timestamps: true });

// Auto-generate slug from title if not provided
newsArticleSchema.pre('validate', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('NewsArticle', newsArticleSchema);

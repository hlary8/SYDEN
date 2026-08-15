# News/Press System - Quick Reference Card

## 🎯 For Admins

### Publishing an Article (30 seconds)
1. Go to `/press` → Click **+ NEW ARTICLE**
2. Fill: Title, Excerpt, Content
3. Select Category
4. Upload Cover Image
5. (Optional) Add Gallery Images
6. Check "Publish Now" ✓
7. Click **PUBLISH ARTICLE**

### Finding Admin Dashboard
- **URL:** `https://yoursite.com/admin/news`
- **Shortcut:** Press → + NEW ARTICLE button
- **Only visible to:** Admins (role: 'admin')

### Editing/Deleting
| Action | Steps |
|--------|-------|
| **Edit** | Find article → Click "Edit" → Change fields → Update |
| **Delete** | Find article → Click "Delete" → Confirm |
| **Save as Draft** | Uncheck "Publish Now" before publishing |
| **Update Images** | Click ✕ on old image, upload new one |

### Sorting Articles
- **Sort By:** Published Date, Created Date, Views, Title
- **Order:** ↓ Newest (default) or ↑ Oldest

---

## 📖 For Readers

### Reading Articles
1. Visit `/press` (Press page)
2. Click article card
3. Read full article
4. Click images for lightbox view
5. Share via LinkedIn/X/Facebook/Copy Link

### Related Articles
- Bottom of article page
- Same category automatically
- Click to read next

---

## 🔧 Field Guide

### Required Fields (*starred)
- **Title*** - Article headline
- **Excerpt*** - Summary (max 500 chars)
- **Content*** - Full article text
- **Cover Image*** - Hero image required
- **Category*** - Select from 5 options

### Optional Fields
- **URL Slug** - Auto-generated if blank
- **Gallery Images** - 0-20 photos max
- **Tags** - Comma-separated keywords
- **Featured** - Highlight on press page
- **Publish Now** - Uncheck to save draft

### Category Options
- 🏛️ DELEON Holdings
- 🌾 DELEON
- 🥬 Syden (olive management)
- 🥒 DeeFresh (produce)
- 🌍 Sustainability

---

## 🎨 Upload Guidelines

### Cover Image
- **Required** for all articles
- **Size:** Max 5MB
- **Format:** JPG, PNG, WebP
- **Aspect Ratio:** 21:9 hero format
- **Location:** Stored in Cloudinary

### Gallery Images
- **Optional** 1-20 images per article
- **Size:** Max 5MB each
- **Format:** JPG, PNG, WebP
- **Aspect Ratio:** Any (grid: 1:1 squares)
- **Location:** Stored in Cloudinary

**Upload Process:**
1. Click upload area or drag-drop
2. Select file from computer
3. Wait for ✓ success indicator
4. Image preview appears in form
5. Click ✕ to remove before publishing

---

## 📊 Dashboard Table

| Column | Meaning | Actions |
|--------|---------|---------|
| Cover | Image thumbnail | Click to preview |
| Title & Excerpt | Article name & summary | Read-only |
| Category | DeLeon / Syden / etc | Colored badge |
| Published | Date article went live | Sort option |
| Views | Reader count | Sort option |
| Status | Published ✓ or Draft 📝 | Sort option |
| Actions | Edit/Delete buttons | Click to modify |

---

## 🔐 Access Control

### Who can create articles?
```
✅ Users with role: 'admin'
❌ Regular users cannot access
❌ Non-logged-in users cannot access
```

### Author Information
- Article stores creator's user ID
- Display as "By [username]" on article page
- Automatically set to logged-in admin

---

## 🚀 Keyboard & UX Tips

### Form Submission
- **Submit:** Click "PUBLISH ARTICLE" or "UPDATE ARTICLE" button
- **Cancel:** Click "Cancel" button
- **Auto-save:** No auto-save - click submit to save

### Lightbox Navigation
- **Open:** Click any image in article
- **Close:** Click ✕ button or click outside image
- **Next Image:** Only single image in lightbox (no gallery nav)

### Dashboard Navigation
- **Sort:** Click column header dropdown
- **Edit:** Click article row → "Edit" button
- **Delete:** Click article row → "Delete" button
- **Create:** Click "+ NEW ARTICLE" top-left

---

## 📱 Responsive Behavior

| Screen | Grid | Notes |
|--------|------|-------|
| **Desktop** (>1024px) | 3 columns | Full experience |
| **Tablet** (640-1024px) | 2 columns | Optimized spacing |
| **Mobile** (<640px) | 1 column | Stacked layout |

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| **Can't find admin button** | Log in as admin user |
| **Upload fails** | Check file size <5MB, format JPG/PNG/WebP |
| **Image not showing** | Verify upload completed ✓ |
| **Form won't submit** | Fill all *required fields |
| **Article missing** | Check "Publish Now" checkbox |
| **Shared link broken** | Verify article is published |

---

## 📝 Content Tips

### Title
- Keep 5-10 words
- Lead with action or benefit
- Example: "New Olive Harvest Breaks Records"

### Excerpt
- First 2-3 sentences of article
- Entice reader to click
- Max 500 characters
- Include key details

### Content
- Use clear paragraphs (one idea per paragraph)
- Break with line breaks for readability
- Consider mobile readers (short lines)
- Capitalize important terms

### Tags
- Separate by comma: "agriculture, news, deleon"
- 3-5 tags per article
- Help with article discovery
- Keep consistent naming

---

## 🔗 Key URLs

```
Public Press Page:       https://yoursite.com/press
Admin Dashboard:         https://yoursite.com/admin/news
Article (by slug):       https://yoursite.com/press/article-title-slug
Article (by category):   https://yoursite.com/press?category=deleon
```

---

## 💾 Under the Hood

### Database Fields (Auto-managed)
- **_id** - MongoDB unique identifier
- **createdAt** - When article was first created
- **updatedAt** - When article was last modified
- **viewCount** - Increments when opened
- **slug** - URL-safe name (auto-generated from title)

### Social Share URLs
- LinkedIn, X, Facebook links auto-generate from article slug
- Copy Link: `https://yoursite.com/press/[slug]`

### Real-Time Sync
- All admin sessions see updates instantly
- No refresh needed when another admin creates/edits/deletes
- Uses Socket.IO WebSocket connection

---

## ✅ Checklist: First Article

- [ ] Log in as admin
- [ ] Navigate to `/press`
- [ ] Click **+ NEW ARTICLE**
- [ ] Enter title in all caps (LUXURY STYLE)
- [ ] Write 2-3 sentence excerpt
- [ ] Write article body (at least 200 words)
- [ ] Select category (DELEON Holdings, Syden, etc)
- [ ] Upload cover image (21:9 hero format)
- [ ] Add 2-3 gallery images (optional)
- [ ] Add tags (comma-separated)
- [ ] Check "Featured" to highlight on press page
- [ ] Check "Publish Now"
- [ ] Click **PUBLISH ARTICLE**
- [ ] See success notification
- [ ] Visit `/press` to see published article
- [ ] Click article to verify detail page
- [ ] Test social share buttons
- [ ] Verify images display correctly

---

**Need Help?** See [NEWS_SYSTEM_GUIDE.md](./NEWS_SYSTEM_GUIDE.md) for full documentation

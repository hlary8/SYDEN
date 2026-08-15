export const shareOnLinkedIn = (article) => {
  const url = `${window.location.origin}/press/${article.slug}`;
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
};

export const shareOnX = (article) => {
  const url = `${window.location.origin}/press/${article.slug}`;
  const text = encodeURIComponent(article.title);
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`, '_blank');
};

export const shareOnFacebook = (article) => {
  const url = `${window.location.origin}/press/${article.slug}`;
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

export const copyLink = (article) => {
  const url = `${window.location.origin}/press/${article.slug}`;
  navigator.clipboard.writeText(url);
  try { window.Toast && window.Toast('Link copied'); } catch (e) {}
};

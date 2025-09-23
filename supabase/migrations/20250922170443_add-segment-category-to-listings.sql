alter table listings
  add column if not exists segment text check (segment in ('BUY','RENT','PROJECT')),
  add column if not exists category_slug text;

create index if not exists idx_listings_segment_created on listings(segment, created_at desc);
create index if not exists idx_listings_category on listings(category_slug);

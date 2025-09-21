import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY =
  defineQuery(`*[_type == "startup" && defined(slug.current) && 
  (!defined($search) || 
    lower(title) match "*" + lower($search) + "*" || 
    lower(category) match "*" + lower($search) + "*" || 
    lower(author->name) match "*" + lower($search) + "*" ||
    lower(author->username) match "*" + lower($search) + "*" ||
    lower(description) match "*" + lower($search) + "*")] 
  | order(_createdAt desc) {
    _id, 
    title, 
    slug, 
    _createdAt,
    author->{
      _id,
      name,
      username,
      slug,
      image,
      bio
    }, 
    views,
    uniqueViewsCount,
    description, 
    category, 
    image,
    likes,
    likesCount,
    editorsChoice
  }`);

export const STARTUP_BY_ID_QUERY =
  defineQuery(`*[_type == "startup" && _id == $id][0]{
  _id,
  title,
  slug,
  _createdAt,
  author->{
    _id,
    name,
    username,
    image,
    bio
  },
  views,
  description,
  category,
  image,
  pitch
}`);

export const AUTHOR_BY_ID_QUERY =
  defineQuery(`*[_type == "author" && _id == $id][0]{
  _id,
  id,
  name,
  username,
  email,
  image,
  bio
}`);


export const AUTHOR_BY_EMAIL_QUERY =
  defineQuery(`*[_type == "author" && email == $email][0]{
  _id,
  id,
  name,
  username,
  email,
  password,
  image,
  bio,
  authProvider,
  resetPasswordToken,
  resetPasswordExpires,
  securityQuestion,
  securityAnswer
}`);

export const PLAYLIST_BY_SLUG_QUERY =
  defineQuery(`*[_type == "playlist" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  select[]->{
    _id,
    _createdAt,
    title,
    slug,
    author->{
      _id,
      name,
      slug,
      image,
      bio
    },
    views,
    uniqueViewsCount,
    description,
    category,
    image,
    pitch,
    likes,
    likesCount,
    editorsChoice
  }
}`);

export const STARTUPS_BY_AUTHOR_QUERY =
  defineQuery(`*[_type == "startup" && author._ref == $id] | order(_createdAt desc){
  _id, 
  title, 
  slug, 
  _createdAt,
  author->{
    _id,
    id,
    name,
    slug,
    image,
  }, 
  views,
  uniqueViewsCount,
  description, 
  category, 
  image,
  likes,
  likesCount,
  editorsChoice
}`);

export const STARTUP_VIEWS_QUERY =
  defineQuery(`*[_type == "startup" && _id == $id][0]{
  _id,
  views
}`);

export const COMMENTS_BY_STARTUP_QUERY =
  defineQuery(`*[_type == "comment" && startup._ref == $startupId && isApproved == true && !defined(parentComment)] | order(_createdAt asc) {
  _id,
  content,
  _createdAt,
  author->{
    _id,
    name,
    username,
    image
  }
}`);

export const REPLIES_BY_COMMENT_QUERY =
  defineQuery(`*[_type == "comment" && parentComment._ref == $commentId && isApproved == true] | order(_createdAt asc) {
  _id,
  content,
  _createdAt,
  author->{
    _id,
    name,
    username,
    image
  }
}`);

export const STARTUP_WITH_LIKES_QUERY =
  defineQuery(`*[_type == "startup" && _id == $id][0]{
  _id,
  title,
  slug,
  _createdAt,
  author->{
    _id,
    name,
    username,
    image,
    bio
  },
  views,
  uniqueViewsCount,
  description,
  category,
  image,
  pitch,
  likes,
  likesCount,
  editorsChoice
}`);

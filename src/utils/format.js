const has = (key, obj) => Object.prototype.hasOwnProperty.call(obj, key)
const getAuthor = entry => {
  if (has('author', entry.entryTags)) {
    return entry.entryTags.author;
  }
  if (has('editor', entry.entryTags)) {
    return `Ed. ${entry.entryTags.editor}`;
  }
  return 'Unknown Author';
}
const getTitle = entry => has('title', entry.entryTags) ? entry.entryTags.title : 'Unknown Title'

export const previewWindow = entry => `Title: ${getTitle(entry).replace(/[{}]+/g, '')}
Author: ${getAuthor(entry).replace(/[{}]+/g, '')}
Year: ${entry.entryTags.date}`;

export const listItem = entry => `${getAuthor(entry).replace(/[{}]+/g, '')} - ${getTitle(entry).replace(/[{}]+/g, '')} (${entry.entryTags.date}) [${entry.citationKey}]`;

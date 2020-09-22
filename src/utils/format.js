export const previewWindow = entry => `Title: ${entry.entryTags.title.replace(/[{}]+/g, '')}
Author: ${entry.entryTags.author.replace(/[{}]+/g, '')}
Year: ${entry.entryTags.date}`;

export const listItem = entry => `${entry.entryTags.author.replace(/[{}]+/g, '')} - ${entry.entryTags.title.replace(/[{}]+/g, '')} (${entry.entryTags.date}) [${entry.citationKey}]`

import { workspace } from 'coc.nvim';
import packageJson from '../../package.json';
const getConfigurationDefault = key => packageJson.contributes.configuration.properties[key].default;
const getConfiguration = async () => {
  const bibtexConfig = await workspace.getConfiguration('bibtex');
  const listConfig = await workspace.getConfiguration('list.source.bibtex');
  const completeConfig = await workspace.getConfiguration('coc.source.bibtex');
  return Object.assign({
    enable: getConfigurationDefault('bibtex.enable'),
    files: getConfigurationDefault('list.source.bibtex.files'),
    citation: getConfigurationDefault('list.source.bibtex.citation'),
    shortcut: getConfigurationDefault('coc.source.bibtex.shortcut'),
    triggerCharacters: getConfigurationDefault('coc.source.bibtex.triggerCharacters'),
    fileTypes: getConfigurationDefault('coc.source.bibtex.filetypes')
  }, bibtexConfig, listConfig, completeConfig);
};

export default getConfiguration;

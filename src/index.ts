import {commands, ExtensionContext, workspace, listManager} from 'coc.nvim'
import BibTeXList from './bibtex'
import {installFzfBibTeX} from './commands'

export async function activate(context: ExtensionContext) {
  let {subscriptions} = context
  let config = workspace.getConfiguration('lists')
  let disabled = config.get('disabledLists', [])
  let {nvim} = workspace

  function isDisabled(name:string): boolean {
    return disabled.indexOf(name) !== -1
  }
  if (!isDisabled('bibtex')) {
    subscriptions.push(listManager.registerList(new BibTeXList(nvim)))
    subscriptions.push(commands.registerCommand('bibtex.install-fzf-bibtex', installFzfBibTeX))
  }
}

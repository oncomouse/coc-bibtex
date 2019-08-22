import { Cite as CoreCite, plugins } from '@citation-js/core'
import '@citation-js/plugin-csl'
import '@citation-js/plugin-bibtex'

function clone (obj: object) {
  const copy = {}
  for (let key in obj) {
    copy[key] = typeof obj[key] === 'object' ? clone(obj[key]) : obj[key]
  }
  return copy
}

function Cite(data, opts: object): void {
  if (!(this instanceof Cite)) {
    return new Cite(data, opts)
  }
  var self = new CoreCite(data, opts)
  this._options = self._options
  this.log = self.log
  this.data = self.data
}
Cite.prototype = Object.create(CoreCite.prototype)
Cite.plugins = clone(plugins)
Cite.parse = Object.assign({
  bibtex: ((bibtex) => ({
    json: bibtex.parsers.json.parse,
    prop: bibtex.parsers.prop.parse,
    text: bibtex.parsers.text.parse,
    type: bibtex.parsers.type.parse
  }))(require('@citation-js/plugin-bibtex/lib/input')),
})

export default Cite

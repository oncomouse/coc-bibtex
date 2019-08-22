# coc-bibtex

This [Coc](https://github.com/neoclide/coc.nvim) extension adds a BibTeX source to CocList. You can access it by running `:CocList bibtex` in (Neo)Vim. You can also use it as an autocompletion source for BibTeX entries.

## Installation

Run `:CocInstall coc-bibtex` to install.

## Configuration

Set `list.source.bibtex.files` to an array containing your `.bib` files. For instance, in `coc-settings.json`:

~~~json
{
// …
  "list": {
    "source": {
      "bibtex": {
        "files": [
          "~/my-library.bib"
        ]
      }
    }
  }
// …
}
~~~

Or in vimrc:

~~~
call coc#config('list.source.bibtex', {
  \  'files': [
  \    '~/my-library.bib'
  \  ]
  \})
~~~

## Todo

* [ ] Add the ability to pass a `.bib` file as an argument to the list call
* [ ] Color
